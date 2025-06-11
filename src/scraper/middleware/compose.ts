import type { Page } from 'playwright';

// ctx数据类型
export interface ExtractContext {
  page: Page;                // Playwright 页面对象
  url: string;               // 当前页面 URL
  data?: object;             // 提取结果数据，可由中间件或 extractFn 赋值
  extractorName: string;     // 提取器名称
}


export interface ExtractFnStatics {
  // 示例静态属性，可根据实际需求修改
  scraperName: string;
}
export type ExtractFn = { (page: Page): Promise<any> } & ExtractFnStatics;

// ctx: 整个中间件生命周期的上下文
export type ExtractMiddleware = (
  ctx: ExtractContext,
  next: () => Promise<any>
) => Promise<any>;

/**
 * 组合中间件和提取函数
 * @param middlewares 中间件数组
 * @param extractFn 最终的提取函数
 * @returns 返回一个新的函数，接受 Page 对象作为参数
 */
export default function compose(
  middlewares: ExtractMiddleware[],
  extractFn: ExtractFn
) {
  const composed = async (page: Page) => {
    const ctx = { page, url: page.url(), extractorName: extractFn.scraperName };
    let index = -1;
    async function dispatch(i: number): Promise<any> {
      // 如果 i 小于等于 index，说明 next() 被乱序或多次调用，抛出错误
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const fn = i < middlewares.length
        ? middlewares[i]
        : async (ctx: any) => {
          ctx.data = await Promise.resolve(extractFn(ctx.page));
          return ctx.data;
        };
        
      return await fn(ctx, () => dispatch(i + 1));
    }
    return await dispatch(0);
  };

  return hoistExtractorStatics<typeof composed,ExtractFn>(composed, extractFn);
}

// 保留 extractFn 的静态属性
function hoistExtractorStatics<T, S>(target: T, source: S): T & S {
  const blacklist = ['length', 'name', 'prototype'];
  Object.getOwnPropertyNames(source).forEach((key) => {
    if (!blacklist.includes(key)) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)!);
    }
  });
  Object.getOwnPropertySymbols(source).forEach((sym) => {
    Object.defineProperty(target, sym, Object.getOwnPropertyDescriptor(source, sym)!);
  });

  return target as T & S;
}