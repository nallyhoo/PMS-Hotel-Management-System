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
import { Download, BookOpen, Calendar, Globe, Monitor, Phone, Filter } from 'lucide-react';
import { bookingSourceData } from '../../data/mockReports';

const trendData = [
  { date: '2024-03-01', bookings: 12 },
  { date: '2024-03-02', bookings: 18 },
  { date: '2024-03-03', bookings: 15 },
  { date: '2024-03-04', bookings: 22 },
  { date: '2024-03-05', bookings: 30 },
  { date: '2024-03-06', bookings: 25 },
  { date: '2024-03-07', bookings: 28 },
];

export default function BookingReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Booking Report</h1>
          <p className="text-sm text-[#1a1a1a]/60">Reservation trends and booking channel analysis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>Last 7 Days</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Total Bookings</p>
          </div>
          <p className="text-3xl font-serif font-medium">1,190</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Monitor size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Online Bookings</p>
          </div>
          <p className="text-3xl font-serif font-medium">85%</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium mt-2">Mostly via Website</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Phone size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Direct/Phone</p>
          </div>
          <p className="text-3xl font-serif font-medium">15%</p>
          <p className="text-xs text-red-600 font-medium mt-2">-2% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">OTA Share</p>
          </div>
          <p className="text-3xl font-serif font-medium">42%</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium mt-2">Booking.com leading</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
        <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Daily Booking Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorBook" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { weekday: 'short' })}
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
                dataKey="bookings" 
                stroke="#1a1a1a" 
                fillOpacity={1} 
                fill="url(#colorBook)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
        <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Bookings by Channel</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bookingSourceData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="source" 
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
                cursor={{ fill: '#f8f9fa' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" fill="#1a1a1a" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
