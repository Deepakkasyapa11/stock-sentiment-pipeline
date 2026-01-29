import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Poll interval for real-time feel (3 seconds)
const POLL_INTERVAL = 3000;

export function useLatestStocks() {
  return useQuery({
    queryKey: [api.stocks.latest.path],
    queryFn: async () => {
      const res = await fetch(api.stocks.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest stocks");
      return api.stocks.latest.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
  });
}

export function useStockHistory(symbol: string) {
  return useQuery({
    queryKey: [api.stocks.history.path, symbol],
    queryFn: async () => {
      const url = buildUrl(api.stocks.history.path, { symbol });
      const res = await fetch(url);
      if (res.status === 404) return [];
      if (!res.ok) throw new Error("Failed to fetch stock history");
      return api.stocks.history.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
    enabled: !!symbol,
  });
}

export function useLatestSentiment() {
  return useQuery({
    queryKey: [api.sentiment.latest.path],
    queryFn: async () => {
      const res = await fetch(api.sentiment.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest sentiment");
      return api.sentiment.latest.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
  });
}

export function useSentimentFeed() {
  return useQuery({
    queryKey: [api.sentiment.feed.path],
    queryFn: async () => {
      const res = await fetch(api.sentiment.feed.path);
      if (!res.ok) throw new Error("Failed to fetch sentiment feed");
      return api.sentiment.feed.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL,
  });
}

export function useNewsList() {
  return useQuery({
    queryKey: [api.news.list.path],
    queryFn: async () => {
      const res = await fetch(api.news.list.path);
      if (!res.ok) throw new Error("Failed to fetch news");
      return api.news.list.responses[200].parse(await res.json());
    },
    refetchInterval: POLL_INTERVAL * 2, // News updates slightly slower
  });
}
