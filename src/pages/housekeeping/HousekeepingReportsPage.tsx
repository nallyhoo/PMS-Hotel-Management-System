import React from 'react';
import { 
  ArrowLeft, 
  BarChart3, 
  Download, 
  Filter, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  PieChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';

const data = [
  { name: 'Maria G.', completed: 12, target: 15 },
  { name: 'John D.', completed: 8, target: 10 },
  { name: 'Elena R.', completed: 14, target: 15 },
  { name: 'Marcus C.', completed: 10, target: 12 },
  { name: 'Sarah J.', completed: 9, target: 10 },
];

const COLORS = ['#1a1a1a', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function HousekeepingReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Housekeeping Reports</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Analyze cleaning performance and operational efficiency.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Avg. Cleaning Time', value: '32m', icon: Clock, trend: '-4m from last week', color: 'text-blue-600' },
          { label: 'Tasks Completed', value: '142', icon: CheckCircle2, trend: '+12% from last week', color: 'text-emerald-600' },
          { label: 'Inspection Pass Rate', value: '96%', icon: TrendingUp, trend: '+2% from last week', color: 'text-indigo-600' },
          { label: 'Delayed Tasks', value: '4', icon: AlertTriangle, trend: '-2 from last week', color: 'text-amber-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-[#f8f9fa] rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif">Staff Productivity</h3>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
              <Calendar size={12} /> Last 7 Days
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#1a1a1a66', fontWeight: 600 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#1a1a1a66', fontWeight: 600 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="completed" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" fill="#1a1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cleaning Type Breakdown */}
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <h3 className="text-lg font-serif">Cleaning Type Distribution</h3>
          <div className="space-y-6">
            {[
              { label: 'Full Clean (Checkout)', value: 64, color: 'bg-[#1a1a1a]' },
              { label: 'Stay-over Clean', value: 42, color: 'bg-indigo-500' },
              { label: 'Deep Clean', value: 12, color: 'bg-emerald-500' },
              { label: 'Touch-up', value: 24, color: 'bg-amber-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#1a1a1a]/60">{item.label}</span>
                  <span className="font-medium">{item.value} tasks</span>
                </div>
                <div className="h-1.5 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${(item.value / 142) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-[#1a1a1a]/5">
            <button className="w-full py-3 bg-[#f8f9fa] hover:bg-[#1a1a1a]/5 rounded-xl text-xs font-medium text-[#1a1a1a]/60 transition-colors">
              Download Detailed Task Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
