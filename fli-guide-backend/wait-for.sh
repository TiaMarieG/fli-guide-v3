#!/bin/sh

set -e

# Use fallback values if environment variables are not set
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."

# Use Node.js to check TCP connection to the DB
while ! node -e "
  const net = require('net');
  const socket = new net.Socket();
  socket.setTimeout(1000);
  socket.on('error', () => process.exit(1));
  socket.on('timeout', () => process.exit(1));
  socket.connect(${DB_PORT}, '${DB_HOST}', () => {
    socket.end();
  });
"; do
  sleep 1
done

echo "MySQL is up — verifying sequelize packages..."

# Make sure sequelize dependencies are installed
node -e "require('sequelize')"
node -e "require('sequelize-cli')"

echo "Running migrations and seeds..."
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all

echo "Starting server..."
npm start
