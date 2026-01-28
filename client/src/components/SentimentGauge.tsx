import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

interface SentimentGaugeProps {
  score: number; // -1 to 1
  label: string;
  isLoading?: boolean;
}

export function SentimentGauge({ score, label, isLoading }: SentimentGaugeProps) {
  // Normalize score from [-1, 1] to [0, 100] for easier visualization logic
  const normalizedScore = (score + 1) * 50;
  
  const data = useMemo(() => [
    { name: "Score", value: 1 }, // Just a full circle background essentially
  ], []);

  // Determine color based on score
  const getColor = (s: number) => {
    if (s > 0.3) return "#22c55e"; // Green/Bullish
    if (s < -0.3) return "#ef4444"; // Red/Bearish
    return "#eab308"; // Yellow/Neutral
  };

  const color = getColor(score);
  
  // Calculate rotation for the needle (-90deg to 90deg maps to -1 to 1 score)
  // Recharts pie starts at 0deg (3 o'clock). We want semi-circle from 180 (9 o'clock) to 0.
  // Actually, easiest is to use a CSS rotation on a needle div over a semi-circle SVG.
  
  // Let's use a simpler visual approach: A progress bar styled as a gauge or simple bar
  // Since Recharts gauges are tricky, let's build a custom CSS gauge which looks cleaner.

  if (isLoading) {
    return <div className="h-40 w-full animate-pulse bg-muted/20 rounded-xl" />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-32 overflow-hidden mb-4">
        {/* Semi-circle background */}
        <div className="absolute top-0 left-0 w-full h-64 rounded-full border-[20px] border-muted/30 box-border" />
        
        {/* Active arc - simplified as a rotating masked element or simple gradient bar below */}
        {/* Let's try a different visualization: A simple clean meter */}
      </div>

      {/* Alternative Clean Visualization */}
      <div className="w-full max-w-xs space-y-6">
        <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
          <span>Bearish</span>
          <span>Neutral</span>
          <span>Bullish</span>
        </div>
        
        <div className="relative h-4 bg-muted/30 rounded-full overflow-hidden backdrop-blur-sm">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 opacity-20" />
          
          {/* Indicator Pill */}
          <motion.div 
            className="absolute top-0 bottom-0 w-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] rounded-full z-10"
            initial={{ left: "50%" }}
            animate={{ left: `${Math.min(Math.max(normalizedScore, 0), 100)}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </div>

        <div className="text-center">
          <motion.div 
            key={score}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-bold font-mono tracking-tighter"
            style={{ color }}
          >
            {score.toFixed(2)}
          </motion.div>
          <div className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-widest">
            MARKET SENTIMENT: <span style={{ color }}>{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
