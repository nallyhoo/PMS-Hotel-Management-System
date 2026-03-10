import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  History, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  User,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const transactions = [
  { id: 'TRX-1001', date: 'Mar 09, 2026 10:30 AM', item: 'House Red Wine', type: 'In', qty: 24, reason: 'Restock', user: 'Sarah M.', notes: 'Monthly purchase from Global Foods' },
  { id: 'TRX-1002', date: 'Mar 09, 2026 11:45 AM', item: 'Fresh Salmon', type: 'Out', qty: 12, reason: 'Usage', user: 'Chef Marco', notes: 'Lunch service preparation' },
  { id: 'TRX-1003', date: 'Mar 08, 2026 02:15 PM', item: 'Bath Towels', type: 'In', qty: 50, reason: 'Restock', user: 'James L.', notes: 'New delivery from Linen Co.' },
  { id: 'TRX-1004', date: 'Mar 08, 2026 04:00 PM', item: 'Toiletries Kit', type: 'Out', qty: 30, reason: 'Usage', user: 'Housekeeping', notes: 'Daily room replenishment' },
  { id: 'TRX-1005', date: 'Mar 07, 2026 09:00 AM', item: 'Cleaning Liquid', type: 'Out', qty: 2, reason: 'Damage', user: 'Housekeeping', notes: 'Bottle leaked in storage' },
  { id: 'TRX-1006', date: 'Mar 07, 2026 01:30 PM', item: 'Coffee Beans', type: 'Out', qty: 5, reason: 'Usage', user: 'Barista Elena', notes: 'Refilling main bar stock' },
];

export default function InventoryTransactionHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(trx => 
    trx.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/inventory/dashboard')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Transaction History</h1>
            <p className="text-[#1a1a1a]/60 mt-1 text-sm">Audit trail of all inventory movements</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-3xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" />
            <input 
              type="text" 
              placeholder="Search by Item or Transaction ID..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1a1a1a]/5 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Calendar size={16} />
            Date Range
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Filter size={16} />
            Filter Type
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date & Time</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Transaction ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Item</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Type</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Qty</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Reason</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">User</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{trx.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{trx.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-[#1a1a1a]/20" />
                      <span className="text-sm font-medium text-[#1a1a1a]">{trx.item}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {trx.type === 'In' ? (
                        <ArrowUpRight size={14} className="text-emerald-500" />
                      ) : (
                        <ArrowDownRight size={14} className="text-blue-500" />
                      )}
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        trx.type === 'In' ? 'text-emerald-600' : 'text-blue-600'
                      }`}>
                        {trx.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${
                      trx.type === 'In' ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {trx.type === 'In' ? '+' : '-'}{trx.qty}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#1a1a1a]/60">{trx.reason}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-[#1a1a1a]/20" />
                      <span className="text-sm text-[#1a1a1a]/60">{trx.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-xs text-[#1a1a1a]/40 truncate" title={trx.notes}>{trx.notes}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
