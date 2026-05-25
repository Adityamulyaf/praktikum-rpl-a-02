#!/usr/bin/env sh
set -e

cd /var/www

if [ ! -f .env ] && [ -f .env.example ]; then
    cp .env.example .env
fi

if [ ! -f vendor/autoload.php ]; then
    composer install --no-interaction --prefer-dist --optimize-autoloader
fi

chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

if [ -f artisan ]; then
    php artisan key:generate --force --no-interaction >/dev/null 2>&1 || true
    php artisan config:clear --no-interaction >/dev/null 2>&1 || true
    php artisan migrate --force --no-interaction
    php artisan db:seed --force --no-interaction
fi

exec "$@"
