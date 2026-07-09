# Coolify VPS Deploy Guide — Mobile Lube

এই প্রজেক্ট Coolify-তে **Dockerfile** দিয়ে deploy করার জন্য প্রস্তুত। নিচের ধাপগুলো অনুসরণ করুন।

---

## ১. আগে যা লাগবে

- Coolify ইনস্টল করা VPS
- GitHub/GitLab repo-তে কোড push করা
- Domain (যেমন `mobilelube.co`) DNS → Coolify server IP
- Stripe live keys (production payment)
- Google Places API key + Place ID

---

## ২. Coolify-তে MySQL তৈরি করুন

1. Coolify Dashboard → **+ New Resource** → **Database** → **MySQL**
2. Database name, user, password নোট করুন
3. Internal hostname কপি করুন (যেমন `mysql-xxxxx`)

---

## ৩. Application তৈরি করুন

1. **+ New Resource** → **Application**
2. Git repo connect করুন
3. **Build Pack**: `Dockerfile` (Nixpacks নয়)
4. **Port**: `80`
5. **Health Check Path**: `/up`
6. Domain যোগ করুন: `mobilelube.co` (এবং `www` চাইলে)

---

## ৪. Persistent Storage (গুরুত্বপূর্ণ)

Avatar upload-এর জন্য storage persist করতে হবে:

| Container Path              | Purpose              |
|----------------------------|----------------------|
| `/var/www/storage/app`     | Uploaded files       |
| `/var/www/storage/logs`    | Application logs     |

Coolify → Application → **Storages** → উপরের path দুটো mount করুন।

---

## ৫. Environment Variables

Coolify → Application → **Environment Variables**-এ সেট করুন:

### App (required)

```env
APP_NAME="Mobile Lube"
APP_ENV=production
APP_KEY=base64:xxxxxxxx   # php artisan key:generate --show
APP_DEBUG=false
APP_URL=https://mobilelube.co
ASSET_URL=https://mobilelube.co

LOG_CHANNEL=stack
LOG_LEVEL=error
```

### Database (required)

```env
DB_CONNECTION=mysql
DB_HOST=<coolify-mysql-internal-host>
DB_PORT=3306
DB_DATABASE=mobilelube
DB_USERNAME=mobilelube
DB_PASSWORD=<your-password>
```

### Session / Queue / Cache (required)

```env
SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=public
```

### Mail

```env
MAIL_MAILER=smtp
MAIL_HOST=<your-smtp-host>
MAIL_PORT=587
MAIL_USERNAME=<smtp-user>
MAIL_PASSWORD=<smtp-password>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=mobilelube0@gmail.com
MAIL_FROM_NAME="Mobile Lube"
```

### Stripe (required for payments)

```env
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd
```

### Google Reviews

```env
GOOGLE_PLACES_API_KEY=<your-api-key>
GOOGLE_PLACE_ID=ChIJwa4MKgxjQoYRP7xBsagpQj0
GOOGLE_WRITE_REVIEW_URL=https://search.google.com/local/writereview?placeid=ChIJwa4MKgxjQoYRP7xBsagpQj0
GOOGLE_BUSINESS_SEARCH_QUERY="Mobile Lube, LLC Victoria, TX"
GOOGLE_REVIEWS_CACHE_TTL=86400
```

### First deploy only (seed data)

```env
RUN_SEEDER=true
```

প্রথম deploy সফল হওয়ার পর `RUN_SEEDER` **মুছে দিন** বা `false` করুন।

---

## ৬. APP_KEY জেনারেট

লোকাল মেশিনে:

```bash
php artisan key:generate --show
```

আউটপুট কপি করে Coolify-তে `APP_KEY` হিসেবে দিন।

---

## ৭. Deploy

1. Coolify-তে **Deploy** চাপুন
2. Build শেষ হলে container চালু হবে
3. Supervisor স্বয়ংক্রিয়ভাবে চালাবে:
   - Nginx + PHP-FPM
   - Queue worker
   - Scheduler
   - **Google reviews sync** (৪৫ সেকেন্ড পর প্রথমবার, তারপর প্রতি ৬ ঘণ্টা)

> **প্রথম deploy-এ** Coolify terminal থেকে একবার চালান:
> ```bash
> php artisan migrate --force
> php artisan db:seed --force
> php artisan storage:link
> ```

---

## ৮. Deploy পর চেকলিস্ট

- [ ] `https://mobilelube.co` খুলে homepage দেখুন
- [ ] Login / Register কাজ করছে কিনা
- [ ] Admin panel (`/admin/login`) accessible
- [ ] Booking flow test করুন
- [ ] Google reviews section-এ live review দেখাচ্ছে কিনা
- [ ] Stripe test payment (live mode সাবধানে)

---

## ৯. Stripe Webhook (Production)

Stripe Dashboard → Webhooks → Add endpoint:

```
https://mobilelube.co/stripe/webhook
```

Events: `checkout.session.completed`, `payment_intent.succeeded` (আপনার app যেগুলো ব্যবহার করে)

`STRIPE_WEBHOOK_SECRET` Coolify env-এ আপডেট করুন।

---

## ১০. Google API Restrictions

Google Cloud Console → API key restrictions:

- **HTTP referrers**: `https://mobilelube.co/*`
- **APIs**: Places API (New) enable করুন

---

## ১১. SSL

Coolify domain-এ automatic Let's Encrypt SSL দেয়। DNS সঠিক হলে কয়েক মিনিটে active হবে।

---

## ১২. Manual Commands (Coolify Terminal)

প্রয়োজনে Coolify container terminal থেকে:

```bash
php artisan reviews:sync-google
php artisan db:seed --force
php artisan cache:clear
php artisan config:clear
```

---

## ১৩. Troubleshooting

| সমস্যা | সমাধান |
|--------|---------|
| 502 Bad Gateway | Build log দেখুন; DB env vars ঠিক আছে কিনা |
| 500 Error | `storage/logs/laravel.log` দেখুন |
| CSS/JS load হয় না | `APP_URL` ও `ASSET_URL` domain match করছে কিনা |
| Reviews দেখায় না | `GOOGLE_PLACES_API_KEY` সেট আছে কিনা; `php artisan reviews:sync-google` |
| Queue কাজ করে না | `QUEUE_CONNECTION=database`; jobs table আছে কিনা |
| Upload কাজ করে না | Persistent storage mount করা আছে কিনা |

---

## Architecture (Docker)

```
Nginx (:80)
  └── PHP-FPM
Supervisor
  ├── Queue Worker (x2)
  ├── Scheduler (daily tasks)
  └── Google Reviews Sync (every 6 hours)
```

Health check: `GET /up` (nginx static OK)
