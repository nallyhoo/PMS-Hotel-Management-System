import React from 'react';
import { 
  Users, 
  Bed, 
  TrendingUp, 
  CalendarCheck, 
  Clock, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import StatCard from '../../components/dashboard/StatCard';

const revenueData = [
  { name: 'Mon', revenue: 4500, occupancy: 65 },
  { name: 'Tue', revenue: 5200, occupancy: 72 },
  { name: 'Wed', revenue: 4800, occupancy: 68 },
  { name: 'Thu', revenue: 6100, occupancy: 85 },
  { name: 'Fri', revenue: 8500, occupancy: 94 },
  { name: 'Sat', revenue: 9200, occupancy: 98 },
  { name: 'Sun', revenue: 7800, occupancy: 88 },
];

const roomStatusData = [
  { name: 'Available', value: 45, color: '#10b981' },
  { name: 'Occupied', value: 120, color: '#1a1a1a' },
  { name: 'Dirty', value: 15, color: '#f59e0b' },
  { name: 'Maintenance', value: 5, color: '#ef4444' },
];

const recentBookings = [
  { id: 'BK-8821', guest: 'Julianne Moore', room: 'Suite 402', status: 'Checked In', date: 'Today, 14:20' },
  { id: 'BK-8822', guest: 'Robert De Niro', room: 'Deluxe 105', status: 'Confirmed', date: 'Today, 15:45' },
  { id: 'BK-8823', guest: 'Meryl Streep', room: 'Penthouse 01', status: 'Arriving', date: 'Today, 18:00' },
  { id: 'BK-8824', guest: 'Al Pacino', room: 'Standard 202', status: 'Checked Out', date: 'Today, 11:30' },
];

export default function MainDashboard() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Property Overview</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Welcome back, Alexander. Here's what's happening at GrandView today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-white border border-[#1a1a1a]/5 rounded-xl flex items-center gap-2 text-xs font-medium">
            <Clock size={14} className="text-[#1a1a1a]/40" />
            <span>March 10, 2026</span>
          </div>
          <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            New Booking
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Revenue" 
          value="$46,280" 
          change={12.5} 
          isPositive={true} 
          icon={TrendingUp}
          subtitle="vs. last 7 days"
        />
        <StatCard 
          title="Occupancy Rate" 
          value="84.2%" 
          change={3.2} 
          isPositive={true} 
          icon={Users}
          subtitle="152/180 rooms"
        />
        <StatCard 
          title="Arrivals Today" 
          value="24" 
          change={8} 
          isPositive={false} 
          icon={CalendarCheck}
          subtitle="12 checked in"
        />
        <StatCard 
          title="Available Rooms" 
          value="28" 
          icon={Bed}
          subtitle="Ready for walk-ins"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-serif mb-1">Revenue Performance</h3>
              <p className="text-xs text-[#1a1a1a]/40 font-light uppercase tracking-widest">Weekly trend analysis</p>
            </div>
            <select className="bg-[#f8f9fa] border-none text-xs font-medium px-3 py-1.5 rounded-lg focus:outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1a1a1a', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1a1a1a" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Status Bar Chart */}
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="text-lg font-serif mb-1">Room Inventory</h3>
          <p className="text-xs text-[#1a1a1a]/40 font-light uppercase tracking-widest mb-8">Current status breakdown</p>
          
          <div className="h-[250px] w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roomStatusData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#1a1a1a', fontWeight: 500 }}
                  width={80}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            {roomStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[#1a1a1a]/60">{item.name}</span>
                </div>
                <span className="font-medium">{item.value} Rooms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
            <h3 className="text-lg font-serif">Recent Reservations</h3>
            <button className="text-xs font-medium text-[#1a1a1a]/40 hover:text-[#1a1a1a] flex items-center gap-1 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#f8f9fa] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-bold">
                          {booking.guest.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{booking.guest}</p>
                          <p className="text-[10px] text-[#1a1a1a]/40">{booking.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{booking.room}</td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
                        booking.status === 'Checked In' ? 'bg-emerald-50 text-emerald-600' :
                        booking.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' :
                        booking.status === 'Arriving' ? 'bg-amber-50 text-amber-600' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#1a1a1a]/40">{booking.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                        <ChevronRight size={16} className="text-[#1a1a1a]/40" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-xl font-serif mb-2">Performance Goal</h3>
            <p className="text-sm text-white/60 font-light mb-8">Monthly occupancy target: 90%</p>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-white/10"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * 84.2) / 100}
                    className="text-white"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-serif">84.2%</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/40">Current</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-light text-white/60">Rooms to target</span>
                <span className="text-xs font-medium">12 more rooms</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full" style={{ width: '84.2%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Decorative Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>
      </div>
    </div>
  );
}
