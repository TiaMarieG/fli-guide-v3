#!/bin/sh

# Exit on error
set -e  

# Wait until MySQL is reachable
echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "MySQL is up — running migrations and seeds..."

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

echo "Starting server..."
npm start
