import os
from ingestion import fetch_stock_data, fetch_news
from processor import process_sentiment

def run_pipeline():
    print("--- Starting MarketPulse Pipeline Execution ---")
    try:
        fetch_stock_data()
        fetch_news()
        process_sentiment()
        print("--- Pipeline Execution Successful ---")
    except Exception as e:
        print(f"--- Pipeline Failed: {e} ---")

if __name__ == "__main__":
    run_pipeline()
