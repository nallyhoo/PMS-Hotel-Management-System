import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const payments = [
  { id: 'PAY-8821', guest: 'Alexander Wright', method: 'Visa **** 4242', amount: '$1,400.55', status: 'Completed', date: '2024-03-09', time: '10:15 AM' },
  { id: 'PAY-8822', guest: 'Elena Rodriguez', method: 'Mastercard **** 5512', amount: '$850.00', status: 'Pending', date: '2024-03-09', time: '11:30 AM' },
  { id: 'PAY-8823', guest: 'Marcus Lee', method: 'Bank Transfer', amount: '$2,100.00', status: 'Failed', date: '2024-03-08', time: '02:45 PM' },
  { id: 'PAY-8824', guest: 'Sarah Miller', method: 'Cash', amount: '$450.00', status: 'Completed', date: '2024-03-08', time: '09:00 AM' },
  { id: 'PAY-8825', guest: 'David Kim', method: 'Amex **** 1008', amount: '$3,200.00', status: 'Refunded', date: '2024-03-07', time: '04:20 PM' },
  { id: 'PAY-8826', guest: 'Sophia Chen', method: 'Visa **** 9921', amount: '$125.50', status: 'Completed', date: '2024-03-07', time: '01:15 PM' },
  { id: 'PAY-8827', guest: 'James Wilson', method: 'Mastercard **** 3304', amount: '$980.00', status: 'Completed', date: '2024-03-06', time: '11:00 AM' },
];

export default function PaymentListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Payments</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Track and manage all financial transactions</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Export CSV
          </button>
          <button 
            onClick={() => navigate('/payments/record')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Volume', value: '$124,500', icon: ArrowUpRight, color: 'blue' },
          { label: 'Pending', value: '$12,240', icon: Clock, color: 'amber' },
          { label: 'Refunds', value: '$3,100', icon: ArrowDownLeft, color: 'red' },
          { label: 'Success Rate', value: '98.2%', icon: CheckCircle2, color: 'emerald' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search by payment ID, guest name, or method..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
            <option>Failed</option>
            <option>Refunded</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Guest</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Method</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date & Time</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{payment.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{payment.guest}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                      <CreditCard size={14} />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{payment.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      payment.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      payment.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 
                      payment.status === 'Failed' ? 'bg-red-50 text-red-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#1a1a1a]/60">{payment.date}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{payment.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/payments/details/${payment.id}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-sm text-[#1a1a1a]/40">Showing 1 to 7 of 482 payments</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] text-white rounded-lg text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f8f9fa] rounded-lg text-sm font-medium">2</button>
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
