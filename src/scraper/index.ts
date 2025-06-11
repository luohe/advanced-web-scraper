// @ts-ignore optional peer dependency or compatibility with es2022
import type { Page } from 'playwright';
import type { ExtractMiddleware } from './middleware/compose'; // 引入中间件类型
import logger from '../utils/logger';
import { extractors } from './extractors'; // 引入提取器
import compose from './middleware/compose'; // 引入 compose 函数
import { logMiddleware } from './middleware/logMiddleware'; // 引入日志中间件
import { errorMiddleware } from './middleware/errorMiddleware'; // 引入错误处理中间件
import { storeMiddleware } from './middleware/storeMiddleware'; // 引入错误处理中间件

// 包装所有 extract
const middlewares: ExtractMiddleware[] = [logMiddleware, errorMiddleware, storeMiddleware];

const extractList = extractors.map((extractor) => compose(middlewares, extractor))

// 根据 URL 匹配提取规则并提取数据
export async function extractDataByUrl(taskId: string, page: Page): Promise<any> {
    const url = page.url(); // 获取当前页面的 URL
    for (const extractor of extractList) {
        if (taskId.includes(extractor.scraperName)) { // 使用正则表达式匹配 URL
            logger.info(`Matched rule: ${extractor.scraperName} for URL: ${url}`);
            try {
                return await extractor(page);
            } catch (err) {
                logger.error(`Extract error for rule: ${extractor.scraperName}, URL: ${url}, err: ${err}`);
                throw err;
            }
        }
    }
    logger.error(`No matching extract rule found for URL: ${url}`);
    throw new Error(`No matching extract rule found for URL: ${url}`); // 如果没有匹配到规则，抛出错误
}