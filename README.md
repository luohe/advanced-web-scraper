# Advanced Web Scraper

## Overview
The Advanced Web Scraper is a comprehensive web scraping framework built using modern technologies such as Crawlee, Puppeteer, and Cheerio. It is designed to handle dynamic web pages, manage data storage, implement task queues, support concurrency, and facilitate automatic retries and proxy rotation. The framework also includes a web service for easy interaction.

## Features
- **Dynamic Page Scraping**: Utilizes Puppeteer for rendering JavaScript-heavy websites.
- **Data Storage**: Uses SQLite as a self-contained, serverless database for storing scraped data.
- **Task Queue Management**: Implements a queue system to manage scraping tasks efficiently.
- **Concurrency Support**: Allows multiple scraping tasks to run simultaneously.
- **Automatic Retry Mechanism**: Automatically retries failed requests to improve reliability.
- **Proxy Rotation**: Supports rotating proxies to avoid IP bans and improve scraping success rates.
- **Web Service Integration**: Provides a RESTful API for interacting with the scraper.

## Project Structure
```
advanced-web-scraper
├── src
│   ├── app.ts
│   ├── config
│   │   ├── database.ts
│   │   ├── puppeteer.ts
│   │   └── crawlee.ts
│   ├── controllers
│   │   ├── scraperController.ts
│   │   └── apiController.ts
│   ├── routes
│   │   └── index.ts
│   ├── services
│   │   ├── scraperService.ts
│   │   ├── queueService.ts
│   │   └── proxyService.ts
│   ├── utils
│   │   ├── logger.ts
│   │   ├── retryHandler.ts
│   │   └── dataParser.ts
│   ├── middlewares
│   │   └── errorHandler.ts
│   ├── types
│   │   └── index.ts
│   └── database
│       └── sqlite.db
├── tests
│   ├── scraperService.test.ts
│   ├── apiController.test.ts
│   └── queueService.test.ts
├── public
│   └── index.html
├── scripts
│   ├── start-local.sh
│   ├── deploy-pm2.sh
│   └── test.sh
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── pm2.config.js
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd advanced-web-scraper
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in the `.env` file.

## Usage
- To start the application in a local development environment, run:
  ```
  ./scripts/start-local.sh
  ```
- To deploy the application using PM2, run:
  ```
  ./scripts/deploy-pm2.sh
  ```
- To run tests, execute:
  ```
  ./scripts/test.sh
  ```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.