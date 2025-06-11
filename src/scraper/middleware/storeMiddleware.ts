import { isObject } from 'lodash'
import type { ExtractMiddleware } from './compose'; // 引入中间件类型
import logger from '../../utils/logger';
import { container } from 'tsyringe';
import DBService from '../../services/dbService';

const dbService = container.resolve(DBService);

export const storeMiddleware: ExtractMiddleware = async (ctx, next) => {
    logger.info(`[extract-mw-store] db store start: ${ctx.url}`);
    const data = await next();
    if (data) {
        try {
          logger.info(`[extract-mw-store] scraper success(${ctx.url}): ${JSON.stringify(ctx.data)}`);
          await dbService.storeData({ ...ctx, data: isObject(data) ? data : { data } });
        } catch (error: any) {
            logger.error(`[extract-mw-store] Error storing data for ${ctx.url}: ${error.message}`);
            throw error; // 重新抛出错误以便后续中间件或处理函数可以捕获
        }
    } else {
        logger.warn(`[extract-mw-store] No data to store for ${ctx.url}`);
    }
    logger.info(`[extract-mw-store] db store end: ${ctx.url}`);
    return data;
};