import React from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Coffee, 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  Plus,
  ArrowUpRight,
  DollarSign,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const salesData = [
  { time: '08:00', sales: 450 },
  { time: '10:00', sales: 820 },
  { time: '12:00', sales: 1250 },
  { time: '14:00', sales: 980 },
  { time: '16:00', sales: 750 },
  { time: '18:00', sales: 1450 },
  { time: '20:00', sales: 1850 },
];

const recentOrders = [
  { id: 'ORD-8821', source: 'Restaurant', table: 'T-12', guest: 'John Doe', total: '$85.50', status: 'Completed', time: '10 mins ago' },
  { id: 'ORD-8822', source: 'Room Service', table: 'Room 402', guest: 'Jane Smith', total: '$42.00', status: 'Preparing', time: '15 mins ago' },
  { id: 'ORD-8823', source: 'Restaurant', table: 'T-05', guest: 'Michael Brown', total: '$124.20', status: 'Pending', time: '22 mins ago' },
  { id: 'ORD-8824', source: 'Bar', table: 'B-02', guest: 'Walk-in', total: '$28.00', status: 'Completed', time: '35 mins ago' },
];

export default function POSDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">POS Dashboard</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Real-time overview of sales and orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/pos/restaurant')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Utensils size={16} />
            New Restaurant Order
          </button>
          <button 
            onClick={() => navigate('/pos/room-service')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            <Coffee size={16} />
            Room Service
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today\'s Sales', value: '$4,850.20', change: '+12%', icon: DollarSign, color: 'emerald' },
          { label: 'Active Orders', value: '18', change: '+5', icon: ShoppingBag, color: 'blue' },
          { label: 'Average Check', value: '$68.50', change: '+3%', icon: TrendingUp, color: 'amber' },
          { label: 'Total Guests', value: '142', change: '+24', icon: Users, color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Sales Trend (Today)</h3>
            <select className="bg-[#f8f9fa] border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-0">
              <option>Hourly</option>
              <option>By Category</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1a1a1a" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#1a1a1a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-8">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                <Utensils size={24} className="text-white/60" />
                <span className="text-xs font-medium">Tables</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                <ShoppingBag size={24} className="text-white/60" />
                <span className="text-xs font-medium">Inventory</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                <Users size={24} className="text-white/60" />
                <span className="text-xs font-medium">Staff</span>
              </button>
              <button className="flex flex-col items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5">
                <LayoutDashboard size={24} className="text-white/60" />
                <span className="text-xs font-medium">Reports</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 mb-4">
              <AlertCircle size={18} />
              <h4 className="text-sm font-semibold">Low Stock Alerts</h4>
            </div>
            <div className="space-y-3">
              {[
                { item: 'House Red Wine', stock: '2 bottles left' },
                { item: 'Fresh Salmon', stock: '5 portions left' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-amber-900/60">{alert.item}</span>
                  <span className="font-bold text-amber-900">{alert.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium">Recent Orders</h3>
          <button className="text-sm font-medium text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Order ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Source</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Guest / Table</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Total</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Time</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer" onClick={() => navigate(`/pos/order/${order.id}`)}>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{order.source}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{order.guest}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{order.table}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-[#1a1a1a]">{order.total}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      order.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      order.status === 'Preparing' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/40">{order.time}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                      <ChevronRight size={18} />
                    </button>
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
