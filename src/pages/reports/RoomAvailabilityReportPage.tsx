import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Download, Filter, Search, Calendar, BedDouble, CheckCircle2, AlertCircle } from 'lucide-react';
import { roomAvailabilityData } from '../../data/mockReports';

export default function RoomAvailabilityReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Room Availability Report</h1>
          <p className="text-sm text-[#1a1a1a]/60">Real-time room status and availability forecast</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>Next 7 Days</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Available Rooms</p>
            <p className="text-2xl font-serif font-medium">38</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <BedDouble size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Occupied Rooms</p>
            <p className="text-2xl font-serif font-medium">76</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Under Maintenance</p>
            <p className="text-2xl font-serif font-medium">7</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
        <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Availability by Room Type</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={roomAvailabilityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#1a1a1a40' }} />
              <YAxis 
                dataKey="type" 
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
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="available" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="occupied" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
              <Bar dataKey="maintenance" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#1a1a1a]">Detailed Availability Forecast</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={16} />
            <input 
              type="text" 
              placeholder="Search room type..." 
              className="pl-9 pr-4 py-1.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Room Type</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Total</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Available</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Occupied</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Maintenance</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Utilization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {roomAvailabilityData.map((row) => {
                const total = row.available + row.occupied + row.maintenance;
                const utilization = Math.round((row.occupied / total) * 100);
                return (
                  <tr key={row.type} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{row.type}</td>
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{total}</td>
                    <td className="px-6 py-4 text-sm text-emerald-600 font-medium">{row.available}</td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-medium">{row.occupied}</td>
                    <td className="px-6 py-4 text-sm text-amber-600 font-medium">{row.maintenance}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs font-medium text-[#1a1a1a]">{utilization}%</span>
                        <div className="w-16 h-1.5 bg-[#f8f9fa] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#1a1a1a] rounded-full" 
                            style={{ width: `${utilization}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
