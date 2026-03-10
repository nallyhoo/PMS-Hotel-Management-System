import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  ZAxis 
} from 'recharts';
import { Download, Star, CheckCircle2, Clock, Award, Calendar } from 'lucide-react';
import { staffPerformanceData } from '../../data/mockReports';

export default function StaffPerformanceReportPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Staff Performance</h1>
          <p className="text-sm text-[#1a1a1a]/60">Employee productivity and service quality metrics</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors text-sm font-medium">
            <Calendar size={18} />
            <span>This Quarter</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Star size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Avg. Rating</p>
            <p className="text-2xl font-serif font-medium">4.8/5.0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Tasks Completed</p>
            <p className="text-2xl font-serif font-medium">1,420</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Avg. Response Time</p>
            <p className="text-2xl font-serif font-medium">12m</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Staff Ratings Comparison</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={staffPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  domain={[0, 5]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="rating" fill="#1a1a1a" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a] mb-6">Productivity vs Rating</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="tasks" 
                  name="Tasks" 
                  unit=" tasks" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <YAxis 
                  type="number" 
                  dataKey="rating" 
                  name="Rating" 
                  domain={[4, 5]} 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a40' }} 
                />
                <ZAxis type="number" range={[100, 100]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Staff" data={staffPerformanceData} fill="#1a1a1a" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5">
          <h3 className="text-sm font-medium text-[#1a1a1a]">Top Performers</h3>
        </div>
        <div className="divide-y divide-[#1a1a1a]/5">
          {staffPerformanceData.sort((a, b) => b.rating - a.rating).map((staff, index) => (
            <div key={staff.name} className="p-4 flex items-center justify-between hover:bg-[#f8f9fa] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center border border-[#1a1a1a]/10">
                  {index === 0 ? <Award className="text-amber-500" size={20} /> : <span className="text-xs font-medium text-[#1a1a1a]/40">{index + 1}</span>}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">{staff.name}</p>
                  <p className="text-xs text-[#1a1a1a]/40">Senior Staff</p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider font-bold">Rating</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">{staff.rating}/5.0</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider font-bold">Tasks</p>
                  <p className="text-sm font-medium text-[#1a1a1a]">{staff.tasks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
