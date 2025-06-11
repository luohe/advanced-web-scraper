import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // 调试时开启
});

// 热重载时避免重复初始化
if (process.env.NODE_ENV !== 'production') {
  (global as any).prisma = prisma;
}

export default prisma;