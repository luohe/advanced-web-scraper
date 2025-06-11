import type { ExtractMiddleware } from './compose'; // 引入中间件类型
import logger from '../../utils/logger';

export const errorMiddleware: ExtractMiddleware = async (ctx, next) => {
    try {
        return await next();
    } catch (err) {
        logger.error(`[extract-mw-error] Error on ${ctx.url}: ${err}`);
        throw err;
    }
};