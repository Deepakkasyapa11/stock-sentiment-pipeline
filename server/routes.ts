import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { spawn } from "child_process";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Stock Endpoints
  app.get(api.stocks.latest.path, async (req, res) => {
    const stocks = await storage.getLatestStocks();
    res.json(stocks);
  });

  app.get(api.stocks.history.path, async (req, res) => {
    const symbol = req.params.symbol;
    const history = await storage.getStockHistory(symbol);
    res.json(history);
  });

  // Sentiment Endpoints
  app.get(api.sentiment.latest.path, async (req, res) => {
    const sentiment = await storage.getLatestSentiment();
    res.json(sentiment);
  });

  app.get(api.sentiment.feed.path, async (req, res) => {
    const feed = await storage.getSentimentFeed();
    res.json(feed);
  });

  // News Endpoints
  app.get(api.news.list.path, async (req, res) => {
    const news = await storage.getNewsFeed();
    res.json(news);
  });

  // Pipeline Push Endpoints (used by Python scripts)
  app.post(api.pipeline.pushStock.path, async (req, res) => {
    try {
      const input = api.pipeline.pushStock.input.parse(req.body);
      const result = await storage.addStockData(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.pipeline.pushSentiment.path, async (req, res) => {
    try {
      const input = api.pipeline.pushSentiment.input.parse(req.body);
      const result = await storage.addSentimentData(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post(api.pipeline.pushNews.path, async (req, res) => {
    try {
      const input = api.pipeline.pushNews.input.parse(req.body);
      const result = await storage.addNewsFeed(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Simulation Trigger: Spawn Python Pipeline
  console.log("Starting Python Pipeline...");
  
  const ingestion = spawn("python3", ["pipeline/ingestion.py"], { 
    stdio: 'inherit',
    detached: false 
  });
  const processor = spawn("python3", ["pipeline/processor.py"], { 
    stdio: 'inherit',
    detached: false
  });

  ingestion.on('error', (err) => console.error('Failed to start ingestion pipeline:', err));
  processor.on('error', (err) => console.error('Failed to start processor pipeline:', err));

  // Ensure children are killed when parent exits
  process.on('exit', () => {
    ingestion.kill();
    processor.kill();
  });

  // Seed initial data
  await seedDatabase();

  return httpServer;
}

// Helper to seed initial data if empty
async function seedDatabase() {
  const existingStocks = await storage.getLatestStocks();
  if (existingStocks.length === 0) {
    console.log("Seeding database...");
    await storage.addStockData({ symbol: "AAPL", price: 150.00 });
    await storage.addStockData({ symbol: "TSLA", price: 200.00 });
    await storage.addStockData({ symbol: "MSFT", price: 300.00 });
    await storage.addStockData({ symbol: "NVDA", price: 400.00 });
    
    await storage.addSentimentData({ symbol: "AAPL", score: 0.8, label: "bullish", headline: "Apple releases new iPhone" });
    await storage.addNewsFeed({ headline: "Market Rally Continues", url: "http://example.com", source: "Bloomberg" });
  }
}
