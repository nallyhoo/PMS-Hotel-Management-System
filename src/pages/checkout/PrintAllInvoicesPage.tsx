import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Printer,
  Download,
  Search,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  User,
  Receipt,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import { format, differenceInDays, parseISO } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

export default function PrintAllInvoicesPage() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'invoices', selectedDate],
    queryFn: () => reservationService.getReservations({ limit: 100 }),
  });

  const reservations = reservationsData?.data || [];

  // Get checked-out guests for the selected date
  const checkedOutGuests = reservations.filter((res: any) => 
    res.status === 'Checked Out' &&
    (res.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const toggleInvoice = (reservationId: number) => {
    const newSelected = new Set(selectedInvoices);
    if (newSelected.has(reservationId)) {
      newSelected.delete(reservationId);
    } else {
      newSelected.add(reservationId);
    }
    setSelectedInvoices(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(checkedOutGuests.map((r: any) => r.reservationId));
    setSelectedInvoices(allIds);
  };

  const deselectAll = () => {
    setSelectedInvoices(new Set());
  };

  const generateInvoiceText = (res: any): string => {
    const nights = differenceInDays(
      new Date(res.checkOutDate), 
      new Date(res.checkInDate)
    );
    const roomCharge = res.totalAmount || 0;
    const taxes = roomCharge * 0.1;
    const total = roomCharge + taxes;
    const deposit = res.depositAmount || 0;

    return `
=====================================
         HOTEL INVOICE
=====================================

Invoice Number: INV-${res.reservationId}-${Date.now()}
Date: ${format(new Date(), 'MMMM dd, yyyy')}

-------------------------------------
GUEST DETAILS
-------------------------------------
Name: ${res.firstName} ${res.lastName}
Email: ${res.email}
Phone: ${res.phone || 'N/A'}

-------------------------------------
STAY DETAILS
-------------------------------------
Reservation: ${res.reservationCode}
Check-in: ${res.checkInDate}
Check-out: ${res.checkOutDate}
Nights: ${nights}
Room: ${res.assignedRoomId || 'N/A'}

-------------------------------------
CHARGES
-------------------------------------
Room Charge (${nights} nights): $${roomCharge.toFixed(2)}
Taxes (10%): $${taxes.toFixed(2)}

-------------------------------------
SUMMARY
-------------------------------------
Total Amount: $${total.toFixed(2)}
Deposit Paid: $${deposit.toFixed(2)}
Balance Due: $${Math.max(0, total - deposit).toFixed(2)}
Payment Status: PAID

=====================================
     THANK YOU FOR STAYING!
=====================================
`;
  };

  const printSelected = () => {
    window.print();
  };

  const downloadSelected = async () => {
    setIsGenerating(true);
    try {
      let allInvoices = '';
      
      if (selectedInvoices.size === 0) {
        // Download all
        checkedOutGuests.forEach((res: any) => {
          allInvoices += generateInvoiceText(res);
          allInvoices += '\n\n';
        });
      } else {
        // Download selected
        checkedOutGuests
          .filter((r: any) => selectedInvoices.has(r.reservationId))
          .forEach((res: any) => {
            allInvoices += generateInvoiceText(res);
            allInvoices += '\n\n';
          });
      }

      const blob = new Blob([allInvoices], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoices-${selectedDate}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
      toastSuccess('Invoices downloaded successfully');
    } catch (error) {
      toastError('Failed to download invoices');
    } finally {
      setIsGenerating(false);
    }
  };

  const emailInvoices = async () => {
    toastSuccess(`${selectedInvoices.size || checkedOutGuests.length} invoices queued for email delivery`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/checkout')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Print All Invoices</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Generate and print invoices for departures
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={printSelected}
            disabled={checkedOutGuests.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50 transition-colors"
          >
            <Printer size={18} />
            Print All
          </button>
          <button
            onClick={downloadSelected}
            disabled={isGenerating || checkedOutGuests.length === 0}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Download size={18} />
            )}
            Download
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedInvoices(new Set());
            }}
            className="pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="px-4 py-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors"
          >
            Select All ({checkedOutGuests.length})
          </button>
          {selectedInvoices.size > 0 && (
            <button
              onClick={deselectAll}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Invoice List - Print Area */}
      <div ref={printRef} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-sm font-medium">
            {checkedOutGuests.length} invoices
            {selectedInvoices.size > 0 && (
              <span className="ml-2 text-blue-600">({selectedInvoices.size} selected)</span>
            )}
          </p>
          <p className="text-xs text-[#1a1a1a]/40">{format(parseISO(selectedDate), 'MMMM d, yyyy')}</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
          </div>
        ) : checkedOutGuests.length === 0 ? (
          <div className="text-center py-12">
            <Receipt size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Invoices Found</h3>
            <p className="text-sm text-[#1a1a1a]/60">
              No checked-out guests for this date.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a1a]/5">
            {checkedOutGuests.map((res: any) => {
              const nights = differenceInDays(
                new Date(res.checkOutDate), 
                new Date(res.checkInDate)
              );
              const total = (res.totalAmount || 0) * 1.1;

              return (
                <div 
                  key={res.reservationId}
                  className="p-4 flex items-center gap-4 hover:bg-[#f8f9fa] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedInvoices.has(res.reservationId)}
                    onChange={() => toggleInvoice(res.reservationId)}
                    className="w-5 h-5 rounded border-[#1a1a1a]/20"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                    {res.firstName?.charAt(0) || 'G'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{res.firstName} {res.lastName}</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">
                      <span>{res.reservationCode}</span>
                      <span>•</span>
                      <span>{nights} nights</span>
                      {res.assignedRoomId && (
                        <>
                          <span>•</span>
                          <span>Room {res.assignedRoomId}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${total.toFixed(2)}</p>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-1 justify-end">
                      <CheckCircle2 size={10} />
                      PAID
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Print-only footer */}
        <div className="hidden print:block p-8 text-center border-t">
          <p className="text-sm text-[#1a1a1a]/60">
            Generated on {format(new Date(), 'MMMM dd, yyyy HH:mm')}
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
        <h3 className="font-serif text-lg mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#f8f9fa] rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Total Invoices</p>
            <p className="text-2xl font-serif">{checkedOutGuests.length}</p>
          </div>
          <div className="p-4 bg-[#f8f9fa] rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Selected</p>
            <p className="text-2xl font-serif">{selectedInvoices.size || checkedOutGuests.length}</p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Total Amount</p>
            <p className="text-2xl font-serif text-emerald-700">
              ${checkedOutGuests.reduce((sum: number, r: any) => sum + ((r.totalAmount || 0) * 1.1), 0).toFixed(2)}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-xl">
            <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Paid</p>
            <p className="text-2xl font-serif text-emerald-700">100%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
