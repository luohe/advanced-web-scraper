import Bull, { Queue, Job } from 'bull';
import { injectable } from 'tsyringe';
import { ScraperService } from './scraperService';

@injectable()
export class QueueService {
    private queue: Queue;

    constructor(private scraperService: ScraperService) {
        this.queue = new Bull('scrapingQueue');
        this.initializeQueue();
    }

    // Initialize the queue to process scraping tasks
    private initializeQueue() {
        this.queue.process(async (job: Job) => {
            try {
                const result = await this.scraperService.scrape(job.data.url);
                console.log(`Scraped data from ${job.data.url}:`, result);
            } catch (error) {
                console.error(`Error scraping ${job.data.url}:`, error);
                throw error; // This will trigger the retry mechanism
            }
        });

        // Handle completed jobs
        this.queue.on('completed', (job: Job) => {
            console.log(`Job ${job.id} completed successfully.`);
        });

        // Handle failed jobs
        this.queue.on('failed', (job: Job, err: Error) => {
            console.error(`Job ${job.id} failed with error: ${err.message}`);
        });
    }

    // Add a new scraping task to the queue
    public addTask(url: string) {
        this.queue.add({ url });
    }

    // Get the current queue length
    public async getQueueLength(): Promise<number> {
        return await this.queue.count();
    }

    // Clear the queue
    public async clearQueue() {
        await this.queue.empty();
    }
}