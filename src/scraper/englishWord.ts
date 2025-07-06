import { ScraperNames } from '../config/scraper';
import type { Page } from 'playwright';
import { Prisma } from '@prisma/client'

const extractor = async (page: Page) => {
   // 等待没有数据加载了
   await page.waitForLoadState('networkidle')

    return await page.evaluate(() => {
      const englishWordList: Prisma.TagCreateInput[] = [];

      
      return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      };
  });
};
extractor.scraperName = ScraperNames.ENGLISH_WORD;

export default extractor;