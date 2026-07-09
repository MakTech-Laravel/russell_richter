#!/bin/sh
set -e

cd /var/www

echo "==> Waiting for database..."
max_tries=30
try=0
until php artisan db:show > /dev/null 2>&1; do
    try=$((try + 1))
    if [ "$try" -ge "$max_tries" ]; then
        echo "Database connection failed after ${max_tries} attempts."
        exit 1
    fi
    echo "  attempt ${try}/${max_tries}..."
    sleep 2
done
echo "==> Database is ready."

echo "==> Running migrations..."
php artisan migrate --force --no-interaction

echo "==> Linking storage..."
php artisan storage:link --force 2>/dev/null || true

echo "==> Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache 2>/dev/null || true

if [ "${RUN_SEEDER:-false}" = "true" ]; then
    echo "==> Seeding database..."
    php artisan db:seed --force --no-interaction
fi

if [ -n "${GOOGLE_PLACES_API_KEY:-}" ]; then
    echo "==> Syncing Google reviews..."
    php artisan reviews:sync-google --no-interaction || true
fi

echo "==> Starting services..."
exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf
