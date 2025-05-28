import express from 'express';
import "reflect-metadata";
import setRoutes from './routes/index';
import errorHandler from './middlewares/errorHandler';
import { initializeDatabase } from './database/db';
import { dbMiddleware } from './middlewares/dbMiddleware';

// Initialize the Express application
const app = express();


async function startServer() {
    try {
        // 初始化数据库
        await initializeDatabase();
        debugger
        // 中间件
        app.use(express.json());
        app.use(dbMiddleware); // 注入数据库实例
        
        // 错误处理中间件
        app.use(errorHandler);

        // 注入路由
        app.use('/scraper', setRoutes);
        
        // 启动服务器
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();