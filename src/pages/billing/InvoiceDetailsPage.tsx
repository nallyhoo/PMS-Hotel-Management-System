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
  History,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import billingService from '../../api/billing';

export default function InvoiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceId = id ? parseInt(id, 10) : null;

  const { data: invoiceData, isLoading } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => billingService.getInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  const { data: paymentsData } = useQuery({
    queryKey: ['payments', 'invoice', invoiceId],
    queryFn: () => billingService.getPayments({ invoiceId, limit: 100 }),
    enabled: !!invoiceId,
  });

  const invoice = invoiceData;
  const items = invoiceData?.items || [];
  const payments = paymentsData?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount || 0);
  };

  const getStatusColor = (status: string) => {
    if (status === 'Paid') return 'bg-emerald-50 text-emerald-600';
    if (status === 'Pending') return 'bg-blue-50 text-blue-600';
    if (status === 'Partial') return 'bg-amber-50 text-amber-600';
    if (status === 'Overdue') return 'bg-red-50 text-red-600';
    return 'bg-gray-50 text-gray-600';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]/40 mx-auto" />
        <p className="mt-4 text-[#1a1a1a]/40">Loading invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#1a1a1a]/40">Invoice not found</p>
        <button 
          onClick={() => navigate('/billing/invoices')}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Back to Invoices
        </button>
      </div>
    );
  }

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
              <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">{invoice.InvoiceNumber || `Invoice #${invoice.InvoiceID}`}</h1>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(invoice.Status)}`}>
                {invoice.Status || 'Pending'}
              </span>
            </div>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">
              Generated on {invoice.InvoiceDate ? new Date(invoice.InvoiceDate).toLocaleDateString() : '-'}
            </p>
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
                    <p className="font-medium text-[#1a1a1a]">{invoice.FirstName} {invoice.LastName}</p>
                    <p className="text-sm text-[#1a1a1a]/60">{invoice.Email || '-'}</p>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest">Reservation</h3>
                  <div className="space-y-1">
                    <p className="font-medium text-[#1a1a1a]">{invoice.ReservationCode || '-'}</p>
                    <p className="text-sm text-[#1a1a1a]/60">
                      Due: {invoice.DueDate ? new Date(invoice.DueDate).toLocaleDateString() : '-'}
                    </p>
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
                    {items.length > 0 ? items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td className="py-4 text-sm text-[#1a1a1a]">
                          <span className="font-medium">{item.ItemType}</span>
                          <p className="text-[#1a1a1a]/60 text-xs">{item.Description}</p>
                        </td>
                        <td className="py-4 text-sm text-[#1a1a1a]/60 text-center">{item.Quantity || 1}</td>
                        <td className="py-4 text-sm text-[#1a1a1a]/60 text-right">{formatCurrency(item.UnitPrice)}</td>
                        <td className="py-4 text-sm font-medium text-[#1a1a1a] text-right">{formatCurrency(item.Amount)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-[#1a1a1a]/40">No items</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end pt-8 border-t border-[#1a1a1a]/5">
                <div className="w-full max-w-xs space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Subtotal</span>
                    <span className="font-medium">{formatCurrency(invoice.SubTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Tax</span>
                    <span className="font-medium">{formatCurrency(invoice.TaxAmount)}</span>
                  </div>
                  {invoice.DiscountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#1a1a1a]/40">Discount</span>
                      <span className="font-medium text-emerald-600">-{formatCurrency(invoice.DiscountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-[#1a1a1a]/5">
                    <span className="text-lg font-serif font-medium">Total</span>
                    <span className="text-lg font-serif font-medium">{formatCurrency(invoice.TotalAmount)}</span>
                  </div>
                  {invoice.AmountPaid > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#1a1a1a]/40">Paid</span>
                      <span className="font-medium text-emerald-600">-{formatCurrency(invoice.AmountPaid)}</span>
                    </div>
                  )}
                  {invoice.BalanceDue > 0 && (
                    <div className="flex justify-between text-sm font-medium">
                      <span>Balance Due</span>
                      <span className="text-red-600">{formatCurrency(invoice.BalanceDue)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {invoice.Notes && (
                <div className="pt-8 border-t border-[#1a1a1a]/5">
                  <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Notes</h3>
                  <p className="text-xs text-[#1a1a1a]/60 leading-relaxed">{invoice.Notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8">
            <h3 className="font-serif text-lg font-medium mb-6 flex items-center gap-2">
              <History size={20} className="text-[#1a1a1a]/40" />
              Payment History
            </h3>
            {payments.length > 0 ? (
              <div className="space-y-4">
                {payments.map((payment: any) => (
                  <div key={payment.PaymentID} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{payment.PaymentMethod || 'Payment'}</p>
                        <p className="text-xs text-[#1a1a1a]/40">
                          {payment.PaymentDate ? new Date(payment.PaymentDate).toLocaleString() : '-'}
                          {payment.ReferenceNumber && ` • ${payment.ReferenceNumber}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(payment.Amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#1a1a1a]/40">No payments yet</p>
            )}
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
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(invoice.Status)}`}>
                  {invoice.Status || 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Total Amount</span>
                <span className="text-sm font-medium">{formatCurrency(invoice.TotalAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Amount Paid</span>
                <span className="text-sm font-medium text-emerald-600">{formatCurrency(invoice.AmountPaid || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 font-medium">Balance Due</span>
                <span className="text-sm font-medium text-red-600">{formatCurrency(invoice.BalanceDue || 0)}</span>
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Guest Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center text-lg font-serif italic border border-[#1a1a1a]/5">
                  {(invoice.FirstName || '')[0]}{(invoice.LastName || '')[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{invoice.FirstName} {invoice.LastName}</p>
                  <p className="text-xs text-[#1a1a1a]/40">Guest</p>
                </div>
              </div>
              {invoice.Email && (
                <button className="w-full text-xs font-semibold text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors py-2 border-t border-[#1a1a1a]/5 mt-2">
                  View Guest Profile
                </button>
              )}
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
            {invoice.BalanceDue > 0 && (
              <button 
                onClick={() => navigate(`/payments/record?invoiceId=${id}`)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium"
              >
                <Plus size={18} className="text-white/60" />
                Record Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
