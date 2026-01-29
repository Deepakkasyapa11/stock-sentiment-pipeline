import os
import random
from database import get_db, SentimentData, NewsFeed
from datetime import datetime
from sqlalchemy import desc

def process_sentiment():
    db = get_db()
    try:
        print(f"[{datetime.now()}] Processor: Analyzing sentiment...")
        latest_news = db.query(NewsFeed).order_by(desc(NewsFeed.published_at)).first()
        
        if not latest_news:
            print("  No news to analyze.")
            return

        headline = latest_news.headline
        existing = db.query(SentimentData).filter(SentimentData.headline == headline).first()
        if existing:
            print("  Sentiment already exists for this headline.")
            return

        # Simple Logic for MVP
        label = "neutral"
        score = 0.5
        symbol = "MARKET"
        
        for s in ["AAPL", "TSLA", "MSFT", "NVDA"]:
            if s in headline:
                symbol = s
                break

        # Simulated Sentiment Logic (Safe for Free Tier)
        if any(word in headline.lower() for word in ["rally", "up", "growth", "breakthrough"]):
            label, score = "bullish", random.uniform(0.7, 0.9)
        elif any(word in headline.lower() for word in ["crash", "down", "drop", "regulations"]):
            label, score = "bearish", random.uniform(0.7, 0.9)
        
        sentiment_entry = SentimentData(
            symbol=symbol, score=score, label=label, 
            headline=headline, timestamp=datetime.utcnow()
        )
        db.add(sentiment_entry)
        db.commit()
        print(f"  -> Analyzed: {label} ({score:.2f}) for {headline}")
    finally:
        db.close()

if __name__ == "__main__":
    process_sentiment()
