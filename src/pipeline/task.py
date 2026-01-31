import sys
from datetime import datetime, timedelta, timezone
from src.core.database import SessionLocal, StockData, NewsFeed
from src.pipeline.ingestion import fetch_stock_data, fetch_news
from src.pipeline.processor import process_sentiment

def cleanup_old_data():
    """
    Retention Policy: Keep the DB lean (0.5GB limit).
    Deletes records older than 1 year.
    """
    db = SessionLocal()
    try:
        print("--- Maintenance: Starting 1-Year Data Cleanup ---")
        # Use timezone-aware UTC to prevent region-mismatch bugs
        threshold = datetime.now(timezone.utc) - timedelta(days=365)
        
        # Performance tip: Filter by timestamp and delete in bulk
        deleted_stocks = db.query(StockData).filter(StockData.timestamp < threshold).delete()
        deleted_news = db.query(NewsFeed).filter(NewsFeed.published_at < threshold).delete()
        
        db.commit()
        print(f"--- Cleanup Done: Removed {deleted_stocks} stocks and {deleted_news} news rows ---")
    except Exception as e:
        db.rollback()
        print(f"--- Cleanup Error: {e} ---")
    finally:
        db.close()

def run_pipeline():
    print(f"--- Pipeline Start: {datetime.now(timezone.utc)} ---")
    try:
        # 1. Collect Data
        fetch_stock_data()
        fetch_news()
        
        # 2. Analyze Sentiment
        process_sentiment()
        
        # 3. Perform Housekeeping
        cleanup_old_data()
        
        print("--- Pipeline Finished Successfully ---")
    except Exception as e:
        print(f"--- Pipeline CRITICAL FAILURE: {e} ---")
        sys.exit(1) # Signal failure to GitHub Actions/Render

if __name__ == "__main__":
    run_pipeline()