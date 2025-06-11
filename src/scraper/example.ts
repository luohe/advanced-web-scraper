import type { Page } from 'playwright';
import { ScraperNames } from '../config/scraper';
import { ExtractFn } from './middleware/compose';

const extractor: ExtractFn = async (page: Page) => {
  return await page.evaluate((): object => {
      return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      };
  });
};
extractor.scraperName = ScraperNames.EXAMPLE;

export default extractor;