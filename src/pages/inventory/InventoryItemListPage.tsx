import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  ChevronRight, 
  AlertTriangle, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Download,
  Boxes,
  Tag,
  History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const inventoryItems = [
  { id: 'INV-001', name: 'House Red Wine', category: 'Beverage', stock: 24, minStock: 12, unit: 'Bottles', price: 12.50, status: 'In Stock' },
  { id: 'INV-002', name: 'Fresh Salmon', category: 'Food', stock: 5, minStock: 10, unit: 'Portions', price: 8.00, status: 'Low Stock' },
  { id: 'INV-003', name: 'Bath Towels', category: 'Housekeeping', stock: 150, minStock: 50, unit: 'Units', price: 15.00, status: 'In Stock' },
  { id: 'INV-004', name: 'Toiletries Kit', category: 'Housekeeping', stock: 300, minStock: 100, unit: 'Kits', price: 2.50, status: 'In Stock' },
  { id: 'INV-005', name: 'House White Wine', category: 'Beverage', stock: 0, minStock: 12, unit: 'Bottles', price: 10.50, status: 'Out of Stock' },
  { id: 'INV-006', name: 'Coffee Beans', category: 'Food', stock: 15, minStock: 5, unit: 'kg', price: 22.00, status: 'In Stock' },
  { id: 'INV-007', name: 'Cleaning Liquid', category: 'Housekeeping', stock: 8, minStock: 10, unit: 'Liters', price: 5.50, status: 'Low Stock' },
];

export default function InventoryItemListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredItems = inventoryItems.filter(item => 
    (selectedCategory === 'All' || item.category === selectedCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Inventory Items</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Manage resort stock and assets</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/inventory/items/add')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            Add Item
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-[#f8f9fa] border-none rounded-xl px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none transition-all"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Food">Food</option>
            <option value="Beverage">Beverage</option>
            <option value="Housekeeping">Housekeeping</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Filter size={16} />
            More Filters
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Name / Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Stock Level</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Unit Price</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredItems.map((item) => (
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
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between w-32">
                        <span className="text-sm font-bold text-[#1a1a1a]">{item.stock} {item.unit}</span>
                        <span className="text-[10px] text-[#1a1a1a]/40">Min: {item.minStock}</span>
                      </div>
                      <div className="w-32 h-1.5 bg-[#f8f9fa] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.status === 'In Stock' ? 'bg-emerald-500' : 
                            item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">${item.price.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'Low Stock' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/inventory/adjustment?item=${item.id}`)}
                        className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"
                        title="Adjust Stock"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/inventory/items/edit/${item.id}`)}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors" title="Delete Item">
                        <Trash2 size={16} />
                      </button>
                    </div>
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
