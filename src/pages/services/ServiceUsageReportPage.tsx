import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  Clock, 
  Tag, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft,
  PieChart,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  LineChart,
  Line
} from 'recharts';

const usageData = [
  { name: 'Spa', usage: 145, revenue: 17400 },
  { name: 'Dining', usage: 312, revenue: 7800 },
  { name: 'Transport', usage: 89, revenue: 4005 },
  { name: 'Activities', usage: 56, revenue: 4760 },
  { name: 'Wellness', usage: 78, revenue: 2340 },
];

const trendData = [
  { date: 'Mar 01', usage: 45 },
  { date: 'Mar 02', usage: 52 },
  { date: 'Mar 03', usage: 48 },
  { date: 'Mar 04', usage: 61 },
  { date: 'Mar 05', usage: 55 },
  { date: 'Mar 06', usage: 67 },
  { date: 'Mar 07', usage: 72 },
];

const COLORS = ['#1a1a1a', '#4a4a4a', '#7a7a7a', '#aaaaaa', '#dddddd'];

export default function ServiceUsageReportPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Service Usage Report</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Analyze service performance and guest preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
            <Calendar size={16} />
            {dateRange}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Usage', value: '680', change: '+12.5%', icon: BarChart3, color: 'blue' },
          { label: 'Total Revenue', value: '$36,305', change: '+8.2%', icon: TrendingUp, color: 'emerald' },
          { label: 'Avg. Usage/Day', value: '22.6', change: '-2.1%', icon: Clock, color: 'amber' },
          { label: 'Top Category', value: 'Wellness', change: '+15%', icon: Layers, color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Usage by Category Chart */}
        <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Usage by Category</h3>
            <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/40">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                  {usageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Usage Trend Chart */}
        <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Usage Trend</h3>
            <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/40">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="usage" 
                  stroke="#1a1a1a" 
                  strokeWidth={2} 
                  dot={{ r: 4, fill: '#1a1a1a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Service Performance Table */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-serif text-lg font-medium">Service Performance Details</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
              <input 
                type="text" 
                placeholder="Search services..." 
                className="pl-9 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none"
              />
            </div>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
              <Filter size={18} className="text-[#1a1a1a]/60" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Service</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Usage</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Revenue</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Avg. Rating</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Trend</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {usageData.map((item) => (
                <tr key={item.name} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{item.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{item.usage}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#1a1a1a]">${item.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-[#1a1a1a]">4.8</span>
                      <span className="text-xs text-[#1a1a1a]/40">/ 5.0</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-emerald-600">
                      <ArrowUpRight size={14} />
                      <span className="text-xs font-medium">+5.2%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
