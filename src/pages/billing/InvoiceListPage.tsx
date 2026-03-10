import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreHorizontal, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Printer,
  Mail,
  Edit2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const invoices = [
  { id: 'INV-2024-001', guest: 'Alexander Wright', room: '402', amount: '$1,250.00', status: 'Paid', date: '2024-03-09', dueDate: '2024-03-09' },
  { id: 'INV-2024-002', guest: 'Elena Rodriguez', room: '105', amount: '$850.00', status: 'Pending', date: '2024-03-09', dueDate: '2024-03-12' },
  { id: 'INV-2024-003', guest: 'Marcus Lee', room: '305', amount: '$2,100.00', status: 'Overdue', date: '2024-03-01', dueDate: '2024-03-05' },
  { id: 'INV-2024-004', guest: 'Sarah Miller', room: '215', amount: '$450.00', status: 'Paid', date: '2024-03-08', dueDate: '2024-03-08' },
  { id: 'INV-2024-005', guest: 'David Kim', room: '501', amount: '$3,200.00', status: 'Draft', date: '2024-03-09', dueDate: '2024-03-15' },
  { id: 'INV-2024-006', guest: 'Sophia Chen', room: 'Lobby Bar', amount: '$125.50', status: 'Paid', date: '2024-03-09', dueDate: '2024-03-09' },
  { id: 'INV-2024-007', guest: 'James Wilson', room: '202', amount: '$980.00', status: 'Pending', date: '2024-03-08', dueDate: '2024-03-11' },
];

export default function InvoiceListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Invoices</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Manage guest billing and financial documents</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => navigate('/billing/create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$42,500', icon: FileText, color: 'blue' },
          { label: 'Outstanding', value: '$8,240', icon: Clock, color: 'amber' },
          { label: 'Overdue', value: '$2,100', icon: AlertCircle, color: 'red' },
          { label: 'Paid Today', value: '$3,450', icon: CheckCircle2, color: 'emerald' },
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

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search by invoice ID, guest name, or room..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
            <option>Overdue</option>
            <option>Draft</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Invoice ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Guest / Room</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Due Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{invoice.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{invoice.guest}</span>
                      <span className="text-xs text-[#1a1a1a]/40">Room {invoice.room}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                      invoice.status === 'Pending' ? 'bg-blue-50 text-blue-600' : 
                      invoice.status === 'Overdue' ? 'bg-red-50 text-red-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{invoice.date}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{invoice.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/details/${invoice.id}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/print/${invoice.id}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="Print"
                      >
                        <Printer size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/email/${invoice.id}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="Email"
                      >
                        <Mail size={16} />
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
          <p className="text-sm text-[#1a1a1a]/40">Showing 1 to 7 of 124 invoices</p>
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
