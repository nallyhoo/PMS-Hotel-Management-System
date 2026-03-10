import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Mail, 
  Download, 
  MoreVertical, 
  CreditCard, 
  Calendar, 
  User, 
  MapPin,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  History
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoiceItems = [
    { description: 'Room Charge - Standard King (4 Nights)', quantity: 4, rate: '$250.00', amount: '$1,000.00' },
    { description: 'Room Service - Dinner', quantity: 1, rate: '$45.50', amount: '$45.50' },
    { description: 'Spa Treatment - Swedish Massage', quantity: 1, rate: '$120.00', amount: '$120.00' },
    { description: 'Mini Bar - Snacks & Drinks', quantity: 1, rate: '$35.00', amount: '$35.00' },
    { description: 'Late Check-out Fee', quantity: 1, rate: '$50.00', amount: '$50.00' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/billing/invoices')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Invoice {id || 'INV-2024-001'}</h1>
              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Paid</span>
            </div>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Generated on March 9, 2024</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/billing/print/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10"
            title="Print"
          >
            <Printer size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button 
            onClick={() => navigate(`/billing/email/${id}`)}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10"
            title="Email"
          >
            <Mail size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10">
            <Download size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button 
            onClick={() => navigate(`/billing/edit/${id}`)}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Edit2 size={16} />
            Edit Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Invoice Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Billing Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Billed To</h3>
                  <div className="space-y-1">
                    <p className="font-medium text-[#1a1a1a]">Alexander Wright</p>
                    <p className="text-sm text-[#1a1a1a]/60">alexander.wright@email.com</p>
                    <p className="text-sm text-[#1a1a1a]/60">+1 (555) 012-3456</p>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">From</h3>
                  <div className="space-y-1">
                    <p className="font-medium text-[#1a1a1a]">GrandView Resort & Spa</p>
                    <p className="text-sm text-[#1a1a1a]/60">123 Luxury Way, Oceanfront</p>
                    <p className="text-sm text-[#1a1a1a]/60">billing@grandview.com</p>
                  </div>
                </div>
              </div>

              {/* Invoice Table */}
              <div className="pt-8 border-t border-[#1a1a1a]/5">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]/5">
                      <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Description</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-center">Qty</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Rate</th>
                      <th className="pb-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]/5">
                    {invoiceItems.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 text-sm text-[#1a1a1a]">{item.description}</td>
                        <td className="py-4 text-sm text-[#1a1a1a]/60 text-center">{item.quantity}</td>
                        <td className="py-4 text-sm text-[#1a1a1a]/60 text-right">{item.rate}</td>
                        <td className="py-4 text-sm font-medium text-[#1a1a1a] text-right">{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-8 border-t border-[#1a1a1a]/5">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Subtotal</span>
                    <span className="font-medium">$1,250.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Tax (10%)</span>
                    <span className="font-medium">$125.05</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Service Charge</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#1a1a1a]/5">
                    <span className="text-lg font-serif font-medium">Total</span>
                    <span className="text-lg font-serif font-medium">$1,400.55</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="pt-8 border-t border-[#1a1a1a]/5">
                <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Notes</h3>
                <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                  Thank you for staying at GrandView Resort. We hope you enjoyed your visit. Please note that any additional charges incurred after this invoice was generated will be billed separately.
                </p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8">
            <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
              <History size={20} className="text-[#1a1a1a]/40" />
              Payment History
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Credit Card Payment (Visa **** 4242)</p>
                    <p className="text-xs text-[#1a1a1a]/40">March 9, 2024 at 10:15 AM</p>
                  </div>
                </div>
                <span className="text-sm font-semibold">$1,400.55</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Info */}
        <div className="space-y-8">
          {/* Status Card */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Payment Status</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Status</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest">Paid</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Payment Method</span>
                <span className="text-sm font-medium flex items-center gap-2">
                  <CreditCard size={14} />
                  Visa Card
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Transaction ID</span>
                <span className="text-sm font-medium">TXN-9823410</span>
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
                  <p className="text-xs text-[#1a1a1a]/40">VIP Guest • 12 Stays</p>
                </div>
              </div>
              <button className="w-full text-xs font-semibold text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors py-2 border-t border-[#1a1a1a]/5 mt-2">View Guest Profile</button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Billing Actions</h3>
            <button 
              onClick={() => navigate(`/billing/adjust/${id}`)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium"
            >
              <AlertCircle size={18} className="text-white/60" />
              Make Adjustment
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium">
              <Plus size={18} className="text-white/60" />
              Add Charge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
