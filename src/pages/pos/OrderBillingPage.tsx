import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  CreditCard, 
  DollarSign, 
  User, 
  Utensils, 
  ChevronRight,
  Receipt,
  Plus,
  Trash2,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function OrderBillingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Order Billing</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Review and finalize payment for {id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Bill Summary */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-[#1a1a1a]/5 flex items-center justify-between bg-[#f8f9fa]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] text-white flex items-center justify-center">
                  <Receipt size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium">Invoice Summary</h3>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Table T-12 • Guest: John Doe</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
                <Plus size={16} />
                Split Bill
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'Grilled Salmon', qty: 1, price: 32.00 },
                  { name: 'Caesar Salad', qty: 2, price: 18.00 },
                  { name: 'House Red Wine', qty: 2, price: 12.00 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-[#f8f9fa] flex items-center justify-center text-[10px] font-bold text-[#1a1a1a]/40">{item.qty}x</span>
                      <span className="text-sm font-medium text-[#1a1a1a]">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-semibold text-[#1a1a1a]">${(item.qty * item.price).toFixed(2)}</span>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#1a1a1a]/5 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]/40">Subtotal</span>
                  <span className="font-medium text-[#1a1a1a]">$92.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]/40">Service Charge (10%)</span>
                  <span className="font-medium text-[#1a1a1a]">$9.20</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]/40">VAT (7%)</span>
                  <span className="font-medium text-[#1a1a1a]">$6.44</span>
                </div>
                <div className="flex justify-between text-xl font-serif font-bold pt-4 border-t border-[#1a1a1a]/5 text-[#1a1a1a]">
                  <span>Grand Total</span>
                  <span>$107.64</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex gap-4 text-blue-800">
            <Info size={20} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Guest Loyalty Program</h4>
              <p className="text-xs leading-relaxed opacity-80">
                John Doe is a Gold Member. You can apply a 10% discount to this bill.
              </p>
              <button className="text-xs font-bold uppercase tracking-widest mt-2 hover:underline">Apply Discount</button>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-8">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 text-white space-y-8">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Payment Method</h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <CreditCard size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium">Credit Card</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium">Cash</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors border border-white/5 group">
                <div className="flex items-center gap-3">
                  <User size={20} className="text-white/40 group-hover:text-white transition-colors" />
                  <span className="text-sm font-medium">Charge to Room</span>
                </div>
                <ChevronRight size={16} className="text-white/20" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/pos/payment/${id}`)}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            Proceed to Payment
            <ChevronRight size={18} />
          </button>
          
          <button className="w-full bg-white border border-[#1a1a1a]/10 text-[#1a1a1a] py-4 rounded-2xl font-medium hover:bg-[#f8f9fa] transition-all flex items-center justify-center gap-2">
            <Printer size={18} />
            Print Pro-forma
          </button>
        </div>
      </div>
    </div>
  );
}
