import { stockData, sentimentData, newsFeed, type StockData, type SentimentData, type NewsFeed, type InsertStockData, type InsertSentimentData, type InsertNewsFeed } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  // Stock Data
  getLatestStocks(): Promise<StockData[]>;
  getStockHistory(symbol: string): Promise<StockData[]>;
  addStockData(data: InsertStockData): Promise<StockData>;

  // Sentiment Data
  getLatestSentiment(): Promise<SentimentData[]>;
  getSentimentFeed(): Promise<SentimentData[]>;
  addSentimentData(data: InsertSentimentData): Promise<SentimentData>;

  // News Feed
  getNewsFeed(): Promise<NewsFeed[]>;
  addNewsFeed(data: InsertNewsFeed): Promise<NewsFeed>;
}

export class DatabaseStorage implements IStorage {
  async getLatestStocks(): Promise<StockData[]> {
    // In a real app, this would be a more complex query to get the latest per symbol
    // For MVP simulation, we'll just get the last 50 records
    return await db.select().from(stockData).orderBy(desc(stockData.timestamp)).limit(50);
  }

  async getStockHistory(symbol: string): Promise<StockData[]> {
    return await db.select()
      .from(stockData)
      .where(eq(stockData.symbol, symbol))
      .orderBy(desc(stockData.timestamp))
      .limit(100);
  }

  async addStockData(data: InsertStockData): Promise<StockData> {
    const [result] = await db.insert(stockData).values(data).returning();
    return result;
  }

  async getLatestSentiment(): Promise<SentimentData[]> {
    return await db.select().from(sentimentData).orderBy(desc(sentimentData.timestamp)).limit(20);
  }

  async getSentimentFeed(): Promise<SentimentData[]> {
    return await db.select().from(sentimentData).orderBy(desc(sentimentData.timestamp)).limit(50);
  }

  async addSentimentData(data: InsertSentimentData): Promise<SentimentData> {
    const [result] = await db.insert(sentimentData).values(data).returning();
    return result;
  }

  async getNewsFeed(): Promise<NewsFeed[]> {
    return await db.select().from(newsFeed).orderBy(desc(newsFeed.publishedAt)).limit(50);
  }

  async addNewsFeed(data: InsertNewsFeed): Promise<NewsFeed> {
    const [result] = await db.insert(newsFeed).values(data).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
