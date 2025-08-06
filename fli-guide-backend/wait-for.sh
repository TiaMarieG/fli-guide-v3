#!/bin/sh

set -e

echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."

while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done

echo "MySQL is up — verifying sequelize packages..."

# Make sure sequelize and sequelize-cli are resolvable before continuing
node -e "require('sequelize')"
node -e "require('sequelize-cli')"

echo "Running migrations and seeds..."

npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

echo "Starting server..."
npm start
