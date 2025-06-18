import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import { PlaywrightCrawlerService } from '../services/playwrightCrawlerService';

 const startScrapingParams = z.object({
    url: z.string().url(),
    taskName: z.string().min(1).max(64)
 });

@injectable()
export class ScraperController {
    constructor(
        @inject(PlaywrightCrawlerService) private scraperService: PlaywrightCrawlerService
    ) {}

    /**
     * 
     * @param req url 定义爬虫的起始位置
     * @param req taskName 定义使用那个爬虫
     * @param res 
     * @returns 
     */
    public async startScraping(req: Request, res: Response): Promise<void> {
        try {
            const { url, taskName } = req.query; // Get the URL from the request body
            const result = startScrapingParams.safeParse(req.query);
            if (!result.success) {
                res.status(400).json({ success: false, message: '参数不合法' });
                return;
            }
            this.scraperService.scrape(url as string, taskName as string); // Call the scrape method from ScraperService
            res.status(200).json({ success: true }); // Respond with success and scraped data
        } catch (error: unknown) {
            const err = error as Error; // Cast error to Error type
            res.status(500).json({ success: false, message: err.message }); // Handle errors and respond
        }
    }
}