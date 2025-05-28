import type { Page } from 'playwright';

export default async (page: Page) => {
  return await page.evaluate(() => {
      return {
          title: document.title,
          description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
      };
  });
}