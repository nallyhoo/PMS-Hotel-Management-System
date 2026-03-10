import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Download, Calendar, Users, Bed, Clock } from 'lucide-react';
import { occupancyData, guestStatsData } from '../../data/mockReports';

const COLORS = ['#1a1a1a', '#1a1a1a80', '#1a1a1a40', '#1a1a1a10'];

export default function OccupancyReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Occupancy Report</h1>
          <p className="text-sm text-[#1a1a1a]/60">Room utilization and occupancy trends</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export CSV</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>This Week</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Current Occupancy</p>
          <p className="text-3xl font-serif font-medium">84%</p>
          <div className="mt-4 h-1.5 w-full bg-[#f8f9fa] rounded-full overflow-hidden">
            <div className="h-full bg-[#1a1a1a] rounded-full" style={{ width: '84%' }}></div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Avg. Daily Rate</p>
          <p className="text-3xl font-serif font-medium">$185</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+4.2% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">RevPAR</p>
          <p className="text-3xl font-serif font-medium">$155.40</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">+2.1% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Avg. Stay Length</p>
          <p className="text-3xl font-serif font-medium">2.4 Days</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium mt-2">Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Weekly Occupancy Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                  unit="%"
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#1a1a1a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1a1a1a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Guest Segment Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={guestStatsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
          <div className="mt-4 space-y-2">
            {guestStatsData.map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-xs text-[#1a1a1a]/60">{item.category}</span>
                </div>
                <span className="text-xs font-medium text-[#1a1a1a]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
