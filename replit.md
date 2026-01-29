# Replit.md

## Overview

This is a real-time financial dashboard application that displays stock prices, market sentiment analysis, and news feeds. The system combines a React frontend with an Express backend and uses a Python data pipeline for fetching stock data, news, and running NLP sentiment analysis (using FinBERT or simulated fallback). Data flows from Python scripts through REST endpoints into a PostgreSQL database, then gets polled by the frontend for a live dashboard experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state with 3-second polling for real-time feel
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Animations**: Framer Motion for smooth transitions
- **Charts**: Recharts for stock price visualization and sentiment gauges
- **Build Tool**: Vite with path aliases (@/, @shared/, @assets/)

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints defined in shared/routes.ts with Zod validation
- **Development**: tsx for TypeScript execution, Vite dev server integration for HMR

### Data Pipeline (Python)
- **Purpose**: Fetches stock data, news, and performs sentiment analysis
- **Stock Data**: Simulated price fluctuations for demo (can integrate yfinance for real data)
- **Sentiment Analysis**: Attempts to use ProsusAI/FinBERT model, falls back to rule-based simulation
- **Database**: SQLAlchemy ORM connecting to the same PostgreSQL database

### Shared Code
- **Schema**: Drizzle schema in shared/schema.ts defines tables (stock_data, sentiment_data, news_feed)
- **Routes**: API route definitions with Zod schemas in shared/routes.ts
- **Types**: TypeScript types inferred from Drizzle schemas

### Key Design Decisions

1. **Monorepo Structure**: Client, server, and shared code in one repository with TypeScript path aliases for clean imports

2. **Polling Over WebSockets**: Uses 3-second polling interval for simplicity - appropriate for this use case where data updates aren't sub-second critical

3. **Python + Node Hybrid**: Python handles ML/data ingestion (better ML ecosystem), Node handles web serving (better frontend integration)

4. **Simulation Mode**: Built-in fallback to simulated data when external APIs or ML models aren't available, ensuring the dashboard always works

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via DATABASE_URL environment variable
- **Drizzle Kit**: Database migrations stored in /migrations folder

### AI/ML Services
- **OpenAI API**: Accessed via Replit AI Integrations (AI_INTEGRATIONS_OPENAI_API_KEY, AI_INTEGRATIONS_OPENAI_BASE_URL)
- **HuggingFace Transformers**: ProsusAI/FinBERT for sentiment analysis (Python)

### Frontend Libraries
- **Radix UI**: Headless component primitives (dialogs, dropdowns, etc.)
- **Recharts**: Data visualization
- **date-fns**: Date formatting

### Development Tools
- **Vite**: Frontend bundling with HMR
- **esbuild**: Production server bundling
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner

### Python Dependencies
- **SQLAlchemy**: Database ORM
- **yfinance**: Stock data fetching (optional)
- **transformers**: HuggingFace models for sentiment analysis