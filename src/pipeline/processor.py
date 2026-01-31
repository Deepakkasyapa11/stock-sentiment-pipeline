import os
import random
from datetime import datetime, timezone
from sqlalchemy import desc
# Senior Move: Import SessionLocal for direct session management
from src.core.database import SessionLocal, NewsFeed, StockData 

# Make sure you have this model in your database.py, 
# otherwise use the one you defined (e.g., NewsFeed)
try:
    from src.core.database import SentimentData
except ImportError:
    # If you didn't define a separate SentimentData table, 
    # a senior dev would use a fallback or fix the schema.
    SentimentData = None 

def process_sentiment():
    # DIRECTLY create the session. Do not use get_db() here.
    db = SessionLocal()
    try:
        print(f"[{datetime.now(timezone.utc)}] Processor: Analyzing sentiment...")
        
        # 1. Fetch the latest news item
        latest_news = db.query(NewsFeed).order_by(desc(NewsFeed.published_at)).first()
        
        if not latest_news:
            print("  No news to analyze.")
            return

        headline = latest_news.headline
        
        # 2. Check for SentimentData table
        if SentimentData is None:
            print("  Skipping Sentiment: SentimentData model not found in database.py")
            return

        # 3. Avoid duplicate analysis
        existing = db.query(SentimentData).filter(SentimentData.headline == headline).first()
        if existing:
            print("  Sentiment already exists for this headline.")
            return

        # 4. Sentiment Logic (Simulation)
        label = "neutral"
        score = 0.5
        symbol = "MARKET"
        
        for s in ["AAPL", "TSLA", "MSFT", "NVDA"]:
            if s in headline:
                symbol = s
                break

        if any(word in headline.lower() for word in ["rally", "up", "growth", "breakthrough"]):
            label, score = "bullish", random.uniform(0.7, 0.9)
        elif any(word in headline.lower() for word in ["crash", "down", "drop", "regulations"]):
            label, score = "bearish", random.uniform(0.7, 0.9)
        
        # 5. Save to DB
        sentiment_entry = SentimentData(
            symbol=symbol, 
            score=score, 
            label=label, 
            headline=headline, 
            timestamp=datetime.now(timezone.utc)
        )
        db.add(sentiment_entry)
        db.commit()
        print(f"  -> Analyzed: {label} ({score:.2f}) for {headline}")
        
    except Exception as e:
        db.rollback()
        print(f"  CRITICAL ERROR in Processor: {e}")
        raise e
    finally:
        # ALWAYS close the connection in a script to prevent 'Leaking Connections'
        db.close()

if __name__ == "__main__":
    process_sentiment()