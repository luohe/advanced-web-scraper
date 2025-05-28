import { Router } from 'express';
import { ScraperController } from '../controllers/scraperController';
import { container } from 'tsyringe';
const scraperController = container.resolve(ScraperController);

const router = Router();

// 定义启动爬取任务的路由
router.get('/start', scraperController.startScraping.bind(scraperController));

// 导出路由以供应用使用
export default router;