import exampleExtract from './example';
import englishWordExtract from './englishWord';
import tagExtract from './tag';

// ---------------- 新增爬虫第三步：自定义提取器 ---------------- //
/**
 * 提取器列表
 */
export const extractors = [
    exampleExtract,
    englishWordExtract,
    tagExtract,
];
