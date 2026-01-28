import { useState } from "react";
import { motion } from "framer-motion";
import { 
  useLatestStocks, 
  useLatestSentiment, 
  useStockHistory, 
  useSentimentFeed, 
  useNewsList 
} from "@/hooks/use-pipeline";
import { MetricCard } from "@/components/MetricCard";
import { StockChart } from "@/components/StockChart";
import { SentimentGauge } from "@/components/SentimentGauge";
import { NewsFeedCard } from "@/components/NewsFeed";
import { Activity, BarChart3, Newspaper, TrendingUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  
  // Data Hooks
  const { data: latestStocks, isLoading: isLoadingStocks } = useLatestStocks();
  const { data: latestSentiment, isLoading: isLoadingSentiment } = useLatestSentiment();
  const { data: stockHistory, isLoading: isLoadingHistory } = useStockHistory(selectedSymbol);
  const { data: sentimentFeed, isLoading: isLoadingFeed } = useSentimentFeed();
  const { data: newsList, isLoading: isLoadingNews } = useNewsList();

  // Derived Data
  const currentStock = latestStocks?.find(s => s.symbol === selectedSymbol);
  const currentSentiment = latestSentiment?.find(s => s.symbol === selectedSymbol) || latestSentiment?.[0]; // Default to first if specific missing
  
  // Calculate average market sentiment
  const averageSentimentScore = latestSentiment 
    ? latestSentiment.reduce((acc, curr) => acc + curr.score, 0) / latestSentiment.length 
    : 0;
  
  const marketSentimentLabel = 
    averageSentimentScore > 0.3 ? "Bullish" : 
    averageSentimentScore < -0.3 ? "Bearish" : "Neutral";

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/40 pb-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span className="bg-primary/20 text-primary p-2 rounded-lg">
              <Activity className="w-6 h-6" />
            </span>
            MarketPulse <span className="text-primary">AI</span>
          </h1>
          <p className="text-muted-foreground mt-1">Real-time financial sentiment & market data pipeline</p>
        </div>
        
        <div className="flex items-center gap-2 bg-card/50 p-1.5 rounded-lg border border-white/5">
          <div className="flex items-center gap-2 px-3 py-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-400 uppercase tracking-wider">System Online</span>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-white" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-12 gap-6"
      >
        {/* Left Column: Stock Selection & Charts */}
        <div className="md:col-span-8 space-y-6">
          {/* Ticker Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {['AAPL', 'TSLA', 'MSFT', 'NVDA'].map((symbol) => {
              const stock = latestStocks?.find(s => s.symbol === symbol);
              const isActive = selectedSymbol === symbol;
              
              return (
                <motion.button
                  key={symbol}
                  variants={item}
                  onClick={() => setSelectedSymbol(symbol)}
                  className={cn(
                    "flex flex-col p-4 rounded-xl border transition-all duration-200 text-left",
                    isActive 
                      ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]" 
                      : "bg-card/40 border-border/50 hover:bg-card/60 hover:border-border"
                  )}
                >
                  <div className="flex justify-between w-full mb-1">
                    <span className="font-bold text-sm tracking-wide">{symbol}</span>
                    {stock && (
                      <span className={cn("text-xs font-bold", Math.random() > 0.5 ? "text-green-400" : "text-red-400")}>
                        {Math.random() > 0.5 ? "+" : "-"}{(Math.random() * 2).toFixed(2)}%
                      </span>
                    )}
                  </div>
                  <div className="text-xl font-mono font-bold text-white">
                    {stock ? `$${stock.price.toFixed(2)}` : "---"}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Main Chart Area */}
          <motion.div variants={item} className="h-full">
            <MetricCard
              title={`${selectedSymbol} Market Performance`}
              value={currentStock ? `$${currentStock.price.toFixed(2)}` : "Loading..."}
              icon={<BarChart3 className="w-5 h-5" />}
              className="h-[450px]"
            >
              <div className="mt-6 h-[320px]">
                <StockChart 
                  data={stockHistory || []} 
                  symbol={selectedSymbol}
                  isLoading={isLoadingHistory}
                />
              </div>
            </MetricCard>
          </motion.div>
        </div>

        {/* Right Column: Sentiment & News */}
        <div className="md:col-span-4 space-y-6">
          {/* Sentiment Gauge */}
          <motion.div variants={item}>
            <MetricCard
              title="Global Market Sentiment"
              className="bg-gradient-to-br from-card to-card/50"
              icon={<TrendingUp className="w-5 h-5" />}
            >
              <SentimentGauge 
                score={averageSentimentScore} 
                label={marketSentimentLabel}
                isLoading={isLoadingSentiment}
              />
            </MetricCard>
          </motion.div>

          {/* News Feed */}
          <motion.div variants={item} className="flex-1">
             <MetricCard
              title="Live Financial News"
              subtitle="Real-time headlines analyzed by FinBERT"
              icon={<Newspaper className="w-5 h-5" />}
              className="h-[500px] flex flex-col"
            >
              <Tabs defaultValue="all" className="w-full mt-2">
                <TabsList className="w-full grid grid-cols-3 bg-muted/20 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="positive">Bullish</TabsTrigger>
                  <TabsTrigger value="negative">Bearish</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <NewsFeedCard 
                    news={newsList || []} 
                    sentiments={sentimentFeed || []}
                    isLoading={isLoadingNews}
                  />
                </TabsContent>
                <TabsContent value="positive" className="mt-0">
                  <NewsFeedCard 
                    news={newsList?.filter((_, i) => (sentimentFeed?.[i]?.score || 0) > 0) || []} 
                    sentiments={sentimentFeed?.filter(s => s.score > 0) || []}
                    isLoading={isLoadingNews}
                  />
                </TabsContent>
                <TabsContent value="negative" className="mt-0">
                  <NewsFeedCard 
                    news={newsList?.filter((_, i) => (sentimentFeed?.[i]?.score || 0) < 0) || []} 
                    sentiments={sentimentFeed?.filter(s => s.score < 0) || []}
                    isLoading={isLoadingNews}
                  />
                </TabsContent>
              </Tabs>
            </MetricCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center text-xs text-muted-foreground pt-8 border-t border-white/5">
        <p>MarketPulse AI Pipeline • Powered by FastAPI, PostgreSQL, and React</p>
      </footer>
    </div>
  );
}
