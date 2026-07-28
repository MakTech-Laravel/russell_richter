#!/usr/bin/env bash
set -euo pipefail

cd /var/www

mkdir -p storage/logs

exec /usr/local/bin/php /var/www/artisan queue:work \
    --sleep=3 \
    --tries=3 \
    --backoff=15 \
    --max-time=3600 \
    --timeout=120 \
    --memory=256 \
    --queue=default
