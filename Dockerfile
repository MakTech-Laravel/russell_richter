FROM php:8.3-fpm

COPY ./docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Install dependencies
RUN apt-get update && apt-get install -y \
    nginx git unzip curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    libjpeg62-turbo-dev libfreetype6-dev supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring zip gd \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
COPY . .

# Use file-based drivers during image build so artisan/vite do not need a live database.
ENV APP_ENV=local \
    SESSION_DRIVER=file \
    CACHE_STORE=file \
    QUEUE_CONNECTION=sync \
    DB_CONNECTION=sqlite

RUN cp .env.example .env || touch .env \
    && mkdir -p storage/framework/{views,sessions,cache} storage/logs bootstrap/cache \
    && php artisan key:generate --force --no-interaction \
    && composer install --no-dev --optimize-autoloader --no-interaction \
    && php artisan wayfinder:generate --no-interaction \
    && npm ci \
    && npm run build \
    && chown -R www-data:www-data /var/www \
    && chmod -R 775 storage bootstrap/cache

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
