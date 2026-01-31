import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NewsFeed, SentimentData } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ExternalLink, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsFeedProps {
  news: NewsFeed[];
  sentiments: SentimentData[]; // Correlated sentiment for news if available
  isLoading: boolean;
}

export function NewsFeedCard({ news, sentiments, isLoading }: NewsFeedProps) {
  // Helper to find sentiment for a news item (simple matching for demo)
  // In a real app, this relation would be in the DB. Here we mock or match by closest timestamp/context.
  // For now, let's just assume the pipeline pushes sentiment alongside news or we display latest sentiment.
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border border-white/5 rounded-lg bg-card/50 animate-pulse">
            <div className="h-16 w-16 bg-muted rounded-md" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No news available at the moment.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-3">
        {news.map((item, index) => {
          // Mock correlation: Assign a random sentiment from the list or based on index for visual variety
          // In production, `item` would have a relation to `sentiment_data`
          const sentiment = sentiments[index % sentiments.length]; 
          const isPositive = sentiment?.score > 0.1;
          const isNegative = sentiment?.score < -0.1;
          
          return (
            <div 
              key={item.id} 
              className="group relative flex flex-col gap-2 p-4 rounded-lg bg-card/40 border border-white/5 hover:bg-card/80 hover:border-primary/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono text-primary/70">{item.source}</span>
                    <span className="text-[10px] text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{format(new Date(item.published_at), "MMM d, HH:mm")}</span>
                  </div>
                  <h4 className="font-medium text-sm text-foreground/90 leading-snug group-hover:text-primary transition-colors">
                    {item.headline}
                  </h4>
                </div>
                
                {sentiment && (
                  <div className={cn(
                    "flex flex-col items-end min-w-[60px]",
                    isPositive ? "text-green-400" : isNegative ? "text-red-400" : "text-yellow-400"
                  )}>
                    <span className="text-xs font-bold font-mono">
                      {sentiment.score > 0 ? "+" : ""}{sentiment.score.toFixed(2)}
                    </span>
                    {isPositive ? <TrendingUp size={14} /> : isNegative ? <TrendingDown size={14} /> : <Minus size={14} />}
                  </div>
                )}
              </div>
              
              {item.headline && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                  {item.headline}
                </p>
              )}
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] border-white/10 h-5 px-1.5 bg-transparent text-muted-foreground">
                    News
                  </Badge>
                  {sentiment && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px] h-5 px-1.5 bg-transparent border-none",
                        isPositive ? "text-green-400 bg-green-400/10" : isNegative ? "text-red-400 bg-red-400/10" : "text-yellow-400 bg-yellow-400/10"
                      )}
                    >
                      {sentiment.label}
                    </Badge>
                  )}
                </div>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs flex items-center gap-1 text-primary/60 hover:text-primary transition-colors"
                >
                  Read <ExternalLink size={10} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
