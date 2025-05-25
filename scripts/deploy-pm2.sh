#!/bin/bash

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Install dependencies
npm install

# Build the TypeScript files
npm run build

# Start the application using PM2
pm2 start dist/app.js --name "advanced-web-scraper" --watch

# Save the PM2 process list
pm2 save

# Display the PM2 process list
pm2 list

# Output the logs for the application
pm2 logs advanced-web-scraper