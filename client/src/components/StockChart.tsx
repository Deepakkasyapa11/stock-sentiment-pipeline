import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { format } from "date-fns";
import type { StockData } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface StockChartProps {
  data: StockData[];
  symbol: string;
  isLoading: boolean;
  color?: string;
}

export function StockChart({ data, symbol, isLoading, color = "#3b82f6" }: StockChartProps) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formattedTime: format(new Date(item.timestamp), "HH:mm:ss"),
    })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center bg-card/30 rounded-lg border border-white/5">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-[250px] w-full flex items-center justify-center bg-card/30 rounded-lg border border-white/5 text-muted-foreground">
        No data available for {symbol}
      </div>
    );
  }

  const latestPrice = chartData[chartData.length - 1]?.price;
  const startPrice = chartData[0]?.price;
  const isUp = latestPrice >= startPrice;
  const strokeColor = isUp ? "#22c55e" : "#ef4444"; // Green or Red based on performance

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id={`gradient-${symbol}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
          <XAxis 
            dataKey="formattedTime" 
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              borderColor: '#374151',
              color: '#f3f4f6',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: '#e5e7eb' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.25rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={strokeColor} 
            strokeWidth={2}
            fillOpacity={1} 
            fill={`url(#gradient-${symbol})`} 
            isAnimationActive={false} // Disable animation for smoother polling updates
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
