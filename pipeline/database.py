import os
import time
import random
import requests
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Database Setup
DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Fix for SQLAlchemy if the URL starts with 'postgres://' (deprecated) instead of 'postgresql://'
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models (Mirroring the Drizzle Schema)
class StockData(Base):
    __tablename__ = "stock_data"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SentimentData(Base):
    __tablename__ = "sentiment_data"
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    label = Column(String, nullable=False)
    headline = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class NewsFeed(Base):
    __tablename__ = "news_feed"
    id = Column(Integer, primary_key=True, index=True)
    headline = Column(String, nullable=False)
    url = Column(String, nullable=False)
    source = Column(String, nullable=False)
    summary = Column(String, nullable=True)
    published_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    return db
