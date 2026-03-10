import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  DollarSign, 
  AlertCircle, 
  CheckCircle2, 
  Save, 
  Info,
  CreditCard,
  User
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function PaymentRefundPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [refundData, setRefundData] = useState({
    amount: 1400.55,
    reason: '',
    method: 'Original Payment Method',
    description: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate(`/payments/details/${id}`);
    }, 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/payments/details/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Issue Refund</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Process a refund for transaction {id}</p>
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
            <p className="text-sm font-medium">Refund processed successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-8 bg-[#f8f9fa] border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#1a1a1a]/5 flex items-center justify-center text-lg font-serif italic">
              AW
            </div>
            <div>
              <p className="text-sm font-medium">Alexander Wright</p>
              <p className="text-xs text-[#1a1a1a]/40">Original Payment: $1,400.55 • Visa **** 4242</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Transaction ID</p>
            <p className="text-sm font-medium">{id}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                <DollarSign size={12} />
                Refund Amount
              </label>
              <input 
                type="number" 
                required
                max={1400.55}
                step="0.01"
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm font-medium"
                value={refundData.amount}
                onChange={(e) => setRefundData({...refundData, amount: parseFloat(e.target.value) || 0})}
              />
              <p className="text-[10px] text-[#1a1a1a]/40">Maximum refundable: $1,400.55</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Refund Reason</label>
              <select 
                required
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={refundData.reason}
                onChange={(e) => setRefundData({...refundData, reason: e.target.value})}
              >
                <option value="">Select a reason...</option>
                <option>Guest Cancellation</option>
                <option>Service Dissatisfaction</option>
                <option>Overcharge Correction</option>
                <option>Duplicate Payment</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Internal Notes</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide details about why this refund is being issued..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm resize-none"
              value={refundData.description}
              onChange={(e) => setRefundData({...refundData, description: e.target.value})}
            />
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-amber-800">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              Refunds to credit cards may take 5-10 business days to appear on the guest's statement. This action cannot be undone.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              type="button"
              onClick={() => navigate(`/payments/details/${id}`)}
              className="flex-1 py-4 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-red-600 text-white py-4 rounded-xl font-medium hover:bg-red-700 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Process Refund
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
