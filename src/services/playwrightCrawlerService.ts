import { PlaywrightCrawler, Dataset, PlaywrightRequestHandler } from 'crawlee'; // 替换 Puppeteer 为 Playwright
import { inject, injectable } from 'tsyringe';
import { ProxyService } from './proxyService';
import logger from '../utils/logger';
import { PLAYWRIGHT_CRAWLER_CONFIG, CRAWLEE_MAX_INSTANCES } from '../config/crawlee'; // 替换为 Playwright 的配置
import { extractDataByUrl } from '../scraper/index';
import QueueManageService, { TaskDoneCallback } from './queueManageService'; // 引入队列管理服务
import { v4 as uuidv4 } from 'uuid';

@injectable()
export class PlaywrightCrawlerService {
    // 使用 Map 存储任务 ID 和对应的爬虫实例
    private crawlers = new Map<string, PlaywrightCrawler>(); // 使用 Map 存储任务 ID 和对应的爬虫实例

    constructor(
         @inject(QueueManageService) private queueManageService: QueueManageService,
         @inject(ProxyService) private proxyService: ProxyService,
    ) {
    }

    // 任务名称加hash生成任务 ID
    public generateTaskId(taskName: string): string {
        const shortUuid = uuidv4().replace(/-/g, '').slice(0, 24); // 12位短uuid
        // 确保scrapeName不要太长了；否则直接报错
        if (!taskName || taskName.trim() === '') {
            throw new Error('Scraper name is required to generate a task ID');
        }
        if (taskName.length > 64) {
            throw new Error(`Scraper name "${taskName}" is too long. It should be 64 characters or less.`);
        }

        let id = `c-${taskName}-${shortUuid}`;
        return id;
    }

    // 每个类型的爬虫共享爬虫实例
    private createCrawlerInstance(taskId: string): PlaywrightCrawler {
        try {
            // 爬虫实例已存在，直接返回
            if (this.crawlers.has(taskId)) {
                logger.info(`Crawler instance for ID ${taskId} already exists`);
                return this.crawlers.get(taskId) as PlaywrightCrawler;
            }

            // 爬虫实例超出上限，禁止创建新的爬虫实例
            if (this.crawlers.size >= CRAWLEE_MAX_INSTANCES) {
                logger.error(`Crawler instances limit reached: ${CRAWLEE_MAX_INSTANCES}`);
                throw new Error(`crawler instances Maximum limit reached: ${CRAWLEE_MAX_INSTANCES}`);
            }

            const requestHandler: PlaywrightRequestHandler = async ({ page, request, response }) => {
                // 获取响应状态码
                const status = response?.status();
                // 如果响应状态码不是 200，直接返回
                if (status && status !== 200) {
                    logger.warn(`Request Fail: ${request.url}   Status: ${status}`);
                    return;
                }

                // 如果响应状态码是 200，继续处理
                logger.info(`Request Success: ${request.url}   Status: ${status}`);
                try {
                    await extractDataByUrl(taskId, page); // 调用提取数据函数
                } catch (error: any) {
                    logger.error(`Error scraping ${request.url}: ${error.message}`);
                }
            };

            const crawler = new PlaywrightCrawler({
                ...PLAYWRIGHT_CRAWLER_CONFIG,
                preNavigationHooks: [...PLAYWRIGHT_CRAWLER_CONFIG.preNavigationHooks],
                requestHandler,
            });

            this.crawlers.set(taskId, crawler); // 将爬虫实例存储到 Map 中
            logger.info(`Crawler instance for ID ${taskId} created successfully`);
            return crawler; // 返回创建的爬虫实例
        } catch (error: any) {
            logger.error(`Error crawler instance creating fail: ${error.message}`);
            throw error; // 抛出错误以便调用者处理
        }
    }

    // 添加爬虫任务
    private addScrapeTask(taskId: string, urls: string | string[]): (callback: TaskDoneCallback) => void {
        // 确保传入的 URL 是字符串或字符串数组
        if (!urls || (typeof urls !== 'string' && !Array.isArray(urls))) {
            throw new Error('Invalid URL provided. It must be a string or an array of strings.');
        }
       
        // 创建或获取爬虫实例
        const crawler = this.createCrawlerInstance(taskId); 
        const urlList = Array.isArray(urls) ? urls : [urls]; // 确保 urls 是数组
        return this.queueManageService.addTask(taskId, async () => {
            try {
                logger.info(`Starting scrape for URL: ${taskId}`);
                await crawler.addRequests(urlList.map(url => ({ url }))); // 添加请求到爬虫实例
                await crawler.run();
                logger.info(`Scraping completed for URL: ${taskId}`);
            } catch (error: any) {
                logger.error(`Error scraping ${taskId}: ${error.message}`);
            }
        });
    }

    // 注销爬虫实例，释放内存
    private async unregisterCrawlerInstance(onTaskDone: (callback: TaskDoneCallback) => void): Promise<void> {
        // 等taskId下注册的任务队列全部完成时，注销爬虫实例，释放内存
        onTaskDone((taskId) => {
            // 如果是测试环境，不注销爬虫实例; 方便调试
            if (process.env.NODE_ENV === 'development') return;
            logger.info(`Task ${taskId} has been processed and is now complete`);
            this.crawlers.delete(taskId); // 删除爬虫实例
            logger.info(`Task ${taskId} completed successfully`);
        });
    }

    // 爬虫启动器
    public async scrape(urls: string | string[], taskName: string): Promise<void> {
        const taskId = this.generateTaskId(taskName); // 使用 URL 的主机名作为任务 ID

        try {
            // 创建或获取爬虫实例
            const crawler = this.createCrawlerInstance(taskId); 

            if (!crawler) {
                logger.error(`Crawler instance for task ID ${taskId} not found`);
                throw new Error(`Crawler instance for task ID ${taskId} not found`);
            }

            // 添加爬虫任务
            const onTaskDone = this.addScrapeTask(taskId, urls);
            // 注销爬虫实例，释放内存
            this.unregisterCrawlerInstance(onTaskDone);
        } catch (error: any) {
            logger.error(`Error in scrape method: ${error.message}`);
            throw error; // 抛出错误以便调用者处理
        }
       
    }

    // 获取特定任务的状态

    // 停止特定任务的方法

    // 获取爬取的数据
}