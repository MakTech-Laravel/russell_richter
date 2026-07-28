#!/usr/bin/env bash
set -euo pipefail

cd /var/www

mkdir -p \
    storage/app/public \
    storage/framework/{cache,sessions,views} \
    storage/logs \
    bootstrap/cache \
    /var/log/supervisor \
    /var/run

# Remove stale supervisor socket from a previous crash.
rm -f /var/run/supervisor.sock /var/run/supervisord.pid

# Coolify persistent volumes remount as root; keep Laravel writable for www-data.
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R ug+rwx storage bootstrap/cache || true

# Wait briefly for MySQL so queue workers do not FATAL on first boot.
if [[ "${DB_CONNECTION:-}" == "mysql" && -n "${DB_HOST:-}" ]]; then
    echo "[entrypoint] Waiting for database ${DB_HOST}:${DB_PORT:-3306}..."
    for _ in $(seq 1 30); do
        if php -r '
            try {
                $host = getenv("DB_HOST") ?: "127.0.0.1";
                $port = getenv("DB_PORT") ?: "3306";
                $db = getenv("DB_DATABASE") ?: "";
                $user = getenv("DB_USERNAME") ?: "";
                $pass = getenv("DB_PASSWORD") ?: "";
                new PDO(
                    "mysql:host={$host};port={$port};dbname={$db}",
                    $user,
                    $pass,
                    [PDO::ATTR_TIMEOUT => 2]
                );
                exit(0);
            } catch (Throwable $e) {
                exit(1);
            }
        '; then
            echo "[entrypoint] Database is ready."
            break
        fi
        sleep 2
    done
fi

exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf
