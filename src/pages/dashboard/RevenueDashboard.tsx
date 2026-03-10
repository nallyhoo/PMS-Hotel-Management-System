import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const revenueBySource = [
  { name: 'Direct', value: 45000, color: '#1a1a1a' },
  { name: 'OTA', value: 32000, color: '#4b5563' },
  { name: 'Corporate', value: 28000, color: '#9ca3af' },
  { name: 'Groups', value: 15000, color: '#d1d5db' },
];

const revenueByDepartment = [
  { name: 'Rooms', value: 85000 },
  { name: 'F&B', value: 24000 },
  { name: 'Spa', value: 8500 },
  { name: 'Events', value: 12000 },
  { name: 'Others', value: 3500 },
];

export default function RevenueDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Revenue Analytics</h1>
        <p className="text-sm text-[#1a1a1a]/60 font-light">Detailed breakdown of financial inflows and channel performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Net Revenue" value="$133,000" change={14.2} isPositive={true} icon={DollarSign} subtitle="Total for current month" />
        <StatCard title="Avg. Booking Value" value="$842" change={3.5} isPositive={true} icon={TrendingUp} subtitle="Per reservation" />
        <StatCard title="Direct Bookings" value="42%" change={5.1} isPositive={true} icon={CreditCard} subtitle="Channel share" />
        <StatCard title="Ancillary Revenue" value="$44,000" change={12.8} isPositive={true} icon={Wallet} subtitle="F&B, Spa, etc." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Revenue by Department</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDepartment}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                <Bar dataKey="value" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Channel Distribution</h3>
          <div className="h-[350px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-48 space-y-4">
              {revenueBySource.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-serif pl-5">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
