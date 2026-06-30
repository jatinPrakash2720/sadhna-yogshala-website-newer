"use client";

import { Users, CreditCard, BookOpen, Presentation, Calendar, Video } from "lucide-react";
import AnalyticsCard from "@/components/admin/AnalyticsCard";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import { motion } from "framer-motion";

// Mock Data for Charts
const revenueData = [
  { name: "Jan", total: 12000 },
  { name: "Feb", total: 18000 },
  { name: "Mar", total: 15000 },
  { name: "Apr", total: 24000 },
  { name: "May", total: 21000 },
  { name: "Jun", total: 32000 },
];

const enrollmentsData = [
  { name: "Morning Vinyasa", students: 145 },
  { name: "Evening Yin", students: 85 },
  { name: "Beginner Flow", students: 210 },
  { name: "Meditation", students: 60 },
];

const recentActivity = [
  { id: 1, type: "payment", user: "Sarah Jenkins", detail: "Purchased Morning Vinyasa", time: "2h ago", amount: "₹4,999" },
  { id: 2, type: "enrollment", user: "Michael Chen", detail: "Enrolled in Beginner Flow", time: "5h ago" },
  { id: 3, type: "user", user: "Priya Sharma", detail: "Created a new account", time: "12h ago" },
  { id: 4, type: "payment", user: "David Wilson", detail: "Purchased Evening Yin", time: "1d ago", amount: "₹3,499" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">Dashboard</h1>
          <p className="text-sage-500 font-medium">Welcome back. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-cream-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-cream-50 transition-colors">
            Download Report
          </button>
          <button className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors shadow-sm">
            Create Course
          </button>
        </div>
      </div>

      {/* Top Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard 
          title="Total Revenue" 
          value="₹1,24,500" 
          icon={CreditCard} 
          trend="up" 
          change="+12.5%" 
          delay={0.1} 
        />
        <AnalyticsCard 
          title="Active Students" 
          value="842" 
          icon={Users} 
          trend="up" 
          change="+4.2%" 
          delay={0.2} 
        />
        <AnalyticsCard 
          title="Active Courses" 
          value="24" 
          icon={BookOpen} 
          trend="neutral" 
          change="0%" 
          delay={0.3} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-cream-200 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
            <p className="text-sm text-sage-500">Monthly revenue for the current year</p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#416b50" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#416b50" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#416b50" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Enrollments Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm"
        >
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900">Top Courses</h2>
            <p className="text-sm text-sage-500">By active enrollments</p>
          </div>
          <div className="w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollmentsData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={100}
                  tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="#416b50" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white p-6 rounded-2xl border border-cream-200 shadow-sm"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-cream-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700 gap-2 border border-cream-100 hover:border-brand-200">
              <Presentation className="h-6 w-6" />
              <span className="text-sm font-semibold">New Course</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-cream-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700 gap-2 border border-cream-100 hover:border-brand-200">
              <Video className="h-6 w-6" />
              <span className="text-sm font-semibold">Schedule Class</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-cream-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700 gap-2 border border-cream-100 hover:border-brand-200">
              <Users className="h-6 w-6" />
              <span className="text-sm font-semibold">Manage Users</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 rounded-xl bg-cream-50 hover:bg-brand-50 hover:text-brand-700 transition-colors text-gray-700 gap-2 border border-cream-100 hover:border-brand-200">
              <Calendar className="h-6 w-6" />
              <span className="text-sm font-semibold">View Calendar</span>
            </button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-cream-200 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            <button className="text-sm font-semibold text-brand-600 hover:text-brand-700">View All</button>
          </div>
          
          <div className="space-y-5">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-cream-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-gray-600 text-sm">{activity.user.charAt(0)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {activity.user}
                    {activity.amount && <span className="ml-2 text-green-600">{activity.amount}</span>}
                  </p>
                  <p className="text-sm text-sage-500 truncate">{activity.detail}</p>
                </div>
                <div className="text-xs font-medium text-sage-400 whitespace-nowrap">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
