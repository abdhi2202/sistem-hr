#!/bin/sh
set -eu

cd /var/www/html

if [ -z "${APP_KEY:-}" ]; then
    echo "APP_KEY is required. Generate one with: php artisan key:generate --show"
    exit 1
fi

mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

php artisan migrate --force

if [ "${APP_ENABLE_DEMO_SEED:-true}" = "true" ]; then
    php artisan db:seed --class=Database\\Seeders\\DemoHrSeeder --force
fi

apache2-foreground
