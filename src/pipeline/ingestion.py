import random
from datetime import datetime, timezone
# Senior Note: We use absolute imports from the 'src' package
from src.core.database import SessionLocal, StockData, NewsFeed

SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"]

def fetch_stock_data():
    # Senior Note: Use SessionLocal directly for standalone scripts
    db = SessionLocal()
    try:
        for symbol in SYMBOLS:
            base_price = {"AAPL": 150, "TSLA": 200, "MSFT": 300, "NVDA": 400}[symbol]
            price = base_price + random.uniform(-2, 2)
            # Senior Note: Avoid utcnow() - it's deprecated. Use timezone-aware objects.
            db.add(StockData(
                symbol=symbol, 
                price=price, 
                timestamp=datetime.now(timezone.utc)
            ))
        db.commit()
        print("Stock data ingested.")
    except Exception as e:
        db.rollback()
        print(f"Error ingesting stock data: {e}")
    finally:
        db.close()

def fetch_news():
    db = SessionLocal()
    try:
        headlines = [
            ("Fed suggests interest rate pause", "Wall Street Journal"),
            ("Tech giants face new antitrust probe", "CNBC"),
            ("AI chips demand hitting record highs", "Reuters"),
            ("Consumer spending shows unexpected resilience", "Bloomberg"),
            ("Global supply chain disruptions easing", "Financial Times")
        ]
        h, s = random.choice(headlines)
        news_entry = NewsFeed(
            headline=h, 
            url="https://finance.yahoo.com", 
            source=s, 
            published_at=datetime.now(timezone.utc)
        )
        db.add(news_entry)
        db.commit()
        print(f"News ingested: {h}")
    except Exception as e:
        db.rollback()
        print(f"Error ingesting news: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    fetch_stock_data()
    fetch_news()