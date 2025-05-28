import { Request, Response } from 'express';
import { inject, injectable } from 'tsyringe';
import { ScraperService } from '../services/playwrightCrawlerService';

@injectable()
export class ScraperController {
    constructor(
        @inject(ScraperService) private scraperService: ScraperService
    ) {}

    // Start a new scraping task
    public async startScraping(req: Request, res: Response): Promise<void> {
        try {
            const { url } = req.query; // Get the URL from the request body
            this.scraperService.scrape(url as string); // Call the scrape method from ScraperService
            res.status(200).json({ success: true }); // Respond with success and scraped data
        } catch (error: unknown) {
            const err = error as Error; // Cast error to Error type
            res.status(500).json({ success: false, message: err.message }); // Handle errors and respond
        }
    }

    // Get the status of a scraping task
    public async getScrapingStatus(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params; // Get the task ID from the request parameters
            const status = await this.scraperService.getTaskStatus(taskId); // Call the getStatus method from ScraperService
            res.status(200).json({ success: true, status }); // Respond with the status of the task
        } catch (error: unknown) {
            const err = error as Error; // Cast error to Error type
            res.status(500).json({ success: false, message: err.message }); // Handle errors and respond
        }
    }

    // Stop a running scraping task
    public async stopScraping(req: Request, res: Response): Promise<void> {
        try {
            const { taskId } = req.params; // Get the task ID from the request parameters
            await this.scraperService.stop(taskId); // Call the stop method from ScraperService
            res.status(200).json({ success: true, message: 'Scraping task stopped successfully.' }); // Respond with success
        } catch (error: unknown) {
            const err = error as Error; // Cast error to Error type
            res.status(500).json({ success: false, message: err.message }); // Handle errors and respond
        }
    }
}