import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

// Poll interval for real-time feel (3 seconds)
const POLL_INTERVAL = 3000;

export function useLatestStocks() {
  return useQuery({
    queryKey: ["/api/stocks"],
    queryFn: async () => {
      const res = await fetch(api.stocks.latest.path);
      if (!res.ok) throw new Error("Failed to fetch latest stocks");
      return await res.json();
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
      // FIXED: Removed the 'api.stocks.history.await' syntax error
      return await res.json();
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
      // FIXED: Removed .responses[200].parse() which was causing 'Property does not exist'
      return await res.json();
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
      return await res.json();
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
      return await res.json();
    },
    refetchInterval: POLL_INTERVAL * 2,
  });
}