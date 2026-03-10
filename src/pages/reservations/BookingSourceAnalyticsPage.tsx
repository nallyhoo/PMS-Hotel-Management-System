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
  CartesianGrid,
  Legend
} from 'recharts';
import { Globe, Smartphone, UserCheck, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const bookingChannels = [
  { name: 'Website', value: 45, color: '#1a1a1a' },
  { name: 'Booking.com', value: 25, color: '#4b5563' },
  { name: 'Expedia', value: 15, color: '#9ca3af' },
  { name: 'Direct Call', value: 10, color: '#d1d5db' },
  { name: 'Walk-in', value: 5, color: '#f3f4f6' },
];

const channelPerformance = [
  { name: 'Jan', direct: 120, ota: 280, corporate: 80 },
  { name: 'Feb', direct: 150, ota: 250, corporate: 90 },
  { name: 'Mar', direct: 210, ota: 310, corporate: 110 },
  { name: 'Apr', direct: 180, ota: 290, corporate: 100 },
  { name: 'May', direct: 240, ota: 350, corporate: 130 },
  { name: 'Jun', direct: 280, ota: 380, corporate: 150 },
];

export default function BookingSourceAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-light mb-1">Booking Source Analytics</h1>
        <p className="text-sm text-[#1a1a1a]/60 font-light">Detailed analysis of reservation channels and customer acquisition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Direct Booking Share" value="42%" change={5.4} isPositive={true} icon={Globe} subtitle="vs. last month" />
        <StatCard title="OTA Commission" value="$12,450" change={2.1} isPositive={false} icon={ArrowDownRight} subtitle="Estimated for March" />
        <StatCard title="Mobile Bookings" value="68%" change={12.5} isPositive={true} icon={Smartphone} subtitle="Via mobile devices" />
        <StatCard title="Conversion Rate" value="3.8%" change={0.2} isPositive={true} icon={TrendingUp} subtitle="Website visitors" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Channel Distribution */}
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Channel Distribution</h3>
          <div className="h-[350px] w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bookingChannels}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
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
            <div className="w-48 space-y-4">
              {bookingChannels.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-medium">{item.name}</span>
                  </div>
                  <span className="text-sm font-serif pl-5">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Channel Performance Trend */}
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-6">Volume by Channel Type</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                <Legend />
                <Bar dataKey="direct" fill="#1a1a1a" radius={[4, 4, 0, 0]} name="Direct" />
                <Bar dataKey="ota" fill="#9ca3af" radius={[4, 4, 0, 0]} name="OTA" />
                <Bar dataKey="corporate" fill="#d1d5db" radius={[4, 4, 0, 0]} name="Corporate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Channel Efficiency Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5">
          <h3 className="text-lg font-serif">Channel Efficiency</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">ADR</th>
                <th className="px-6 py-4">RevPAR Contribution</th>
                <th className="px-6 py-4">Commission Cost</th>
                <th className="px-6 py-4">Net ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {[
                { source: 'Website', adr: '$245', revpar: '$182', comm: '0%', roi: 'High' },
                { source: 'Booking.com', adr: '$210', revpar: '$145', comm: '15%', roi: 'Medium' },
                { source: 'Expedia', adr: '$205', revpar: '$138', comm: '18%', roi: 'Medium' },
                { source: 'Direct Call', adr: '$255', revpar: '$190', comm: '0%', roi: 'Very High' },
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4 font-medium text-sm">{item.source}</td>
                  <td className="px-6 py-4 text-sm font-serif">{item.adr}</td>
                  <td className="px-6 py-4 text-sm font-serif">{item.revpar}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-medium">{item.comm}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
                      item.roi.includes('High') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {item.roi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
