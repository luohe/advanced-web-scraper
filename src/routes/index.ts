import { Router } from 'express';
import { ScraperController } from '../controllers/scraperController';
import { container } from 'tsyringe';
import { ApiController } from '../controllers/apiController';
const apiController = container.resolve(ApiController);
const scraperController = container.resolve(ScraperController);

const router = Router();
// const scraperController = new ScraperController();
// const apiController = new ApiController();

// 定义启动爬取任务的路由
router.get('/start', scraperController.startScraping.bind(scraperController));

// 定义获取爬取状态的路由
router.get('/status', apiController.getScrapingStatus.bind(apiController));

// 定义获取爬取数据的路由
router.get('/data', apiController.getScrapedData.bind(apiController));

// 导出路由以供应用使用
export default router;