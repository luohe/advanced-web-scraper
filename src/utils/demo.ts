import { PlaywrightCrawler } from 'crawlee';

const crawler = new PlaywrightCrawler({
    minConcurrency: 1,
    maxConcurrency: 10,
    maxRequestsPerMinute: 60,
    maxRequestRetries: 3,
    requestHandlerTimeoutSecs: 300,
    retryOnBlocked: true,
    launchContext: {
        launchOptions: { 
            bypassCSP: true,
            headless: false, // 设置为 true 以启用无头模式
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--lang=zh-CN',
                '--disable-blink-features=AutomationControlled',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--ignore-certificate-errors',
                '--disable-notifications',
            ],
            slowMo: 100, // 慢动作，调试用
            devtools: true, // 启动时自动打开开发者工具
         }
    },
    preNavigationHooks: [
        async ({ page }) => {
            // 拦截并禁止 google 广告相关 js 资源加载
            await page.route('**/*googletagservices.com/**', route => route.abort());
            await page.route('**/*googlesyndication.com/**', route => route.abort());
            await page.route('**/*doubleclick.net/**', route => route.abort());
            // 你也可以继续拦截其它广告域名
            await page.route('**/*.{png,jpg,jpeg,gif,svg,webp,mp4,mp3,avi,wmv,flv,mov,ogg,webm}', route => route.abort());
        }
    ],
    requestHandler: async ({ page, request, response }) => {
        const status = response?.status();
        console.info(`Request: ${request.url}   Status: ${status}`);
        if (status !== 200) {
            console.warn(`Non-200 status: ${status} for ${request.url}`);
            return;
        }
        // 你的数据提取逻辑
    },
});

(async () => {
    try {
        await crawler.addRequests([{ url: 'https://dict.cn/search?q=test' }]);
        await crawler.run();
    } catch (err) {
        console.error('Crawler error:', err);
    }
})();