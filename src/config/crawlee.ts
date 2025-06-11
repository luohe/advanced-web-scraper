import { PlaywrightHook } from "crawlee";

// 爬虫实例的上限
export const CRAWLEE_MAX_INSTANCES = 5;

export const PLAYWRIGHT_CRAWLER_CONFIG = {
    minConcurrency: 1, // 最小并发页面数
    maxConcurrency: 10,  // 最大并发页面数
    maxRequestsPerMinute: 60,  // 限速

    // 请求重试配置
    maxRequestRetries: 3,  // 最大重试次数
    requestHandlerTimeoutSecs: 300,  // 超时时间
    retryOnBlocked: true,  // 被拦截时自动重试

    // 浏览器配置
    launchContext: {
        launchOptions: {
            bypassCSP: true, // 绕过内容安全策略
            // 无头模式
            headless: Boolean(process.env.PUPPETEER_HEADLESS),
            args: [
                '--no-sandbox', // 关闭沙箱（有些服务器环境需要）
                '--disable-setuid-sandbox',
                '--start-maximized', // 启动时最大化窗口
                '--lang=zh-CN', // 浏览器语言
                '--disable-blink-features=AutomationControlled', // 隐藏自动化特征
                '--disable-gpu', // 禁用 GPU（部分服务器环境需要）
                '--disable-dev-shm-usage', // 解决 /dev/shm 空间不足问题
                 '--disable-web-security', // 关闭同源策略（仅调试用）
                // '--user-agent=自定义UA', // 自定义 User-Agent
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--ignore-certificate-errors', // 忽略证书错误
                '--disable-notifications', // 禁用通知
            ],
            // defaultViewport: {
            //     width: 1512,
            //     height: 823,
            // },
            slowMo: 100, // 慢动作，调试用
            devtools: true, // 启动时自动打开开发者工具
            timeout: 30000, // 启动超时时间
            // proxy: {
            //     server: 'http://host:port',
            //     username: 'user', // 可选
            //     password: 'pass', // 可选
            // },
            // executablePath: '/path/to/chrome', // 指定浏览器可执行文件路径
            ignoreHTTPSErrors: true, // 忽略 HTTPS 证书错误
            // downloadsPath: '/tmp', // 指定下载目录
        },
    },

    preNavigationHooks: [
        // 禁止图片、音频、视频等媒体文件加载
        async ({ page }) => {
            await page.route(
                '**/*.{png,jpg,jpeg,gif,svg,webp,mp4,mp3,avi,wmv,flv,mov,ogg,webm}',
                route => route.abort()
            );
        },

        // 禁止 广告资源 相关资源加载
        async ({ page }) => {
            // 拦截并禁止 google 广告相关 js 资源加载
            await page.route('**/*googletagservices.com/**', route => route.abort());
            await page.route('**/*googlesyndication.com/**', route => route.abort());
            await page.route('**/*doubleclick.net/**', route => route.abort());
        },
       
        // 设置请求头
        async ({ page }) => {
            await page.setExtraHTTPHeaders({
                'accept-language': 'zh-CN,zh;q=0.9',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'cache-control': 'no-cache',
                'pragma': 'no-cache',
                'upgrade-insecure-requests': '1',
                'sec-ch-ua': '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
            });
        }
    ] as PlaywrightHook[],
}
