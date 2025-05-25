// @ts-ignore optional peer dependency or compatibility with es2022
import type { Page } from 'playwright';

// 定义提取规则的接口
interface ExtractRule {
    pattern: RegExp; // 用于匹配 URL 的正则表达式
    extract: (page: Page) => Promise<any>; // 提取逻辑
}

// 定义提取规则列表
const extractRules: ExtractRule[] = [
    {
        pattern: /example\.com/, // 匹配 example.com 的 URL
        extract: async (page: Page) => {
            return await page.evaluate(() => {
                return {
                    title: document.title,
                    description: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
                };
            });
        },
    },
    {
        pattern: /another-example\.com/, // 匹配 another-example.com 的 URL
        extract: async (page: Page) => {
            return await page.evaluate(() => {
                return {
                    heading: document.querySelector('h1')?.textContent || '',
                    links: Array.from(document.querySelectorAll('a')).map((a) => a.href),
                };
            });
        },
    },
    // 可以添加更多规则
];

// 根据 URL 匹配提取规则并提取数据
export async function extractDataByUrl( page: Page): Promise<any> {
    for (const rule of extractRules) {
        if (rule.pattern.test(page.url())) { // 使用正则表达式匹配 URL
            return await rule.extract(page); // 匹配到规则后执行提取逻辑
        }
    }
    throw new Error(`No matching extract rule found for URL: ${page.url()}`); // 如果没有匹配到规则，抛出错误
}