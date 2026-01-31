export const api = {
  stocks: {
    latest: { path: "/api/stocks" },
    history: { path: "/api/stocks/:symbol" }
  },
  sentiment: {
    latest: { path: "/api/sentiment/latest" },
    feed: { path: "/api/sentiment/feed" }
  },
  news: {
    list: { path: "/api/news" }
  }
};

export const buildUrl = (path: string, params: Record<string, string>) => {
  let url = path;
  for (const key in params) {
    url = url.replace(`:${key}`, params[key]);
  }
  return url;
};