import time
import random
import yfinance as yf
from database import get_db, StockData, NewsFeed
from datetime import datetime

SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"]

def fetch_stock_data():
    db = get_db()
    try:
        print(f"[{datetime.now()}] Ingestion: Fetching stock data...")
        for symbol in SYMBOLS:
            try:
                base_price = {"AAPL": 150, "TSLA": 200, "MSFT": 300, "NVDA": 400}[symbol]
                price = base_price + random.uniform(-2, 2)
                stock_entry = StockData(symbol=symbol, price=price, timestamp=datetime.utcnow())
                db.add(stock_entry)
                print(f"  -> Ingested {symbol}: ${price:.2f}")
            except Exception as e:
                print(f"  Error fetching {symbol}: {e}")
        db.commit()
    finally:
        db.close()

def fetch_news():
    db = get_db()
    try:
        print(f"[{datetime.now()}] Ingestion: Fetching news...")
        mock_headlines = [
            ("Tech stocks rally as inflation cools", "Bloomberg"),
            ("New AI regulations proposed in EU", "Reuters"),
            (f"{random.choice(SYMBOLS)} breakthrough in AI", "TechCrunch")
        ]
        headline, source = random.choice(mock_headlines)
        news_entry = NewsFeed(headline=headline, url="https://example.com", source=source, published_at=datetime.utcnow())
        db.add(news_entry)
        db.commit()
        print(f"  -> Ingested News: {headline}")
    finally:
        db.close()

if __name__ == "__main__":
    fetch_stock_data()
    fetch_news()
