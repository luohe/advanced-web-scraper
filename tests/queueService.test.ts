import { QueueService } from '../src/services/queueService';
import { ScraperService } from '../src/services/scraperService';

describe('QueueService', () => {
    let queueService: QueueService;
    let scraperService: ScraperService;

    beforeEach(() => {
        scraperService = new ScraperService();
        queueService = new QueueService(scraperService);
    });

    test('should add a task to the queue', () => {
        const task = { url: 'http://example.com', options: {} };
        queueService.addTask(task);
        expect(queueService.getQueueLength()).toBe(1);
    });

    test('should process tasks in the queue', async () => {
        const task = { url: 'http://example.com', options: {} };
        queueService.addTask(task);
        
        await queueService.processTasks();
        expect(queueService.getQueueLength()).toBe(0);
    });

    test('should handle errors during task processing', async () => {
        const task = { url: 'http://invalid-url', options: {} };
        queueService.addTask(task);
        
        await expect(queueService.processTasks()).rejects.toThrow('Failed to process task');
    });

    test('should retry failed tasks', async () => {
        const task = { url: 'http://invalid-url', options: {} };
        queueService.addTask(task);
        
        await queueService.processTasks();
        expect(queueService.getRetryCount(task)).toBe(1);
    });
});