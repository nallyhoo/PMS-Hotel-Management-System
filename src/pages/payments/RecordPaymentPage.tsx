import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  User, 
  Search, 
  CheckCircle2, 
  Save, 
  Plus, 
  Calendar,
  Clock,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function RecordPaymentPage() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [paymentData, setPaymentData] = useState({
    guest: '',
    invoiceId: '',
    amount: 0,
    method: 'Credit Card',
    reference: '',
    notes: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate('/payments/list');
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/payments/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Record Payment</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Manually log a payment received from a guest</p>
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
            <p className="text-sm font-medium">Payment recorded successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Guest & Invoice Selection */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <User size={12} />
                  Guest / Invoice
                </label>
                <div className="relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
                  <input 
                    type="text" 
                    placeholder="Search guest or invoice ID..."
                    className="w-full pl-11 pr-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                    value={paymentData.guest}
                    onChange={(e) => setPaymentData({...paymentData, guest: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 flex items-center gap-2">
                  <DollarSign size={12} />
                  Amount Received
                </label>
                <input 
                  type="number" 
                  required
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                  value={paymentData.amount || ''}
                  onChange={(e) => setPaymentData({...paymentData, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Payment Method</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {['Credit Card', 'Cash', 'Bank Transfer', 'Other'].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentData({...paymentData, method})}
                  className={`py-4 rounded-2xl text-xs font-medium transition-all border flex flex-col items-center justify-center gap-2 ${
                    paymentData.method === method 
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                      : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/60 hover:border-[#1a1a1a]/30'
                  }`}
                >
                  <CreditCard size={18} className={paymentData.method === method ? 'text-white/60' : 'text-[#1a1a1a]/20'} />
                  {method}
                </button>
              ))}
            </div>
            <div className="pt-4 space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Reference Number</label>
              <input 
                type="text" 
                placeholder="Transaction ID, Check #, etc."
                className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                value={paymentData.reference}
                onChange={(e) => setPaymentData({...paymentData, reference: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Date & Time</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Calendar size={12} />
                  Date
                </label>
                <input 
                  type="date" 
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Clock size={12} />
                  Time
                </label>
                <input 
                  type="time" 
                  defaultValue={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-xl flex gap-3 text-blue-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              Recording a payment will update the associated invoice status and guest folio balance.
            </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#1a1a1a] text-white py-4 rounded-xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Record Payment
          </button>
        </div>
      </form>
    </div>
  );
}
