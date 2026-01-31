import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { spawn } from "child_process";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Stock Endpoints
  app.get(api.stocks.latest.path, async (_req, res) => {
    const stocks = await storage.getLatestStocks();
    res.json(stocks);
  });

  app.get(api.stocks.history.path, async (req, res) => {
    const symbol = req.params.symbol as string;
    const history = await storage.getStockHistory(symbol);
    res.json(history);
  });

  // 2. Sentiment Endpoints
  app.get(api.sentiment.latest.path, async (_req, res) => {
    const sentiment = await storage.getLatestSentiment();
    res.json(sentiment);
  });

  app.get(api.sentiment.feed.path, async (_req, res) => {
    const feed = await storage.getSentimentFeed();
    res.json(feed);
  });

  // 3. News Endpoints
  app.get(api.news.list.path, async (_req, res) => {
    const news = await storage.getNewsFeed();
    res.json(news);
  });

  // 4. Seeding check (Optional but good for stability)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingStocks = await storage.getLatestStocks();
  if (existingStocks.length === 0) {
    console.log("Seeding initial database records...");
    await storage.addStockData({ symbol: "AAPL", price: 150.00 });
    await storage.addStockData({ symbol: "TSLA", price: 200.00 });
  }
}