#!/bin/bash

if [ ! -f .env ]; then
echo "Creating .env file from example..."
cp .env.example .env
fi

docker-compose up -d

echo "Waiting for services to start..."
sleep 5

echo "Services started. Showing logs..."
docker-compose logs -f
