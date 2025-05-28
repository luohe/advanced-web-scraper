import { PlaywrightCrawler } from 'crawlee';

async function runCrawler() {
    // 初始化爬虫
    const crawler = new PlaywrightCrawler({
        // 请求处理函数 - 这是你的主要逻辑
        async requestHandler({ request, page, enqueueLinks }) {
            console.log(`正在处理: ${request.url}`);
            
            // 等待页面加载完成
            await page.waitForLoadState('networkidle');
            
            // 获取页面标题
            const title = await page.title();
            console.log(`页面标题: ${title}`);
            
            // 获取页面内容
            const html = await page.content();
            // 或者获取特定元素
            // const content = await page.locator('body').textContent();
            
            // 在这里你可以处理数据或保存结果
            // 例如保存到数据集
            // await Dataset.pushData({ url: request.url, title, html });
            
            // 如果你想爬取页面上的链接并继续爬取
            // await enqueueLinks({
            //     selector: 'a',
            //     globs: ['https://example.com/**'],
            // });
        },
        
        // 可选的错误处理
        failedRequestHandler({ request }) {
            console.error(`请求失败: ${request.url}`);
        },
        
        // 其他配置选项
        headless: false, // 设置为 false 可以看到浏览器窗口
        maxRequestsPerCrawl: 1, // 限制只爬取一个页面
    });

    // 启动爬虫，传入起始URL
    await crawler.run(['https://dict.cn/search?q=test']);
}

// 运行爬虫
runCrawler().catch(console.error);