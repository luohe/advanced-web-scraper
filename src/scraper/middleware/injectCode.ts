import type { ExtractMiddleware } from './compose'; // 引入中间件类型
import logger from '../../utils/logger';

 // jQuery 源码（示例为压缩版，也可使用未压缩版调试）
  const jqueryCode = `
  (function(){
    var script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.7.0.min.js'; // 也可直接写入源码
    script.onload = function() {
      window.jQuery = window.$ = jQuery; // 暴露 $ 和 jQuery 全局变量
    };
    document.head.appendChild(script);
  })();
`;


export const codeInjectMiddleware: ExtractMiddleware = async (ctx, next) => {
  const { page } = ctx;
  try {
    // 在页面初始化时注入 jQuery（确保在页面其他 JS 执行前加载）
    await page.addInitScript(jqueryCode);
    // @ts-ignore
    await page.waitForFunction(() => window.jQuery !== undefined);
    return await next();
  } catch (err) {
      logger.error(`[extract-mw-codeInject] Error on ${ctx.url}: ${err}`);
      throw err;
  }
};

declare global {
  interface Window {
    $: any; // 使用 any 类型，或者替换为更具体的类型
  }
}