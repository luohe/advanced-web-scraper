import { ScraperNames } from '../config/scraper';
import type { Page } from 'playwright';

const extractor = async (page: Page) => {
    return await page.evaluate(() => {
      return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      };
  });
};
extractor.scraperName = ScraperNames.ENGLISH_WORD;

export default extractor;