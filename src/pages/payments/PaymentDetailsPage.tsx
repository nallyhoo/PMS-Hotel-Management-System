import React from 'react';
import { 
  ArrowLeft, 
  CreditCard, 
  Calendar, 
  User, 
  CheckCircle2, 
  Download, 
  Printer,
  History,
  AlertCircle,
  RotateCcw,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function PaymentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/payments/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Payment {id || 'PAY-8821'}</h1>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Completed</span>
            </div>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Processed on March 9, 2024 at 10:15 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10">
            <Download size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10">
            <Printer size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button 
            onClick={() => navigate(`/payments/refund/${id}`)}
            className="flex items-center gap-2 px-6 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-all"
          >
            <RotateCcw size={16} />
            Issue Refund
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Payment Summary */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Amount Paid</p>
                  <p className="text-4xl font-serif font-medium text-[#1a1a1a]">$1,400.55</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-[#1a1a1a]/5">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Payment Method</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#f8f9fa] border border-[#1a1a1a]/5 flex items-center justify-center">
                      <CreditCard size={20} className="text-[#1a1a1a]/60" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#1a1a1a]">Visa Card</p>
                      <p className="text-xs text-[#1a1a1a]/40">Ending in 4242</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Transaction Info</h3>
                  <div className="space-y-1">
                    <p className="text-sm text-[#1a1a1a]/60 flex items-center justify-between">
                      <span>Network ID:</span>
                      <span className="font-medium text-[#1a1a1a]">ch_3O9kX2L2e</span>
                    </p>
                    <p className="text-sm text-[#1a1a1a]/60 flex items-center justify-between">
                      <span>Auth Code:</span>
                      <span className="font-medium text-[#1a1a1a]">882104</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Associated Invoice */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8">
            <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
              <History size={20} className="text-[#1a1a1a]/40" />
              Associated Invoice
            </h3>
            <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Download size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium">Invoice INV-2024-001</p>
                  <p className="text-xs text-[#1a1a1a]/40">Alexander Wright • Room 402</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/billing/details/INV-2024-001')}
                className="text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] flex items-center gap-1 transition-colors"
              >
                View Invoice
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Security & Verification */}
          <div className="bg-emerald-900 rounded-2xl p-6 text-white space-y-6 shadow-lg shadow-emerald-900/20">
            <div className="flex items-center gap-3">
              <ShieldCheck size={24} className="text-emerald-400" />
              <h3 className="text-sm font-semibold uppercase tracking-widest">Verified Payment</h3>
            </div>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              This transaction was processed through our secure gateway and verified with 3D Secure authentication.
            </p>
            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-100/40">Risk Level</span>
                <span className="font-medium text-emerald-400">Low</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-100/40">CVC Check</span>
                <span className="font-medium text-emerald-400">Passed</span>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Guest Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center text-lg font-serif italic border border-[#1a1a1a]/5">
                  AW
                </div>
                <div>
                  <p className="text-sm font-medium">Alexander Wright</p>
                  <p className="text-xs text-[#1a1a1a]/40">alexander.wright@email.com</p>
                </div>
              </div>
              <div className="pt-4 border-t border-[#1a1a1a]/5 space-y-2">
                <p className="text-xs text-[#1a1a1a]/40">Billing Address</p>
                <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                  123 Guest Avenue<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
