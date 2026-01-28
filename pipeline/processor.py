import time
import random
from database import get_db, SentimentData, NewsFeed
from datetime import datetime
from sqlalchemy import desc

# Try importing transformers, fallback to simulation if missing
try:
    from transformers import pipeline
    print("Loading FinBERT model...")
    # Use a smaller/faster model for the MVP if FinBERT is too heavy, 
    # but user asked for ProsusAI/finbert. We'll try to load it.
    # Note: On Replit free tier, this might OOM. 
    # Fallback to a simpler model or simulation logic if it fails.
    sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")
    HAS_TRANSFORMERS = True
except Exception as e:
    print(f"Warning: Could not load FinBERT ({e}). Using simulation mode.")
    HAS_TRANSFORMERS = False

def process_sentiment():
    db = get_db()
    try:
        print(f"[{datetime.now()}] Processor: Analyzing sentiment...")
        
        # Get latest news that hasn't been analyzed (simplified: just get latest 5)
        # In a real app, we'd have a 'processed' flag.
        latest_news = db.query(NewsFeed).order_by(desc(NewsFeed.published_at)).limit(1).first()
        
        if not latest_news:
            print("  No news to analyze.")
            return

        headline = latest_news.headline
        
        # Check if we already have sentiment for this headline (simple dedup)
        existing = db.query(SentimentData).filter(SentimentData.headline == headline).first()
        if existing:
            return

        label = "neutral"
        score = 0.5
        symbol = "MARKET" # Default
        
        # Basic symbol extraction
        for s in ["AAPL", "TSLA", "MSFT", "NVDA"]:
            if s in headline:
                symbol = s
                break

        if HAS_TRANSFORMERS:
            try:
                result = sentiment_pipeline(headline)[0]
                label = result['label'] # positive, negative, neutral
                score = result['score']
                
                # Map FinBERT labels to our schema
                if label == 'positive': label = 'bullish'
                elif label == 'negative': label = 'bearish'
                else: label = 'neutral'
                
            except Exception as e:
                print(f"  Inference error: {e}")
        else:
            # Simulation Logic
            if "rally" in headline.lower() or "upgrade" in headline.lower() or "breakthrough" in headline.lower():
                label = "bullish"
                score = random.uniform(0.7, 0.99)
            elif "crash" in headline.lower() or "regulations" in headline.lower():
                label = "bearish"
                score = random.uniform(0.7, 0.99)
            else:
                label = "neutral"
                score = random.uniform(0.4, 0.6)

        # Normalize score to 0-1 for the Gauge if needed, but FinBERT gives probability.
        # We'll store raw score and label.
        
        sentiment_entry = SentimentData(
            symbol=symbol,
            score=score,
            label=label,
            headline=headline,
            timestamp=datetime.utcnow()
        )
        db.add(sentiment_entry)
        db.commit()
        print(f"  -> Analyzed: {label} ({score:.2f}) for {headline}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting Sentiment Processor Pipeline...")
    while True:
        process_sentiment()
        time.sleep(5)
