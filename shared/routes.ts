import { z } from 'zod';
import { insertStockDataSchema, insertSentimentDataSchema, insertNewsFeedSchema, stockData, sentimentData, newsFeed } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  stocks: {
    latest: {
      method: 'GET' as const,
      path: '/api/stocks/latest',
      responses: {
        200: z.array(z.custom<typeof stockData.$inferSelect>()),
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/stocks/history/:symbol',
      responses: {
        200: z.array(z.custom<typeof stockData.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
  },
  sentiment: {
    latest: {
      method: 'GET' as const,
      path: '/api/sentiment/latest',
      responses: {
        200: z.array(z.custom<typeof sentimentData.$inferSelect>()),
      },
    },
    feed: {
      method: 'GET' as const,
      path: '/api/sentiment/feed',
      responses: {
        200: z.array(z.custom<typeof sentimentData.$inferSelect>()),
      },
    },
  },
  news: {
    list: {
      method: 'GET' as const,
      path: '/api/news',
      responses: {
        200: z.array(z.custom<typeof newsFeed.$inferSelect>()),
      },
    },
  },
  // Endpoints for the Python pipeline to push data
  pipeline: {
    pushStock: {
      method: 'POST' as const,
      path: '/api/pipeline/stock',
      input: insertStockDataSchema,
      responses: {
        201: z.custom<typeof stockData.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    pushSentiment: {
      method: 'POST' as const,
      path: '/api/pipeline/sentiment',
      input: insertSentimentDataSchema,
      responses: {
        201: z.custom<typeof sentimentData.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    pushNews: {
      method: 'POST' as const,
      path: '/api/pipeline/news',
      input: insertNewsFeedSchema,
      responses: {
        201: z.custom<typeof newsFeed.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
