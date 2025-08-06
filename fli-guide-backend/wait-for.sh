#!/bin/sh

set -e

echo "Waiting for MySQL at $DB_HOST:$DB_PORT..."

# Use Node.js to check port instead of netcat
while ! node -e "
  const net = require('net');
  const socket = new net.Socket();
  socket.setTimeout(1000);
  socket.on('error', () => process.exit(1));
  socket.on('timeout', () => process.exit(1));
  socket.connect(process.env.DB_PORT, process.env.DB_HOST, () => {
    socket.end();
  });
"; do
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
