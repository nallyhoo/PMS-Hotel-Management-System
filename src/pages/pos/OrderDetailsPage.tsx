import React from 'react';
import { 
  ArrowLeft, 
  Printer, 
  Share2, 
  Clock, 
  Utensils, 
  User, 
  CreditCard, 
  CheckCircle2, 
  MoreVertical,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const orderData = {
  id: 'ORD-8821',
  source: 'Restaurant',
  table: 'T-12',
  guest: 'John Doe',
  server: 'Sarah Miller',
  time: 'Mar 09, 2026 12:45 PM',
  status: 'Completed',
  items: [
    { name: 'Grilled Salmon', quantity: 1, price: 32.00, total: 32.00 },
    { name: 'Caesar Salad', quantity: 2, price: 18.00, total: 36.00 },
    { name: 'House Red Wine', quantity: 2, price: 12.00, total: 24.00 },
  ],
  subtotal: 92.00,
  tax: 9.20,
  total: 101.20,
  paymentStatus: 'Paid',
  paymentMethod: 'Credit Card'
};

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/pos/dashboard')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Order Details</h1>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">{id || orderData.id} • {orderData.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
            <Share2 size={18} />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
            <Printer size={18} />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
            <MoreVertical size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Status Banner */}
          <div className={`p-6 rounded-3xl flex items-center justify-between ${
            orderData.status === 'Completed' ? 'bg-emerald-50 text-emerald-800' : 'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className={orderData.status === 'Completed' ? 'text-emerald-600' : 'text-blue-600'} />
              <div>
                <p className="text-sm font-bold uppercase tracking-widest">{orderData.status}</p>
                <p className="text-xs opacity-70">Order was completed at 1:15 PM</p>
              </div>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest hover:underline">View Timeline</button>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5">
              <h3 className="font-serif text-lg font-medium">Order Items</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa]">
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-center">Qty</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Price</th>
                  <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {orderData.items.map((item, i) => (
                  <tr key={i} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-[#1a1a1a]">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[#1a1a1a]/60">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-[#1a1a1a]/60">${item.price.toFixed(2)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-[#1a1a1a]">${item.total.toFixed(2)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-[#1a1a1a]/5">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm text-[#1a1a1a]/40">Subtotal</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-[#1a1a1a]">${orderData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right text-sm text-[#1a1a1a]/40">Tax (10%)</td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-[#1a1a1a]">${orderData.tax.toFixed(2)}</td>
                </tr>
                <tr className="bg-[#f8f9fa]">
                  <td colSpan={3} className="px-6 py-4 text-right text-sm font-bold text-[#1a1a1a]">Total</td>
                  <td className="px-6 py-4 text-right text-lg font-serif font-bold text-[#1a1a1a]">${orderData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Order Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/40">
                  <Clock size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Ordered At</p>
                  <p className="text-xs font-medium text-[#1a1a1a]">{orderData.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/40">
                  <Utensils size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Source / Table</p>
                  <p className="text-xs font-medium text-[#1a1a1a]">{orderData.source} • {orderData.table}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/40">
                  <User size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Guest / Server</p>
                  <p className="text-xs font-medium text-[#1a1a1a]">{orderData.guest} • {orderData.server}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Payment</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[#1a1a1a]/40" />
                <div>
                  <p className="text-xs font-medium text-[#1a1a1a]">{orderData.paymentMethod}</p>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{orderData.paymentStatus}</p>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/pos/billing/${id || orderData.id}`)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View Bill
              </button>
            </div>
          </div>

          <button className="w-full bg-[#1a1a1a] text-white py-4 rounded-2xl font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-lg shadow-[#1a1a1a]/10 flex items-center justify-center gap-2">
            <Printer size={18} />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
