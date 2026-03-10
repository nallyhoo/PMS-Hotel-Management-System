import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { Download, Filter, Calendar, TrendingUp, DollarSign, ArrowUpRight } from 'lucide-react';
import { revenueData } from '../../data/mockReports';

export default function RevenueReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Revenue Report</h1>
          <p className="text-sm text-[#1a1a1a]/60">Financial performance and revenue analysis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export PDF</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>Last 6 Months</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <DollarSign size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              12.5%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Total Revenue</p>
          <p className="text-3xl font-serif font-medium mt-1">$328,000</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <TrendingUp size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              8.2%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Avg. Monthly Revenue</p>
          <p className="text-3xl font-serif font-medium mt-1">$54,667</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Filter size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              5.4%
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Net Profit Margin</p>
          <p className="text-3xl font-serif font-medium mt-1">$112,400</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Revenue vs Expenses</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#1a1a1a40" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Revenue Growth Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1a1a1a" 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
