import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  value?: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  children?: ReactNode;
  isLoading?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  children,
  isLoading
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-panel rounded-xl p-6 relative overflow-hidden",
        "hover:border-primary/30 transition-colors duration-300",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
            {title}
          </h3>
          {isLoading ? (
             <div className="h-8 w-24 bg-muted/50 rounded animate-pulse" />
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold font-mono text-foreground tracking-tight">
                {value}
              </span>
              {trend && (
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full",
                    trend === "up" && "text-green-400 bg-green-400/10",
                    trend === "down" && "text-red-400 bg-red-400/10",
                    trend === "neutral" && "text-yellow-400 bg-yellow-400/10"
                  )}
                >
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
        )}
      </div>
      
      {subtitle && <p className="text-xs text-muted-foreground mb-4">{subtitle}</p>}
      
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </motion.div>
  );
}
