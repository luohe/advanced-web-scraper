// src/database/db.ts
import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { openDatabase } from '../config/database';

// 声明全局的 db 变量
let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function initializeDatabase() {
  try {
    db = await openDatabase();

    // 创建必要的表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      );
    `);

    console.log('✅ Database initialized and connected');
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

// 获取数据库实例
export function getDb() {
  if (!db) {
    throw new Error('Database not initialized!');
  }
  return db;
}