import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import random
from database import get_db, StockData, NewsFeed
from datetime import datetime

SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"]

def fetch_stock_data():
    db = get_db()
    try:
        for symbol in SYMBOLS:
            base_price = {"AAPL": 150, "TSLA": 200, "MSFT": 300, "NVDA": 400}[symbol]
            price = base_price + random.uniform(-2, 2)
            db.add(StockData(symbol=symbol, price=price, timestamp=datetime.utcnow()))
        db.commit()
        print("Stock data ingested.")
    finally:
        db.close()

def fetch_news():
    db = get_db()
    try:
        # We use a broader pool to ensure variety
        headlines = [
            ("Fed suggests interest rate pause", "Wall Street Journal"),
            ("Tech giants face new antitrust probe", "CNBC"),
            ("AI chips demand hitting record highs", "Reuters"),
            ("Consumer spending shows unexpected resilience", "Bloomberg"),
            ("Global supply chain disruptions easing", "Financial Times")
        ]
        h, s = random.choice(headlines)
        # FORCE an entry every time this runs
        news_entry = NewsFeed(
            headline=h, 
            url="https://finance.yahoo.com", 
            source=s, 
            published_at=datetime.utcnow()
        )
        db.add(news_entry)
        db.commit()
        print(f"News ingested: {h}")
    finally:
        db.close()

if __name__ == "__main__":
    fetch_stock_data()
    fetch_news()
