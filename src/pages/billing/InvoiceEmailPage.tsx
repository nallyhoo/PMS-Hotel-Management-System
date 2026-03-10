import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Mail, 
  User, 
  CheckCircle2, 
  X,
  Paperclip,
  Eye
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function InvoiceEmailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSent, setIsSent] = useState(false);
  const [emailData, setEmailData] = useState({
    to: 'alexander.wright@email.com',
    cc: '',
    subject: `Invoice ${id} from GrandView Resort & Spa`,
    message: `Dear Alexander Wright,\n\nPlease find attached your invoice ${id} for your recent stay at GrandView Resort & Spa.\n\nThank you for choosing us.\n\nBest regards,\nGrandView Billing Team`
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      navigate(`/billing/details/${id}`);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/billing/details/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Email Invoice</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Send invoice {id} to guest via email</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSent && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800 shadow-sm"
          >
            <CheckCircle2 size={20} className="text-emerald-600" />
            <p className="text-sm font-medium">Invoice sent successfully!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSend} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 border-b border-[#1a1a1a]/5 pb-4">
                  <span className="text-xs font-semibold text-[#1a1a1a]/40 uppercase tracking-widest w-12">To</span>
                  <input 
                    type="email" 
                    required
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                    value={emailData.to}
                    onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4 border-b border-[#1a1a1a]/5 pb-4">
                  <span className="text-xs font-semibold text-[#1a1a1a]/40 uppercase tracking-widest w-12">CC</span>
                  <input 
                    type="email" 
                    placeholder="Add CC email..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                    value={emailData.cc}
                    onChange={(e) => setEmailData({...emailData, cc: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4 border-b border-[#1a1a1a]/5 pb-4">
                  <span className="text-xs font-semibold text-[#1a1a1a]/40 uppercase tracking-widest w-12">Subject</span>
                  <input 
                    type="text" 
                    required
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <textarea 
                  required
                  rows={10}
                  className="w-full p-4 bg-[#f8f9fa] border-none rounded-2xl focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all outline-none text-sm resize-none leading-relaxed"
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]/5">
                <div className="flex items-center gap-3 p-2 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 pr-4">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <Paperclip size={16} />
                  </div>
                  <span className="text-xs font-medium text-[#1a1a1a]/60">invoice-{id}.pdf</span>
                  <button type="button" className="text-[#1a1a1a]/20 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
                >
                  <Send size={18} />
                  Send Email
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Guest Info</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center text-lg font-serif italic border border-[#1a1a1a]/5">
                AW
              </div>
              <div>
                <p className="text-sm font-medium">Alexander Wright</p>
                <p className="text-xs text-[#1a1a1a]/40">alexander.wright@email.com</p>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Preview</h3>
            <button 
              onClick={() => navigate(`/billing/print/${id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium"
            >
              <Eye size={18} className="text-white/60" />
              Preview PDF Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
