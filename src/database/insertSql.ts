import crawlEnglishWordTable from './englishWord'
import Tag from './tag'

// ---------------- 新增爬虫第二步：定义爬虫数据存储 ---------------- //
const insertSqlList = [
  crawlEnglishWordTable,
  Tag,
]

export const insertScraperDataSql = async (extractorName: string, data: any) => {
  return await insertSqlList.find((item) => item.scraperName === extractorName)?.insert(data);
}