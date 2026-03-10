import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Search, 
  Filter, 
  Download, 
  FileText,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { mockSuppliers, mockPurchaseHistory } from '../../data/mockSuppliers';

export default function SupplierPurchaseHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const supplier = mockSuppliers.find(s => s.id === id);
  const [searchTerm, setSearchTerm] = useState('');
  
  const history = mockPurchaseHistory.filter(h => {
    const matchesSupplier = h.supplierId === id;
    const matchesSearch = h.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSupplier && matchesSearch;
  });

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/suppliers/details/${supplier.id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Purchase History</h1>
            <p className="text-sm text-[#1a1a1a]/60">All orders placed with {supplier.name}</p>
          </div>
        </div>
        <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors w-fit">
          <Download size={18} />
          <span>Export History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Total Orders</p>
          <p className="text-3xl font-serif font-medium">{history.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Total Expenditure</p>
          <p className="text-3xl font-serif font-medium">${history.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold mb-1">Average Order Value</p>
          <p className="text-3xl font-serif font-medium">
            ${history.length > 0 ? (history.reduce((acc, curr) => acc + curr.amount, 0) / history.length).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by Order ID..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Calendar size={18} />
              <span>Date Range</span>
            </button>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#1a1a1a]">
                    Order ID <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#1a1a1a]">
                    Date <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Items</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#1a1a1a]">
                    Amount <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {history.map((order) => (
                <tr key={order.id} className="hover:bg-[#f8f9fa] transition-colors group">
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
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]" title="View Invoice">
                      <FileText size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {history.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[#1a1a1a]/40 italic">No purchase history found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
