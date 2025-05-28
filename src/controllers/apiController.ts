import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { ScraperService } from '../services/playwrightCrawlerService';

@injectable()
export class ApiController {
    constructor(
        @inject(ScraperService) private scraperService: ScraperService
    ) {}

    // 获取爬取任务状态
    public async getScrapingStatus(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params;
            const status = await this.scraperService.getTaskStatus(taskId);
            res.status(200).json({ taskId, status });
        } catch (error: any) {
            res.status(500).json({ error: '获取任务状态失败', details: error.message });
        }
    }

    // 获取爬取的数据
    public async getScrapedData(req: Request, res: Response): Promise<void> {
        const { taskId } = req.params;
        try {
            const data = await this.scraperService.getScrapedData(taskId);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ error: '获取爬取数据失败', details: error.message });
        }
    }
}