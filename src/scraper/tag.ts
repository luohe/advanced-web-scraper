// @ts-nocheck
import type { Page } from 'playwright';
import { ScraperNames } from '../config/scraper';
import { ExtractFn } from './middleware/compose';
import { Prisma } from '@prisma/client'

const extractor: ExtractFn = async (page: Page) => {
  // 等待没有数据加载了
  await page.waitForLoadState('networkidle')

  return await page.evaluate((): Prisma.TagCreateInput[] => {
    const tagList: Prisma.TagCreateInput[] = [];
    $('.baTaJaEaZ>div>div').map((key, value) => value.innerText).each((key, value) => {
      tagList.push({
        name: value,
        group: 'CEFR',
        desc: '通用英语等级标准',
      });
    });
    $('.baTaJaFc select>option:not(.dropdown-placeholder)').map((key, value) => value.innerText).each((key, value) => {
      if (!value) return;
      tagList.push({
        name: value,
        group: 'topic',
        desc: '主题',
      });
    });

    $('.baTaJaFaW select>option:not(.dropdown-placeholder)').map((key, value) => value.innerText).each((key, value) => {
      if (!value) return;
      tagList.push({
        name: value,
        group: 'partOfSpeech',
        desc: '词性',
      });
    });
    return tagList
  });
};
extractor.scraperName = ScraperNames.TAG;

export default extractor;