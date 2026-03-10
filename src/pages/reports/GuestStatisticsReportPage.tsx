import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Download, Users, MapPin, Globe, UserCheck, Calendar } from 'lucide-react';
import { guestStatsData, bookingSourceData } from '../../data/mockReports';

const COLORS = ['#1a1a1a', '#1a1a1a80', '#1a1a1a40', '#1a1a1a10'];

export default function GuestStatisticsReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Guest Statistics</h1>
          <p className="text-sm text-[#1a1a1a]/60">Demographics and guest behavior analysis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>Last 30 Days</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Total Guests</p>
          </div>
          <p className="text-3xl font-serif font-medium">1,248</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+15% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Returning Guests</p>
          </div>
          <p className="text-3xl font-serif font-medium">32%</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Globe size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">International</p>
          </div>
          <p className="text-3xl font-serif font-medium">45%</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium mt-2">Stable</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={20} className="text-[#1a1a1a]/40" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Top Region</p>
          </div>
          <p className="text-3xl font-serif font-medium">Europe</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium mt-2">28% of total</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Guest Segments</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={guestStatsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {guestStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {guestStatsData.map((item, index) => (
              <div key={item.category} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs text-[#1a1a1a]/60">{item.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Booking Sources</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingSourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="source" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a' }} 
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" fill="#1a1a1a" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
