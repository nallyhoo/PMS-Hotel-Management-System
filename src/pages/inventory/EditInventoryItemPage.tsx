import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  X, 
  Info, 
  Boxes, 
  Truck, 
  Layers,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditInventoryItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: 'House Red Wine',
    category: 'Beverage',
    sku: 'BEV-RW-001',
    unit: 'Bottles',
    minStock: 12,
    unitPrice: 12.50,
    supplier: 'Global Foods Inc.',
    location: 'Main Cellar, Shelf B',
    description: 'Premium house red wine for restaurant and room service.'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update item
    navigate('/inventory/items');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/inventory/items')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Edit Inventory Item</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Updating details for {id}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-[#1a1a1a]/5 pb-4">
                <Info size={20} className="text-blue-600" />
                <h3 className="font-serif text-lg font-medium">Basic Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Category</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Food">Food</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Housekeeping">Housekeeping</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">SKU / Code</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Unit of Measure</label>
                  <select 
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <option value="Units">Units</option>
                    <option value="Bottles">Bottles</option>
                    <option value="kg">kg</option>
                    <option value="Liters">Liters</option>
                    <option value="Kits">Kits</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Description</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
              <div className="flex items-center gap-3 border-b border-[#1a1a1a]/5 pb-4">
                <Layers size={20} className="text-emerald-600" />
                <h3 className="font-serif text-lg font-medium">Stock & Pricing</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Min Stock Alert</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Unit Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white space-y-8">
              <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Supplier & Location</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-white/40 flex items-center gap-2">
                    <Truck size={12} />
                    Primary Supplier
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/10 outline-none text-sm font-medium text-white"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-white/40 flex items-center gap-2">
                    <Boxes size={12} />
                    Storage Location
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-white/10 outline-none text-sm font-medium text-white"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                type="submit"
                className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg shadow-[#1a1a1a]/10 flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Update Item
              </button>
              <button 
                type="button"
                onClick={() => navigate('/inventory/items')}
                className="w-full bg-white border border-[#1a1a1a]/10 text-[#1a1a1a] py-4 rounded-2xl font-medium hover:bg-[#f8f9fa] transition-all flex items-center justify-center gap-2"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
