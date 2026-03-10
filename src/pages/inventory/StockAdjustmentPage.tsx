import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Info, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Minus,
  History,
  Boxes
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const items = [
  { id: 'INV-001', name: 'House Red Wine', currentStock: 24, unit: 'Bottles' },
  { id: 'INV-002', name: 'Fresh Salmon', currentStock: 5, unit: 'Portions' },
  { id: 'INV-003', name: 'Bath Towels', currentStock: 150, unit: 'Units' },
];

export default function StockAdjustmentPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');

  const [selectedItem, setSelectedItem] = useState(items.find(i => i.id === itemId) || null);
  const [adjustmentType, setAdjustmentType] = useState<'Add' | 'Remove'>('Add');
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to process adjustment
    navigate('/inventory/history');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Stock Adjustment</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Manually adjust inventory levels for corrections or updates</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/inventory/history')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
        >
          <History size={16} />
          View History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Adjustment Form */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Select Item</label>
                <div className="relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" />
                  <select 
                    className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium appearance-none"
                    value={selectedItem?.id || ''}
                    onChange={(e) => setSelectedItem(items.find(i => i.id === e.target.value) || null)}
                  >
                    <option value="">Search or select an item...</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name} ({item.id})</option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedItem && (
                <div className="bg-[#f8f9fa] p-6 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40">
                      <Boxes size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">{selectedItem.name}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Current Stock: {selectedItem.currentStock} {selectedItem.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest">New Stock</p>
                    <p className="text-lg font-bold text-blue-600">
                      {adjustmentType === 'Add' ? selectedItem.currentStock + quantity : selectedItem.currentStock - quantity} {selectedItem.unit}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Adjustment Type</label>
                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setAdjustmentType('Add')}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        adjustmentType === 'Add' ? 'bg-emerald-600 text-white shadow-md' : 'bg-[#f8f9fa] text-[#1a1a1a]/40 hover:bg-[#f8f9fa]/80'
                      }`}
                    >
                      <Plus size={16} />
                      Stock In
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAdjustmentType('Remove')}
                      className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                        adjustmentType === 'Remove' ? 'bg-blue-600 text-white shadow-md' : 'bg-[#f8f9fa] text-[#1a1a1a]/40 hover:bg-[#f8f9fa]/80'
                      }`}
                    >
                      <Minus size={16} />
                      Stock Out
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Reason for Adjustment</label>
                <select 
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                >
                  <option value="">Select Reason</option>
                  <option value="Restock">Restock / Purchase</option>
                  <option value="Usage">Daily Usage</option>
                  <option value="Damage">Damaged / Expired</option>
                  <option value="Correction">Inventory Correction</option>
                  <option value="Return">Guest Return</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Additional Notes</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium resize-none"
                  placeholder="Optional details about this adjustment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>
            </div>

            <button 
              type="submit"
              disabled={!selectedItem || !reason || quantity <= 0}
              className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg shadow-[#1a1a1a]/10 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Process Adjustment
            </button>
          </form>
        </div>

        {/* Sidebar Help */}
        <div className="space-y-8">
          <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-3 text-blue-800">
              <Info size={20} />
              <h3 className="font-serif font-medium">Adjustment Guide</h3>
            </div>
            <ul className="space-y-3">
              {[
                'Stock In: Use for new purchases or returns.',
                'Stock Out: Use for usage, damage, or loss.',
                'All adjustments are logged for audit purposes.',
                'Stock levels update immediately across all modules.'
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-blue-800/70">
                  <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 flex gap-4 text-amber-800">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              <b>Warning:</b> Manual adjustments bypass the standard procurement workflow. Ensure you have proper authorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
