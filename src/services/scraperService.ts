import { PlaywrightCrawler, Dataset } from 'crawlee'; // 替换 Puppeteer 为 Playwright
import { injectable } from 'tsyringe';
import { ProxyService } from './proxyService';
import logger from '../utils/logger';
import { PLAYWRIGHT_CRAWLER_CONFIG } from '../config/crawlee'; // 替换为 Playwright 的配置
import { extractDataByUrl } from '../extracts/index';

@injectable()
export class ScraperService {
    private crawler: PlaywrightCrawler;
    private proxyService: ProxyService;
    private taskStatus: Map<string, string>; // 用于存储任务状态

    constructor() {
        this.proxyService = new ProxyService();
        this.taskStatus = new Map(); // 初始化任务状态存储

        // 初始化 PlaywrightCrawler
        this.crawler = new PlaywrightCrawler({
            ...PLAYWRIGHT_CRAWLER_CONFIG,
            // 代理配置
            proxyConfiguration: this.proxyService.configurePuppeteerProxy(),

            // 请求拦截器
            requestHandler: async ({ page, request }) => {
                const taskId = request.url;
                this.taskStatus.set(taskId, 'in-progress'); // 设置任务状态为进行中

                try {
                    logger.info(`Scraping URL: ${request.url}`);
                    const data = await extractDataByUrl(page);
                    await this.storeData(taskId, data); // 存储数据到 Dataset
                    this.taskStatus.set(taskId, 'completed'); // 设置任务状态为已完成
                } catch (error: any) {
                    logger.error(`Error scraping ${request.url}: ${error.message}`);
                    this.taskStatus.set(taskId, 'failed'); // 设置任务状态为失败
                }
            },
        });
    }

    // 单独爬取一个 URL 的方法
    public async scrape(url: string): Promise<void> {
        const taskId = url; // 使用 URL 作为任务 ID
        this.taskStatus.set(taskId, 'in-progress'); // 设置任务状态为进行中

        try {
            logger.info(`Starting scrape for URL: ${url}`);
            await this.crawler.addRequests([{ requestsFromUrl: url }]); // 将 URL 添加到爬取队列
            await this.crawler.run(); // 启动爬取任务
            this.taskStatus.set(taskId, 'completed'); // 设置任务状态为已完成
        } catch (error: any) {
            logger.error(`Error scraping ${url}: ${error.message}`);
            this.taskStatus.set(taskId, 'failed'); // 设置任务状态为失败
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
    public getTaskStatus(taskId: string): string {
        return this.taskStatus.get(taskId) || 'not-found'; // 返回任务状态或未找到
    }

    // 停止特定任务的方法
    public async stop(taskId: string): Promise<void> {
        try {
            // 检查任务是否存在
            const status = this.taskStatus.get(taskId);
            if (!status) {
                throw new Error(`Task with ID ${taskId} not found.`);
            }

            // 如果任务已经完成或失败，则无法停止
            if (status === 'completed' || status === 'failed') {
                throw new Error(`Task with ID ${taskId} is already ${status} and cannot be stopped.`);
            }

            // 设置任务状态为 "stopped"
            this.taskStatus.set(taskId, 'stopped');
            logger.info(`Task with ID ${taskId} has been stopped.`);
        } catch (error: any) {
            logger.error(`Error stopping task ${taskId}: ${error.message}`);
            throw error; // 将错误抛出以便调用方处理
        }
    }

    // 获取爬取的数据
    public async getScrapedData(taskId: string): Promise<any> {
        try {
            // 检查任务是否存在
            const status = this.taskStatus.get(taskId);
            if (!status) {
                throw new Error(`Task with ID ${taskId} not found.`);
            }

            // 如果任务未完成，则无法获取数据
            if (status !== 'completed') {
                throw new Error(`Task with ID ${taskId} is not completed. Current status: ${status}`);
            }

            // 从 Dataset 中获取数据
            const data = await Dataset.getData();
            const taskData = data.items.find((item: any) => item.taskId === taskId);
            if (!taskData) {
                throw new Error(`No data found for Task ID ${taskId}`);
            }

            return taskData;
        } catch (error: any) {
            logger.error(`Error retrieving data for Task ID ${taskId}: ${error.message}`);
            throw error; // 将错误抛出以便调用方处理
        }
    }
}