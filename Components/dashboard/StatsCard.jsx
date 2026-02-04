import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  trendUp = true,
  className,
  delay = 0 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden bg-white rounded-2xl border border-slate-100 p-6",
        "shadow-lg shadow-slate-200/50 hover:shadow-xl transition-shadow",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                "text-xs font-medium",
                trendUp ? "text-emerald-600" : "text-rose-600"
              )}>
                {trendUp ? '↑' : '↓'} {trend}
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
      </div>
      
      {}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl" />
    </motion.div>
  );
}