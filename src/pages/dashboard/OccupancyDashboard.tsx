import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Users, Home, Calendar, MapPin } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const occupancyTrend = [
  { date: '01 Mar', occupancy: 65, forecast: 68 },
  { date: '02 Mar', occupancy: 72, forecast: 70 },
  { date: '03 Mar', occupancy: 68, forecast: 72 },
  { date: '04 Mar', occupancy: 85, forecast: 82 },
  { date: '05 Mar', occupancy: 94, forecast: 90 },
  { date: '06 Mar', occupancy: 98, forecast: 95 },
  { date: '07 Mar', occupancy: 88, forecast: 85 },
];

const occupancyByRoomType = [
  { type: 'Standard', occupied: 45, total: 60 },
  { type: 'Deluxe', occupied: 38, total: 40 },
  { type: 'Suite', occupied: 12, total: 15 },
  { type: 'Penthouse', occupied: 2, total: 5 },
];

export default function OccupancyDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Occupancy Analysis</h1>
        <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time room availability and occupancy forecasting.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Current Occupancy" value="84%" change={2.4} isPositive={true} icon={Users} subtitle="152 rooms occupied" />
        <StatCard title="Available Rooms" value="28" icon={Home} subtitle="Ready for check-in" />
        <StatCard title="Forecasted (Next 7d)" value="89%" change={5} isPositive={true} icon={Calendar} subtitle="Based on reservations" />
        <StatCard title="Avg. Length of Stay" value="3.2 Days" change={0.4} isPositive={true} icon={MapPin} subtitle="Per guest" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Occupancy Trend & Forecast</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={occupancyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip />
                <Area type="monotone" dataKey="occupancy" stroke="#1a1a1a" fill="#1a1a1a" fillOpacity={0.1} name="Actual" />
                <Area type="monotone" dataKey="forecast" stroke="#9ca3af" fill="transparent" strokeDasharray="5 5" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Occupancy by Room Type</h3>
          <div className="space-y-8">
            {occupancyByRoomType.map((item) => (
              <div key={item.type} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm font-medium">{item.type}</p>
                    <p className="text-xs text-[#1a1a1a]/40">{item.occupied} of {item.total} rooms</p>
                  </div>
                  <span className="text-sm font-serif">{Math.round((item.occupied / item.total) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-[#f8f9fa] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#1a1a1a] rounded-full transition-all duration-1000" 
                    style={{ width: `${(item.occupied / item.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
