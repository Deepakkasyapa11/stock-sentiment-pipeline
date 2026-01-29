import os
from pipeline.ingestion import run_pipeline # Assuming this function exists

def main():
    print("--- MarketPulse: Real-Time Sentiment Pipeline ---")

    # Check for Environment Variables
    if not os.getenv("DATABASE_URL"):
        print("WARNING: DATABASE_URL not found. Running in simulation mode.")

    # Trigger the ingestion and analysis logic
    try:
        run_pipeline()
        print("System Check: Pipeline executed successfully.")
    except Exception as e:
        print(f"System Error: {e}")

if __name__ == "__main__":
    main()