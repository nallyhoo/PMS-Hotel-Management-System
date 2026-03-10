import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  History,
  Package,
  Calendar,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { mockSuppliers, mockPurchaseHistory } from '../../data/mockSuppliers';

export default function SupplierDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const supplier = mockSuppliers.find(s => s.id === id);
  const history = mockPurchaseHistory.filter(h => h.supplierId === id);

  if (!supplier) {
    return (
      <div className="p-12 text-center">
        <p className="text-[#1a1a1a]/40 italic">Supplier not found.</p>
        <button onClick={() => navigate('/suppliers/list')} className="mt-4 text-[#1a1a1a] underline">Back to list</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/suppliers/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">{supplier.name}</h1>
            <p className="text-sm text-[#1a1a1a]/60">Supplier ID: {supplier.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/suppliers/history/${supplier.id}`)}
            className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
          >
            <History size={18} />
            <span>Purchase History</span>
          </button>
          <button 
            onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Edit size={18} />
            <span>Edit Supplier</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info Cards */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Contact Information</h3>
              <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                supplier.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                {supplier.status}
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#1a1a1a]/40 font-medium">Contact Person</p>
                  <p className="text-sm font-medium">{supplier.contactPerson}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#1a1a1a]/40 font-medium">Email Address</p>
                  <p className="text-sm font-medium">{supplier.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#1a1a1a]/40 font-medium">Phone Number</p>
                  <p className="text-sm font-medium">{supplier.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-[#1a1a1a]/40 font-medium">Physical Address</p>
                  <p className="text-sm font-medium leading-relaxed">{supplier.address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Supplier Performance</h3>
            <div className="flex items-center justify-between p-3 bg-[#f8f9fa] rounded-lg">
              <div className="flex items-center gap-2">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">Rating</span>
              </div>
              <span className="text-lg font-serif font-medium">{supplier.rating}/5.0</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-[#f8f9fa] rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Total Orders</p>
                <p className="text-xl font-serif font-medium">{history.length}</p>
              </div>
              <div className="p-3 bg-[#f8f9fa] rounded-lg">
                <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Total Spent</p>
                <p className="text-xl font-serif font-medium">${history.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity & Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
            <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Recent Purchase Orders</h3>
              <button 
                onClick={() => navigate(`/suppliers/history/${supplier.id}`)}
                className="text-xs text-[#1a1a1a] hover:underline flex items-center gap-1"
              >
                View All <ExternalLink size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Order ID</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Items</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/5">
                  {history.slice(0, 5).map((order) => (
                    <tr key={order.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-medium text-[#1a1a1a]">{order.id}</td>
                      <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{order.orderDate}</td>
                      <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{order.items} items</td>
                      <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">${order.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                          order.status === 'delivered' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : order.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">No purchase history found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Supplied Inventory Items</h3>
              <button className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg text-xs flex items-center gap-2 hover:bg-[#333] transition-colors">
                <Package size={14} />
                <span>Link New Item</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* This would normally be populated from an inventory table linked to this supplier */}
              <div className="p-4 border border-[#1a1a1a]/5 rounded-xl flex items-center gap-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-[#1a1a1a]/5 rounded-lg flex items-center justify-center text-[#1a1a1a]/40 group-hover:bg-white transition-colors">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">Premium Bed Linens (King)</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">SKU: LIN-001</p>
                </div>
              </div>
              <div className="p-4 border border-[#1a1a1a]/5 rounded-xl flex items-center gap-4 hover:bg-[#f8f9fa] transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-[#1a1a1a]/5 rounded-lg flex items-center justify-center text-[#1a1a1a]/40 group-hover:bg-white transition-colors">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#1a1a1a]">Cotton Towel Set</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">SKU: LIN-005</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
