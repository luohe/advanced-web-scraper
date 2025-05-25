#!/bin/bash

# This script is used to start the application in a local development environment.

# Load environment variables from .env file
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the application using ts-node for TypeScript support
echo "Starting the application..."
npx ts-node src/app.ts

# Note: You can replace `ts-node` with `nodemon` for automatic restarts during development
# npx nodemon src/app.ts