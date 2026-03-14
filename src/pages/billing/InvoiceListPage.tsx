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
  Eye,
  Printer,
  Mail,
  Edit2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import billingService from '../../api/billing';
import Pagination from '../../components/Pagination';

export default function InvoiceListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['invoices', statusFilter, page, limit, searchTerm],
    queryFn: () => billingService.getInvoices({ 
      status: statusFilter || undefined,
      page, 
      limit
    }),
  });

  const { data: statsData } = useQuery({
    queryKey: ['invoices', 'stats'],
    queryFn: () => billingService.getInvoices({ limit: 1000 }),
  });

  const invoices = invoicesData?.data || [];
  const pagination = {
    page: invoicesData?.page || 1,
    limit: invoicesData?.limit || 20,
    total: invoicesData?.total || 0,
    totalPages: invoicesData?.totalPages || Math.ceil((invoicesData?.total || 0) / (invoicesData?.limit || 20))
  };

  // Calculate stats from data
  const allInvoices = statsData?.data || [];
  const totalRevenue = allInvoices.reduce((sum: number, inv: any) => sum + (inv.TotalAmount || inv.totalAmount || 0), 0);
  const outstanding = allInvoices
    .filter((inv: any) => inv.Status === 'Pending' || inv.Status === 'Partial')
    .reduce((sum: number, inv: any) => sum + (inv.BalanceDue || inv.balanceDue || 0), 0);
  const today = new Date().toISOString().split('T')[0];
  const paidToday = allInvoices
    .filter((inv: any) => inv.Status === 'Paid' && inv.InvoiceDate?.startsWith(today))
    .reduce((sum: number, inv: any) => sum + (inv.TotalAmount || inv.totalAmount || 0), 0);
  const overdue = allInvoices
    .filter((inv: any) => {
      if (inv.Status === 'Paid' || inv.Status === 'Draft') return false;
      if (!inv.DueDate) return false;
      return new Date(inv.DueDate) < new Date(today);
    })
    .reduce((sum: number, inv: any) => sum + (inv.BalanceDue || inv.balanceDue || 0), 0);

  const filteredInvoices = invoices.filter((inv: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const invoiceNumber = (inv.InvoiceNumber || inv.invoiceNumber || '').toLowerCase();
    const guestName = `${inv.FirstName || inv.firstName || ''} ${inv.LastName || inv.lastName || ''}`.toLowerCase();
    const roomNumber = (inv.ReservationCode || inv.reservationCode || '').toLowerCase();
    return invoiceNumber.includes(search) || guestName.includes(search) || roomNumber.includes(search);
  });

  const getStatusColor = (status: string) => {
    if (status === 'Paid') return 'bg-emerald-50 text-emerald-600';
    if (status === 'Pending') return 'bg-blue-50 text-blue-600';
    if (status === 'Partial') return 'bg-amber-50 text-amber-600';
    if (status === 'Overdue') return 'bg-red-50 text-red-600';
    return 'bg-gray-50 text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]/40 mx-auto" />
        <p className="mt-4 text-[#1a1a1a]/40">Loading invoices...</p>
      </div>
    );
  }

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
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <FileText size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(totalRevenue)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Total Revenue</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(outstanding)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Outstanding</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <AlertCircle size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(overdue)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Overdue</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(paidToday)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Paid Today</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search by invoice ID, guest name, or reservation..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1a1a1a]/60">Show</span>
            <select 
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-3 py-2 text-xs font-medium focus:ring-0"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-xs text-[#1a1a1a]/60">entries</span>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0"
          >
            <option value="">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
            <option value="Draft">Draft</option>
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
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Guest</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Due Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredInvoices.length > 0 ? filteredInvoices.map((invoice: any) => (
                <tr key={invoice.InvoiceID || invoice.invoiceId} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{invoice.InvoiceNumber || `INV-${invoice.InvoiceID}`}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{invoice.FirstName} {invoice.LastName}</span>
                      <span className="text-xs text-[#1a1a1a]/40">{invoice.ReservationCode || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{formatCurrency(invoice.TotalAmount || invoice.totalAmount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(invoice.Status)}`}>
                      {invoice.Status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                    {invoice.InvoiceDate ? new Date(invoice.InvoiceDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                    {invoice.DueDate ? new Date(invoice.DueDate).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/details/${invoice.InvoiceID}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/print/${invoice.InvoiceID}`); }}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="Print"
                      >
                        <Printer size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/billing/email/${invoice.InvoiceID}`); }}
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
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FileText size={32} className="mx-auto text-[#1a1a1a]/20 mb-2" />
                    <p className="text-[#1a1a1a]/40">No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {invoices.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={Math.max(1, pagination.totalPages)}
            total={pagination.total}
            pageSize={limit}
            onPageChange={setPage}
            showPageSize={false}
          />
        )}
      </div>
    </div>
  );
}
