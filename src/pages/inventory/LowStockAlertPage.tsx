import React from 'react';
import { 
  ArrowLeft, 
  AlertTriangle, 
  RefreshCw, 
  Truck, 
  ChevronRight, 
  Boxes, 
  TrendingUp, 
  ArrowUpRight,
  ShoppingCart,
  Clock,
  Info,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lowStockItems = [
  { id: 'INV-002', name: 'Fresh Salmon', category: 'Food', stock: 5, minStock: 10, unit: 'Portions', status: 'Critical' },
  { id: 'INV-007', name: 'Cleaning Liquid', category: 'Housekeeping', stock: 8, minStock: 10, unit: 'Liters', status: 'Warning' },
  { id: 'INV-005', name: 'House White Wine', category: 'Beverage', stock: 0, minStock: 12, unit: 'Bottles', status: 'Out of Stock' },
  { id: 'INV-012', name: 'Toilet Paper Rolls', category: 'Housekeeping', stock: 45, minStock: 100, unit: 'Units', status: 'Warning' },
  { id: 'INV-015', name: 'Napkins (Pack)', category: 'Food', stock: 12, minStock: 50, unit: 'Packs', status: 'Critical' },
];

export default function LowStockAlertPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/inventory/dashboard')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Low Stock Alerts</h1>
            <p className="text-[#1a1a1a]/60 mt-1 text-sm">Items requiring immediate attention or reordering</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
            <ShoppingCart size={16} />
            Create Purchase Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {[
          { label: 'Critical Items', value: '12', color: 'red', icon: AlertTriangle },
          { label: 'Warning Level', value: '30', color: 'amber', icon: Info },
          { label: 'Out of Stock', value: '5', color: 'slate', icon: Boxes },
          { label: 'Pending Reorders', value: '8', color: 'blue', icon: Truck },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts Table */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 bg-red-50/30">
          <div className="flex items-center gap-3 text-red-800">
            <AlertTriangle size={20} />
            <h3 className="font-serif text-lg font-medium">Critical Stock Alerts</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item Name</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Current Stock</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Min Threshold</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Deficit</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {lowStockItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{item.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{item.name}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{item.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1a1a1a]">{item.stock} {item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{item.minStock} {item.unit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-red-600">-{Math.max(0, item.minStock - item.stock)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.status === 'Critical' ? 'bg-red-50 text-red-600' : 
                      item.status === 'Out of Stock' ? 'bg-slate-100 text-slate-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/inventory/adjustment?item=${item.id}`)}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 transition-colors"
                        title="Adjust Stock"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
                        <Plus size={12} />
                        Order
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suggested Reorders */}
      <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck size={20} className="text-blue-600" />
            <h3 className="font-serif text-lg font-medium">Suggested Reorders</h3>
          </div>
          <button className="text-xs font-bold text-blue-600 uppercase tracking-widest hover:underline">View Procurement Plan</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { item: 'House Red Wine', qty: 48, supplier: 'Global Foods Inc.', eta: '2 Days' },
            { item: 'Bath Towels', qty: 100, supplier: 'Linen Co.', eta: '5 Days' },
            { item: 'Coffee Beans', qty: 20, supplier: 'Roast Masters', eta: '3 Days' },
          ].map((order, i) => (
            <div key={i} className="p-4 bg-[#f8f9fa] rounded-2xl border border-[#1a1a1a]/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1a1a1a]">{order.item}</span>
                <span className="text-xs font-bold text-blue-600">Qty: {order.qty}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">
                <span>{order.supplier}</span>
                <div className="flex items-center gap-1">
                  <Clock size={10} />
                  <span>ETA: {order.eta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
