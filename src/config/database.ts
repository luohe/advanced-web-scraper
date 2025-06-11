import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// 数据库配置类型
interface DbConfig {
  filename: string;
  driver: typeof sqlite3.Database;
}

// 数据库配置
const dbConfig: DbConfig = {
  filename: '/Users/xiazhiqiang14/crawler/sqlite/crawl.db',
  driver: sqlite3.Database,
};

// 打开数据库连接
export const openDatabase = async (): Promise<Database> => {
  try {
    const db = await open({
      filename: dbConfig.filename,
      driver: dbConfig.driver,
    });
    
    console.log('✅ Database connection established');
    return db;
  } catch (error) {
    console.error('❌ Error opening database:', error);
    throw new Error(`Failed to open database: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// 关闭数据库连接
export const closeDatabase = async (db: Database): Promise<void> => {
  try {
    await db.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error closing database:', error);
    throw new Error(`Failed to close database: ${error instanceof Error ? error.message : String(error)}`);
  }
};