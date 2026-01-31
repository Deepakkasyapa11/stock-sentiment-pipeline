import os
import sys
from datetime import datetime, timezone
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

# 1. Environment Guard Clause
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("FATAL: DATABASE_URL is not set in the environment.")
    print("Run: $env:DATABASE_URL='your_neon_url' in PowerShell.")
    sys.exit(1)

# 2. Connection String Fix
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# 3. Engine and Session Configuration
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. Professional Models
class StockData(Base):
    __tablename__ = "stock_data"
    id = Column(Integer, primary_key=True)
    symbol = Column(String(10), nullable=False)
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class NewsFeed(Base):
    __tablename__ = "news_feed"
    id = Column(Integer, primary_key=True)
    headline = Column(String, nullable=False)
    url = Column(String)
    source = Column(String)
    summary = Column(String)
    published_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SentimentData(Base):
    __tablename__ = "sentiment_data"
    id = Column(Integer, primary_key=True)
    symbol = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    label = Column(String, nullable=False)
    headline = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()