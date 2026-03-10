import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Plus, 
  CheckCircle2,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function EditInvoicePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, description: 'Room Charge - Standard King (4 Nights)', quantity: 4, rate: 250, amount: 1000 },
    { id: 2, description: 'Room Service - Dinner', quantity: 1, rate: 45.5, amount: 45.5 }
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: number, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate(`/billing/details/${id}`);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Edit Invoice {id}</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Modify existing billing details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="px-6 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Save size={16} />
            Update Invoice
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <p className="text-sm font-medium">Invoice updated successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Guest Info (Read-only in Edit) */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <User size={12} />
                  Guest
                </label>
                <div className="px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm font-medium text-[#1a1a1a]/60">
                  Alexander Wright (Room 402)
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <Calendar size={12} />
                  Due Date
                </label>
                <input 
                  type="date" 
                  defaultValue="2024-03-09"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8">
              <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Invoice Items</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-6 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Description</label>}
                      <input 
                        type="text" 
                        placeholder="Item description..."
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-center block">Qty</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm text-center"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      {index === 0 && <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold text-right block">Rate</label>}
                      <input 
                        type="number" 
                        className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm text-right"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-2">
                      <div className="flex-1 text-right text-sm font-medium py-3">
                        ${item.amount.toFixed(2)}
                      </div>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-3 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                type="button"
                onClick={addItem}
                className="mt-6 flex items-center gap-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
              >
                <Plus size={16} />
                Add Another Item
              </button>
            </div>
          </div>
        </div>

        {/* Totals & Summary */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Tax (10%)</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-[#1a1a1a]/5">
                <span className="text-lg font-serif font-medium">Total</span>
                <span className="text-lg font-serif font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              Editing a paid invoice will create an adjustment record in the billing history.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
