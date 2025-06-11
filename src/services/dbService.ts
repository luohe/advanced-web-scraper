import { injectable } from 'tsyringe';
import logger from '../utils/logger';
import { ExtractContext } from '../scraper/middleware/compose';
import { insertScraperDataSql } from '../database/insertSql';

@injectable()
export default class DBService {
    constructor() {}

    // 存储爬取的数据到 Dataset
    public async storeData(info: ExtractContext) {
        const { data, url, extractorName } = info;
        if (!data) {
            logger.warn(`No data to store for ${url}`);
            return;
        }

        try {
          const dataList = Array.isArray(data) ? data : [data];
          const finalData = dataList.map(item => ({ ...item, url }))
          // 将提取的数据写入到 SQLite 数据库
          await insertScraperDataSql(extractorName, finalData);
        } catch (error: any) {
            logger.error(`Error storing data for ${url} in SQLite: ${error.message}`);
            throw error;
        }
    }

    // 获取

    // 获取特定任务的状态

    // 停止特定任务的方法

    // 获取爬取的数据
}