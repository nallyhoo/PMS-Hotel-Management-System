import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight, 
  RefreshCw, 
  History, 
  Plus,
  Search,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Boxes,
  Truck
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
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stockStatusData = [
  { name: 'In Stock', value: 450, color: '#10b981' },
  { name: 'Low Stock', value: 42, color: '#f59e0b' },
  { name: 'Out of Stock', value: 12, color: '#ef4444' },
];

const inventoryValueData = [
  { category: 'Food', value: 12500 },
  { category: 'Beverage', value: 8400 },
  { category: 'Housekeeping', value: 5200 },
  { category: 'Maintenance', value: 3100 },
  { category: 'Office', value: 1800 },
];

const recentTransactions = [
  { id: 'TRX-1001', item: 'House Red Wine', type: 'In', qty: '+24', user: 'Sarah M.', time: '2 hours ago' },
  { id: 'TRX-1002', item: 'Fresh Salmon', type: 'Out', qty: '-12', user: 'Chef Marco', time: '4 hours ago' },
  { id: 'TRX-1003', item: 'Bath Towels', type: 'In', qty: '+50', user: 'James L.', time: '5 hours ago' },
  { id: 'TRX-1004', item: 'Toiletries Kit', type: 'Out', qty: '-30', user: 'Housekeeping', time: '6 hours ago' },
];

export default function InventoryDashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Inventory Dashboard</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Monitor stock levels and asset movements</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/inventory/items/add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            Add New Item
          </button>
          <button 
            onClick={() => navigate('/inventory/adjustment')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            <RefreshCw size={16} />
            Stock Adjustment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Items', value: '504', change: '+12', icon: Boxes, color: 'blue' },
          { label: 'Inventory Value', value: '$31,000', change: '+$2.4k', icon: TrendingUp, color: 'emerald' },
          { label: 'Low Stock Alerts', value: '42', change: '+5', icon: AlertTriangle, color: 'amber' },
          { label: 'Pending Orders', value: '8', change: '-2', icon: Truck, color: 'indigo' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-600 bg-emerald-50' : 'text-blue-600 bg-blue-50'} px-2 py-1 rounded-full`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Value by Category */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium">Inventory Value by Category</h3>
            <BarChart3 size={20} className="text-[#1a1a1a]/20" />
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={inventoryValueData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#1a1a1a60' }} 
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#1a1a1a" 
                  radius={[0, 8, 8, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Status Pie */}
        <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
          <h3 className="font-serif text-lg font-medium">Stock Status</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-[#1a1a1a]">504</span>
              <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="space-y-3">
            {stockStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[#1a1a1a]/60">{item.name}</span>
                </div>
                <span className="font-bold text-[#1a1a1a]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <History size={20} className="text-[#1a1a1a]/40" />
            <h3 className="font-serif text-lg font-medium">Recent Transactions</h3>
          </div>
          <button 
            onClick={() => navigate('/inventory/history')}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Full History
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Quantity</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">User</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {recentTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{trx.id}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]">{trx.item}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      trx.type === 'In' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#1a1a1a]">{trx.qty}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{trx.user}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/40">{trx.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
