
export const PLAYWRIGHT_CRAWLER_CONFIG = {
    minConcurrency: 1, // 最小并发页面数
    maxConcurrency: 10,  // 最大并发页面数
    maxRequestsPerMinute: 60,  // 限速

    // 请求重试配置
    maxRequestRetries: 3,  // 最大重试次数
    requestHandlerTimeoutSecs: 60,  // 超时时间
    retryOnBlocked: true,  // 被拦截时自动重试

    // 无头模式
    headless: true,
}
