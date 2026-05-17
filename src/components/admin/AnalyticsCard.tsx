"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
  change: string;
  delay?: number;
}

export default function AnalyticsCard({
  title,
  value,
  icon: Icon,
  trend,
  change,
  delay = 0,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 border border-cream-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
    >
      {/* Decorative gradient blob */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-brand-100 to-transparent rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out" />
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="h-12 w-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
          <Icon className="h-6 w-6" />
        </div>
        
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full",
            trend === "up" && "bg-green-50 text-green-700",
            trend === "down" && "bg-red-50 text-red-700",
            trend === "neutral" && "bg-gray-50 text-gray-700"
          )}
        >
          {trend === "up" && <ArrowUpRight className="h-3.5 w-3.5" />}
          {trend === "down" && <ArrowDownRight className="h-3.5 w-3.5" />}
          {change}
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
          {value}
        </h3>
        <p className="text-sm font-medium text-sage-500">
          {title}
        </p>
      </div>
    </motion.div>
  );
}
