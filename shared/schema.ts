import { pgTable, text, serial, integer, boolean, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Stock Data Table
export const stockData = pgTable("stock_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Sentiment Data Table
export const sentimentData = pgTable("sentiment_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  score: real("score").notNull(), // -1.0 to 1.0 or 0 to 1
  label: text("label").notNull(), // "bearish", "bullish", "neutral"
  headline: text("headline").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// News Feed Table
export const newsFeed = pgTable("news_feed", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  url: text("url").notNull(),
  source: text("source").notNull(),
  summary: text("summary"), // Optional AI summary
  publishedAt: timestamp("published_at").defaultNow().notNull(),
});

// Schemas
export const insertStockDataSchema = createInsertSchema(stockData).omit({ id: true, timestamp: true });
export const insertSentimentDataSchema = createInsertSchema(sentimentData).omit({ id: true, timestamp: true });
export const insertNewsFeedSchema = createInsertSchema(newsFeed).omit({ id: true, publishedAt: true });

// Types
export type StockData = typeof stockData.$inferSelect;
export type InsertStockData = z.infer<typeof insertStockDataSchema>;

export type SentimentData = typeof sentimentData.$inferSelect;
export type InsertSentimentData = z.infer<typeof insertSentimentDataSchema>;

export type NewsFeed = typeof newsFeed.$inferSelect;
export type InsertNewsFeed = z.infer<typeof insertNewsFeedSchema>;
