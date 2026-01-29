# 📈 MarketPulse: Real-Time Stock Sentiment Pipeline

A high-performance data engineering pipeline that correlates real-time financial news sentiment with stock price movements. 
Built to demonstrate streaming architecture, NLP integration, and full-stack deployment.
---

#  Live Demo

---

#System Architecture<img width="1327" height="521" alt="Screenshot (116)" src="https://github.com/user-attachments/assets/9a7a3921-537a-4bb2-a94e-e6d04e63643a" />

The system follows a modular "Producer-Consumer" pattern, designed for high throughput and horizontal scalability.

1. **Data Ingestion:** Asynchronous fetchers for Market Data (yfinance/Alpha Vantage) and Financial News (NewsAPI).
2. **Processing Engine:** A lightweight simulation of a Spark Streaming pipeline that cleans, normalizes, and tokenizes incoming text.
3. **Sentiment Analysis:** Utilizes the **FinBERT** (Financial Bidirectional Encoder Representations from Transformers) model via HuggingFace to categorize headlines into Bullish, Bearish, or Neutral.
4. **Storage:** Relational persistence using **PostgreSQL** (Neon.tech) with SQLAlchemy ORM.
5. **Visualization:** Interactive dashboard built with **Streamlit** and Plotly for real-time trend analysis.

---

#Tech Stack
- **Backend:** Python (FastAPI), Pytest
- **AI/ML:** HuggingFace Transformers, FinBERT
- **Database:** PostgreSQL (Neon.tech)
- **Frontend:** Streamlit, Plotly
- **CI/CD:** GitHub Actions (for automated data ingestion)

#Testing Suite
This project implements a tightly coupled test suite using `pytest` to ensure data integrity at every stage:
- `test_ingestion`: Validates API schema and connectivity.
- `test_sentiment`: Mocks financial headlines to verify NLP classification accuracy.
- `test_database`: Confirms ACID compliance for live data writes.

---

#Local Setup
1. Clone the repo: `git clone https://github.com/Deepakkasyapa11/repo-name.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Set up environment variables in a `.env` file:
   ```env
   DATABASE_URL=your_neon_db_url
   NEWS_API_KEY=your_key
Run the app: streamlit run app.py

Developed by **Deepak kasyapa** - Designed for high-frequency sentiment tracking and market intelligence.
