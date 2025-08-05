#!/bin/bash

# Use for fresh start of Docker environment - Wipes everything

echo "Tearing down existing containers and volumes..."
docker compose down -v

echo "Rebuilding and starting fresh containers..."
docker compose up --build -d
