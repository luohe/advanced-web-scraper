import { PlaywrightCrawler, Dataset, chromium } from 'crawlee'; // 替换 Puppeteer 为 Playwright
import { injectable } from 'tsyringe';
import { ProxyService } from './proxyService';
import logger from '../utils/logger';
import { PLAYWRIGHT_CRAWLER_CONFIG, CRAWLEE_MAX_INSTANCES } from '../config/crawlee'; // 替换为 Playwright 的配置
import { extractDataByUrl } from '../extracts/index';


@injectable()
export class ScraperService {
    private browser: any; // 用于存储浏览器实例
    // 创建一个示例列表，用于存储爬取的任务
    private crawlers = new Map<string, PlaywrightCrawler>(); // 使用 Map 存储任务 ID 和对应的爬虫实例
    private proxyService: ProxyService;

    constructor() {
        this.proxyService = new ProxyService();
    }

    // 生成一个chromium浏览器实例
    private async createBrowserInstance(): Promise<void> {
        try {
            this.browser = await chromium.launch({ headless: true }); // 启动 Chromium 浏览器
            logger.info('Chromium browser instance created successfully');
        } catch (error: any) {
            logger.error(`Error creating Chromium browser instance: ${error.message}`);
            throw error; // 抛出错误以便调用者处理
        }
    }

    // 关闭chromium浏览器实例
    private async closeBrowserInstance(browser: any): Promise<void> {
        try {
            if (browser) {
                await browser.close(); // 关闭浏览器实例
                logger.info('Chromium browser instance closed successfully');
            } else {
                logger.warn('No browser instance to close');
            }
        } catch (error: any) {
            logger.error(`Error closing Chromium browser instance: ${error.message}`);
            throw error; // 抛出错误以便调用者处理
        }
    }

    // 使用共享的浏览器实例创建一个爬虫实例
    // 为后续多网络、多设备、多地域等差异化配置留入口
    private async createCrawlerInstance(id: string): Promise<void> {
        try {
            if (!this.browser) {
                await this.createBrowserInstance(); // 如果没有浏览器实例，则创建一个
            }

            // 爬虫实例超出上限，禁止创建新的爬虫实例
            if (this.crawlers.size >= CRAWLEE_MAX_INSTANCES) {
                logger.error(`Maximum crawler instances limit reached: ${CRAWLEE_MAX_INSTANCES}`);
                throw new Error(`Maximum crawler instances limit reached: ${CRAWLEE_MAX_INSTANCES}`);
            }

            // 爬虫实例已存在，直接返回
            if (this.crawlers.has(id)) {
                logger.info(`Crawler instance for ID ${id} already exists`);
                return;
            }

            const crawler = new PlaywrightCrawler({
                ...PLAYWRIGHT_CRAWLER_CONFIG,
                launchContext: { launcher: this.browser }, // 使用共享的浏览器实例
                requestHandler: async ({ page, request }) => {
                    const taskId = request.url;
                    try {
                        logger.info(`Scraping URL: ${request.url}`);
                        const data = await extractDataByUrl(page);
                        await this.storeData(taskId, data); // 存储数据到 Dataset
                    } catch (error: any) {
                        logger.error(`Error scraping ${request.url}: ${error.message}`);
                    }
                },
            });

            this.crawlers.set(id, crawler); // 将爬虫实例存储到 Map 中
            logger.info(`Crawler instance for ID ${id} created successfully`);
        } catch (error: any) {
            logger.error(`Error creating crawler instance: ${error.message}`);
            throw error; // 抛出错误以便调用者处理
        }
    }

    // 单独爬取一个 URL 的方法
    public async scrape(url: string): Promise<void> {
        if (!url) {
            throw new Error('URL is required for scraping');
        }
        const taskId = new URL(url).hostname; // 使用 URL 的主机名作为任务 ID
        await this.createCrawlerInstance(taskId); // 创建或获取爬虫实例
        const crawler = this.crawlers.get(taskId); // 获取对应的爬虫实例
        if (!crawler) {
            logger.error(`Crawler instance for task ID ${taskId} not found`);
            throw new Error(`Crawler instance for task ID ${taskId} not found`);
        }

        try {
            // 开始爬取任务
            logger.info(`Starting scrape for URL: ${url}`);
            await crawler.addRequests([{ url }]); // 将 URL 添加到爬取队列
            await crawler.run(); // 启动爬取任务
            logger.info(`Scraping completed for URL: ${url}`);
        } catch (error: any) {
            logger.error(`Error scraping ${url}: ${error.message}`);
        } finally {
            this.crawlers.delete(taskId); // 从 Map 中删除爬虫实例
            if (this.crawlers.size === 0) {
                await this.closeBrowserInstance(this.browser); // 如果没有爬虫实例，关闭浏览器
                this.browser = null; // 清空浏览器实例
            }
            logger.info(`Crawler instance for ID ${taskId} deleted`);
        }
    }

    // 存储爬取的数据到 Dataset
    private async storeData(taskId: string, data: any) {
        try {
            logger.info(`Storing data for Task ID ${taskId}`);
            await Dataset.pushData({ taskId, ...data }); // 将数据存储到 Dataset
        } catch (error: any) {
            logger.error(`Error storing data for Task ID ${taskId}: ${error.message}`);
            throw error;
        }
    }

    // 获取特定任务的状态

    // 停止特定任务的方法

    // 获取爬取的数据
}