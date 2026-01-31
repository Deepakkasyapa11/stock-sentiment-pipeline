# 📈 MarketPulse: Real-Time Stock Sentiment Pipeline

A high-performance data engineering pipeline that correlates real-time financial news sentiment with stock price movements. An Enterprise-grade data engineering pipeline and full-stack application that correlates real-time financial news sentiment with market movements. This project demonstrates a production-ready Modular Monorepo architecture, combining Python data engineering with a TypeScript/React ecosystem.
---

#  Live Demo

---

#System Architecture
<img width="1327" height="521" alt="Screenshot (116)" src="https://github.com/user-attachments/assets/9a7a3921-537a-4bb2-a94e-e6d04e63643a" />

The system follows a modular "Producer-Consumer" pattern, designed for high throughput and horizontal scalability.
The system is split into three distinct layers, unified under a high-performance src/ directory structure:

Data Ingestion (Python): Automated hourly fetchers for Market Data (yfinance) and Financial News.

Sentiment Engine (NLP): Utilizes FinBERT (Financial Bidirectional Encoder Representations from Transformers) to classify headlines into Bullish, Bearish, or Neutral sentiments.

Unified API (Node.js): A TypeScript-based Express server serving as the bridge between the PostgreSQL database and the client.

Interactive Dashboard (React): A modern Vite-powered frontend utilizing ShadcnUI and Plotly for high-fidelity data visualization.

---

#Tech Stack
Data & AI (Python)
Engine: Python 3.10+

NLP: FinBERT (HuggingFace Transformers)

ORM: SQLAlchemy

Automation: GitHub Actions (Hourly CRON jobs)

Backend & Storage
Server: Node.js, Express, TypeScript

Database: PostgreSQL (Neon.tech - Serverless)

ORM: Drizzle ORM

Validation: Zod

Frontend
Framework: React 18 (Vite)

Styling: Tailwind CSS, ShadcnUI

Charts: Plotly.js / Recharts

#Testing Suite
This project implements a tightly coupled test suite using `pytest` to ensure data integrity at every stage:
- `test_ingestion`: Validates API schema and connectivity.
- `test_sentiment`: Mocks financial headlines to verify NLP classification accuracy.
- `test_database`: Confirms ACID compliance for live data writes.

---

#Local Setup
. Clone & Install
PowerShell
git clone https://github.com/Deepakkasyapa11/stock-sentiment-pipeline.git
cd stock-sentiment-pipeline
npm install
pip install -r requirements.txt
2. Environment Variables
Create a .env file in the root:

Code snippet
DATABASE_URL=postgresql://user:pass@your-neon-link.tech/dbname
PORT=3000
3. Run the System
Start the Web App (Frontend + API): npm run dev

Trigger Ingestion Manually: python -m src.pipeline.task

 #License
Distributed under the MIT License. See LICENSE for more information.

Developed by Deepakkasyapa11 – Designed for high-frequency sentiment tracking and market intelligence.
