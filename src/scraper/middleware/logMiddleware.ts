import type { ExtractMiddleware } from './compose'; // 引入中间件类型
import logger from '../../utils/logger';

// 示例中间件
export const logMiddleware: ExtractMiddleware = async (ctx, next) => {
    logger.info(`[extract-mw-log] extract start: ${ctx.url}`);
    const result = await next();
    logger.info(`[extract-mw-log] extract end: ${ctx.url}`);
    return result;
};