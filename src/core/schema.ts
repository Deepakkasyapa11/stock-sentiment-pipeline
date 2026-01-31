import { pgTable, text, serial, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const stockData = pgTable("stock_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: doublePrecision("price").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const sentimentData = pgTable("sentiment_data", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  score: doublePrecision("score").notNull(),
  label: text("label").notNull(),
  headline: text("headline").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const newsFeed = pgTable("news_feed", {
  id: serial("id").primaryKey(),
  headline: text("headline").notNull(),
  url: text("url"),
  source: text("source"),
  published_at: timestamp("published_at").defaultNow(),
});

export type StockData = typeof stockData.$inferSelect;
export type SentimentData = typeof sentimentData.$inferSelect;
export type NewsFeed = typeof newsFeed.$inferSelect;
export type InsertStockData = typeof stockData.$inferInsert;
export type InsertSentimentData = typeof sentimentData.$inferInsert;
export type InsertNewsFeed = typeof newsFeed.$inferInsert;