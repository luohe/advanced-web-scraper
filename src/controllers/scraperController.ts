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
}