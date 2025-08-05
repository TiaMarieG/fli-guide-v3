#!/bin/bash

# Use for first deployment, code updates, or VPS reboot recovery

echo "Stopping existing containers..."
docker compose down

echo "Rebuilding and restarting containers..."
docker compose up --build -d
