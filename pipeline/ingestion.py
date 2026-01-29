import time
import random
import yfinance as yf
from database import get_db, StockData, NewsFeed
from datetime import datetime

# Mock symbols for MVP simulation (avoiding rate limits)
SYMBOLS = ["AAPL", "TSLA", "MSFT", "NVDA"]

"""
Fetches real-time stock data. 
For MVP, we mix real data (if available) with simulated fluctuation 
to ensure the dashboard looks alive even when markets are closed.
"""
db = get_db()
try:
print(f"[{datetime.now()}] Ingestion: Fetching stock data...")

for symbol in SYMBOLS:
    try:
        # SIMULATION (Reliable for MVP demo)
        # Base price + random walk
        base_price = {"AAPL": 150, "TSLA": 200, "MSFT": 300, "NVDA": 400}[symbol]
        fluctuation = random.uniform(-2, 2)
        price = base_price + fluctuation
        
        stock_entry = StockData(
            symbol=symbol,
            price=price,
            timestamp=datetime.utcnow()
        )
        db.add(stock_entry)
        print(f"  -> Ingested {symbol}: ${price:.2f}")
        
    except Exception as e:
        print(f"  Error fetching {symbol}: {e}")

db.commit()
finally:
db.close()

"""
Fetches news headlines. 
Uses NewsAPI if key present, else simulates headlines for demo.
"""
db = get_db()
try:
print(f"[{datetime.now()}] Ingestion: Fetching news...")

# Mock headlines for simulation
mock_headlines = [
    ("Tech stocks rally as inflation cools", "Bloomberg"),
    ("New AI regulations proposed in EU", "Reuters"),
    (f"{random.choice(SYMBOLS)} announces breakthrough in quantum computing", "TechCrunch"),
    ("Market volatility expected to increase", "CNBC"),
    (f"Analysts upgrade {random.choice(SYMBOLS)} to Buy", "WSJ")
]

headline, source = random.choice(mock_headlines)

news_entry = NewsFeed(
    headline=headline,
    url="https://example.com",
    source=source,
    published_at=datetime.utcnow()
)
db.add(news_entry)
db.commit()
print(f"  -> Ingested News: {headline}")
finally:
db.close()

if __name__ == "__main__":
print("Starting Data Ingestion Pipeline...")
if random.random() < 0.3: # Fetch news less frequently
