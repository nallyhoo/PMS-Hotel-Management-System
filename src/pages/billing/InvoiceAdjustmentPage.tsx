import React, { useState } from 'react';
import { 
  ArrowLeft, 
  AlertCircle, 
  Save, 
  Plus, 
  Minus, 
  CheckCircle2,
  Info,
  DollarSign
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function InvoiceAdjustmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [adjustment, setAdjustment] = useState({
    type: 'Credit',
    amount: 0,
    reason: '',
    description: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate(`/billing/details/${id}`);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Invoice Adjustment</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Apply credits or debits to invoice {id}</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSaved && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <p className="text-sm font-medium">Adjustment applied successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <form onSubmit={handleSave} className="p-8 space-y-8">
          {/* Adjustment Type */}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Adjustment Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAdjustment({...adjustment, type: 'Credit'})}
                className={`py-4 rounded-2xl text-sm font-medium transition-all border flex items-center justify-center gap-3 ${
                  adjustment.type === 'Credit' 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                    : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#1a1a1a]/30'
                }`}
              >
                <Minus size={18} />
                Credit (Discount)
              </button>
              <button
                type="button"
                onClick={() => setAdjustment({...adjustment, type: 'Debit'})}
                className={`py-4 rounded-2xl text-sm font-medium transition-all border flex items-center justify-center gap-3 ${
                  adjustment.type === 'Debit' 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#1a1a1a]/30'
                }`}
              >
                <Plus size={18} />
                Debit (Extra Charge)
              </button>
            </div>
          </div>

          {/* Amount & Reason */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                <DollarSign size={12} />
                Adjustment Amount
              </label>
              <input 
                type="number" 
                required
                placeholder="0.00"
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={adjustment.amount || ''}
                onChange={(e) => setAdjustment({...adjustment, amount: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Reason Code</label>
              <select 
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={adjustment.reason}
                onChange={(e) => setAdjustment({...adjustment, reason: e.target.value})}
              >
                <option value="">Select a reason...</option>
                <option>Service Recovery</option>
                <option>Billing Error</option>
                <option>VIP Discount</option>
                <option>Late Check-out</option>
                <option>Damage Fee</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Internal Description</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide details about why this adjustment is being made..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm resize-none"
              value={adjustment.description}
              onChange={(e) => setAdjustment({...adjustment, description: e.target.value})}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 text-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              Adjustments are permanent records and will be reflected on the guest's final folio. A notification will be sent to the accounting department.
            </p>
          </div>

          {/* Submit */}
          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={() => navigate(`/billing/details/${id}`)}
              className="flex-1 py-4 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-[#1a1a1a] text-white py-4 rounded-xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Apply Adjustment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
