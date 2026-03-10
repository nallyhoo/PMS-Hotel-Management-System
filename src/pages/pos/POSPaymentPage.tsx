import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Printer, 
  Mail, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Wifi,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function POSPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [selectedMethod, setSelectedMethod] = useState('Credit Card');

  const handlePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Payment</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Order {id} • Total $107.64</p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {paymentStatus === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Payment Methods */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { name: 'Credit Card', icon: CreditCard },
                { name: 'Cash', icon: DollarSign },
                { name: 'Digital Pay', icon: Smartphone },
              ].map((method) => (
                <button
                  key={method.name}
                  onClick={() => setSelectedMethod(method.name)}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                    selectedMethod === method.name 
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-lg' 
                      : 'border-[#1a1a1a]/5 bg-white text-[#1a1a1a]/40 hover:border-[#1a1a1a]/20'
                  }`}
                >
                  <method.icon size={24} />
                  <span className="text-xs font-bold uppercase tracking-widest">{method.name}</span>
                </button>
              ))}
            </div>

            {/* Card Details (Mock) */}
            {selectedMethod === 'Credit Card' && (
              <div className="bg-white p-8 rounded-3xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Card Information</h3>
                  <div className="flex gap-2">
                    <div className="w-8 h-5 bg-[#f8f9fa] rounded border border-[#1a1a1a]/5"></div>
                    <div className="w-8 h-5 bg-[#f8f9fa] rounded border border-[#1a1a1a]/5"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Card Number</label>
                    <div className="relative">
                      <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" />
                      <input 
                        type="text" 
                        placeholder="**** **** **** 4421"
                        className="w-full pl-12 pr-4 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full px-4 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-semibold">CVV</label>
                      <input 
                        type="password" 
                        placeholder="***"
                        className="w-full px-4 py-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none text-sm font-medium text-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 flex items-center gap-4 text-emerald-800">
              <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
              <p className="text-xs leading-relaxed opacity-80">
                Your payment is secure. We use industry-standard encryption to protect your data.
              </p>
            </div>

            <button 
              onClick={handlePayment}
              className="w-full bg-[#1a1a1a] text-white py-5 rounded-3xl font-bold text-lg hover:bg-[#1a1a1a]/90 transition-all shadow-xl shadow-[#1a1a1a]/20 flex items-center justify-center gap-3"
            >
              Pay $107.64
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {paymentStatus === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="h-[400px] flex flex-col items-center justify-center space-y-6 text-center"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#1a1a1a]/5 border-t-[#1a1a1a] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Wifi size={32} className="text-[#1a1a1a]/20 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-serif font-medium text-[#1a1a1a]">Processing Payment</h3>
              <p className="text-sm text-[#1a1a1a]/40 mt-2">Connecting to secure gateway...</p>
            </div>
          </motion.div>
        )}

        {paymentStatus === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[40px] border border-[#1a1a1a]/5 shadow-2xl space-y-8 text-center"
          >
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-medium text-[#1a1a1a]">Payment Successful!</h3>
              <p className="text-sm text-[#1a1a1a]/40">Transaction ID: TXN-99281-002</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 p-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#1a1a1a]/5 transition-colors text-sm font-medium">
                <Printer size={18} />
                Print Receipt
              </button>
              <button className="flex items-center justify-center gap-2 p-4 bg-[#f8f9fa] rounded-2xl hover:bg-[#1a1a1a]/5 transition-colors text-sm font-medium">
                <Mail size={18} />
                Email Receipt
              </button>
            </div>

            <button 
              onClick={() => navigate('/pos/dashboard')}
              className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg"
            >
              Back to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
