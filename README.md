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
│   ├── controllers
│   ├── routes
│   ├── services
│   │   ├── scraperService.ts
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
   yarn install
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


## 新增爬虫的过程
- 新增爬虫第一步：新增爬虫的数据提取器名称
- 新增爬虫第二步：定义爬虫数据存储
- 新增爬虫第三步：自定义提取器

## Scripts 命令说明

### Prisma 相关
```bash
# 生成 Prisma 客户端 (根据 schema 生成类型)
yarn run prisma:gen

# 开发环境迁移 (创建+执行迁移)
yarn run prisma:migrate

# 启动数据库管理界面
yarn run prisma:studio

# 执行种子数据
yarn run prisma:seed

# 重置数据库 (删除并重建)
yarn run prisma:reset

# 生产环境迁移 (仅执行未应用的迁移)
yarn run prisma:deploy

# 将 schema 变更直接推送到数据库
yarn run prisma:db:push

# 从数据库逆向生成 schema
yarn run prisma:db:pull
```

#### 使用场景：
- **日常开发**：`migrate` + `studio`
- **初始化项目**：`reset` + `seed`
- **生产部署**：`deploy`
- **原型开发**：`push` (快速同步)
- **已有数据库**：先用 `pull` 生成初始 schema