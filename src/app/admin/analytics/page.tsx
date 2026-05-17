"use client";

import { PieChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Detailed Analytics</h1>
        <p className="text-sage-500 text-sm">Deep dive into platform metrics</p>
      </div>

      <div className="bg-white rounded-xl border border-cream-200 p-12 text-center flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-brand-50 rounded-full flex items-center justify-center mb-4">
          <PieChart className="h-8 w-8 text-brand-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Analytics Engine</h3>
        <p className="text-sage-500 max-w-sm">Advanced Recharts integration for cohort and conversion analysis is under construction.</p>
      </div>
    </div>
  );
}
