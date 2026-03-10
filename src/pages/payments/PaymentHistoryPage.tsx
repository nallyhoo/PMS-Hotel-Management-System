import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

const historyItems = [
  { id: 'H-9901', type: 'Payment', guest: 'Alexander Wright', amount: '+$1,400.55', status: 'Success', date: '2024-03-09', time: '10:15 AM' },
  { id: 'H-9902', type: 'Refund', guest: 'David Kim', amount: '-$3,200.00', status: 'Success', date: '2024-03-09', time: '09:30 AM' },
  { id: 'H-9903', type: 'Payment', guest: 'Elena Rodriguez', amount: '+$850.00', status: 'Pending', date: '2024-03-09', time: '08:45 AM' },
  { id: 'H-9904', type: 'Chargeback', guest: 'Marcus Lee', amount: '-$2,100.00', status: 'Disputed', date: '2024-03-08', time: '04:20 PM' },
  { id: 'H-9905', type: 'Payment', guest: 'Sarah Miller', amount: '+$450.00', status: 'Success', date: '2024-03-08', time: '02:15 PM' },
  { id: 'H-9906', type: 'Adjustment', guest: 'Sophia Chen', amount: '+$125.50', status: 'Success', date: '2024-03-08', time: '11:00 AM' },
  { id: 'H-9907', type: 'Payment', guest: 'James Wilson', amount: '+$980.00', status: 'Success', date: '2024-03-07', time: '03:30 PM' },
];

export default function PaymentHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Transaction History</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Audit log of all financial activities</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Download History
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
            <Calendar size={16} />
            Select Range
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Inflow', value: '$142,500', icon: ArrowUpRight, color: 'emerald' },
          { label: 'Total Outflow', value: '$12,240', icon: ArrowDownLeft, color: 'red' },
          { label: 'Net Revenue', value: '$130,260', icon: History, color: 'blue' },
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Types</option>
            <option>Payment</option>
            <option>Refund</option>
            <option>Chargeback</option>
            <option>Adjustment</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Log ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Guest</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date & Time</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {historyItems.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{item.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      item.type === 'Payment' ? 'bg-emerald-50 text-emerald-600' : 
                      item.type === 'Refund' ? 'bg-red-50 text-red-600' : 
                      item.type === 'Chargeback' ? 'bg-amber-50 text-amber-600' : 
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{item.guest}</span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-semibold ${
                    item.amount.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {item.amount}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {item.status === 'Success' ? <CheckCircle2 size={14} className="text-emerald-500" /> : 
                       item.status === 'Pending' ? <Clock size={14} className="text-blue-500" /> : 
                       <AlertCircle size={14} className="text-amber-500" />}
                      <span className="text-sm text-[#1a1a1a]/60">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#1a1a1a]/60">{item.date}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">{item.time}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-sm text-[#1a1a1a]/40">Showing 1 to 7 of 2,450 logs</p>
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
