import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreVertical, 
  Phone, 
  Mail, 
  MapPin, 
  Star,
  ExternalLink,
  Edit,
  Trash2,
  History
} from 'lucide-react';
import { mockSuppliers, Supplier } from '../../data/mockSuppliers';

export default function SupplierListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const categories = ['All', ...new Set(mockSuppliers.map(s => s.category))];

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Suppliers</h1>
          <p className="text-sm text-[#1a1a1a]/60">Manage your property's vendors and suppliers</p>
        </div>
        <button 
          onClick={() => navigate('/suppliers/add')}
          className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors w-fit"
        >
          <Plus size={18} />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search suppliers or contact persons..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Supplier</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Contact</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Rating</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Last Order</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-[#1a1a1a]">{supplier.name}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 font-mono">{supplier.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-[#1a1a1a]">{supplier.contactPerson}</span>
                      <span className="text-[#1a1a1a]/50 text-xs">{supplier.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/70">
                      {supplier.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                      supplier.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                    {supplier.lastOrderDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/suppliers/details/${supplier.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="View Details"
                      >
                        <ExternalLink size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/suppliers/history/${supplier.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="Purchase History"
                      >
                        <History size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/suppliers/edit/${supplier.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredSuppliers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[#1a1a1a]/40 italic">No suppliers found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
