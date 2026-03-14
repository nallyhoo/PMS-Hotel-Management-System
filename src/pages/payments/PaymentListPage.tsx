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
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import billingService from '../../api/billing';
import Pagination from '../../components/Pagination';

export default function PaymentListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const navigate = useNavigate();

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['payments', statusFilter, page, limit],
    queryFn: () => billingService.getPayments({ 
      status: statusFilter || undefined,
      page, 
      limit
    }),
  });

  const { data: allPayments } = useQuery({
    queryKey: ['payments', 'all'],
    queryFn: () => billingService.getPayments({ limit: 1000 }),
  });

  const payments = paymentsData?.data || [];
  const pagination = {
    page: paymentsData?.page || 1,
    limit: paymentsData?.limit || 20,
    total: paymentsData?.total || 0,
    totalPages: paymentsData?.totalPages || Math.ceil((paymentsData?.total || 0) / (paymentsData?.limit || 20))
  };

  // Calculate stats from data
  const allData = allPayments?.data || [];
  const totalVolume = allData.reduce((sum: number, p: any) => sum + (p.Amount || p.amount || 0), 0);
  const pending = allData
    .filter((p: any) => p.Status === 'Pending')
    .reduce((sum: number, p: any) => sum + (p.Amount || p.amount || 0), 0);
  const refunds = allData
    .filter((p: any) => p.Status === 'Refunded')
    .reduce((sum: number, p: any) => sum + (p.Amount || p.amount || 0), 0);
  const completed = allData.filter((p: any) => p.Status === 'Completed').length;
  const successRate = allData.length > 0 ? ((completed / allData.length) * 100).toFixed(1) : '0';

  const filteredPayments = payments.filter((payment: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    const paymentId = (payment.PaymentID || payment.paymentId || '').toString().toLowerCase();
    const method = (payment.PaymentMethod || payment.paymentMethod || '').toLowerCase();
    const invoiceNumber = (payment.InvoiceNumber || payment.invoiceNumber || '').toLowerCase();
    return paymentId.includes(search) || method.includes(search) || invoiceNumber.includes(search);
  });

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return 'bg-emerald-50 text-emerald-600';
    if (status === 'Pending') return 'bg-blue-50 text-blue-600';
    if (status === 'Failed') return 'bg-red-50 text-red-600';
    if (status === 'Refunded') return 'bg-amber-50 text-amber-600';
    return 'bg-gray-50 text-gray-600';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]/40 mx-auto" />
        <p className="mt-4 text-[#1a1a1a]/40">Loading payments...</p>
      </div>
    );
  }

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
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <ArrowUpRight size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(totalVolume)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Total Volume</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <Clock size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(pending)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Pending</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
            <ArrowDownLeft size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{formatCurrency(refunds)}</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Refunds</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <CheckCircle2 size={20} />
          </div>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{successRate}%</p>
          <p className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">Success Rate</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search by payment ID, method, or invoice..." 
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
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
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
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Invoice</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Method</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Amount</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredPayments.length > 0 ? filteredPayments.map((payment: any) => (
                <tr key={payment.PaymentID} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">PAY-{payment.PaymentID}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{payment.InvoiceNumber || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                      <CreditCard size={14} />
                      {payment.PaymentMethod || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#1a1a1a]">{formatCurrency(payment.Amount || payment.amount)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${getStatusColor(payment.Status)}`}>
                      {payment.Status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">
                      {payment.PaymentDate ? new Date(payment.PaymentDate).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); navigate(`/payments/details/${payment.PaymentID}`); }}
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
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <CreditCard size={32} className="mx-auto text-[#1a1a1a]/20 mb-2" />
                    <p className="text-[#1a1a1a]/40">No payments found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {payments.length > 0 && (
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
