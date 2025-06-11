// src/middlewares/dbMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';

export function dbMiddleware(req: Request, res: Response, next: NextFunction) {
  req.prisma = prisma;
  next();
}

// 扩展 Express 的 Request 类型
declare global {
  namespace Express {
    interface Request {
      db: any; // 可以替换为更精确的类型
      prisma: any; // 可以替换为更精确的类型
    }
  }
}