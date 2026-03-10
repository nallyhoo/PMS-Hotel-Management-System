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
import { Calendar, Globe, Smartphone, UserCheck } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const bookingChannels = [
  { name: 'Website', value: 45, color: '#1a1a1a' },
  { name: 'Booking.com', value: 25, color: '#4b5563' },
  { name: 'Expedia', value: 15, color: '#9ca3af' },
  { name: 'Direct Call', value: 10, color: '#d1d5db' },
  { name: 'Walk-in', value: 5, color: '#f3f4f6' },
];

const bookingTrends = [
  { month: 'Jan', bookings: 420 },
  { month: 'Feb', bookings: 380 },
  { month: 'Mar', bookings: 510 },
  { month: 'Apr', bookings: 460 },
  { month: 'May', bookings: 590 },
  { month: 'Jun', bookings: 640 },
];

export default function BookingAnalyticsDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Booking Analytics</h1>
        <p className="text-sm text-[#1a1a1a]/60 font-light">Deep dive into reservation patterns and channel efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value="1,240" change={8.2} isPositive={true} icon={Calendar} subtitle="Last 30 days" />
        <StatCard title="Online Share" value="85%" change={3.1} isPositive={true} icon={Globe} subtitle="Web & OTA" />
        <StatCard title="Mobile Bookings" value="62%" change={12.5} isPositive={true} icon={Smartphone} subtitle="Via mobile devices" />
        <StatCard title="Repeat Guests" value="24%" change={2.4} isPositive={true} icon={UserCheck} subtitle="Loyalty program" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Booking Volume Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingTrends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                <Bar dataKey="bookings" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Channel Performance</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingChannels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {bookingChannels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {bookingChannels.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-[#1a1a1a]/60">{item.name}</span>
                  <span className="text-xs font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
