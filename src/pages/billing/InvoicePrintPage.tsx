import React, { useEffect } from 'react';
import { 
  Printer, 
  ArrowLeft, 
  Download,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function InvoicePrintPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, this might trigger window.print()
    // window.print();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Print Controls (Hidden during actual print) */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm print:hidden">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <span className="text-sm font-medium">Print Preview - {id}</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
              <Download size={16} />
              PDF
            </button>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
            >
              <Printer size={16} />
              Print Now
            </button>
          </div>
        </div>

        {/* Invoice Document */}
        <div className="bg-white p-12 shadow-2xl rounded-sm border border-[#1a1a1a]/5 print:shadow-none print:border-none print:p-0">
          <div className="flex justify-between items-start mb-16">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#1a1a1a] mb-2">GrandView</h1>
              <p className="text-sm text-[#1a1a1a]/60 tracking-widest uppercase">Resort & Spa</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-serif font-medium mb-4">INVOICE</h2>
              <div className="space-y-1 text-sm">
                <p><span className="text-[#1a1a1a]/40">Invoice No:</span> <span className="font-medium">{id}</span></p>
                <p><span className="text-[#1a1a1a]/40">Date:</span> <span className="font-medium">March 9, 2024</span></p>
                <p><span className="text-[#1a1a1a]/40">Due Date:</span> <span className="font-medium">March 9, 2024</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-4">Billed To</h3>
              <div className="space-y-1">
                <p className="font-bold text-[#1a1a1a]">Alexander Wright</p>
                <p className="text-sm text-[#1a1a1a]/60">123 Guest Avenue</p>
                <p className="text-sm text-[#1a1a1a]/60">New York, NY 10001</p>
                <p className="text-sm text-[#1a1a1a]/60">alexander.wright@email.com</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-4">From</h3>
              <div className="space-y-1">
                <p className="font-bold text-[#1a1a1a]">GrandView Resort & Spa</p>
                <p className="text-sm text-[#1a1a1a]/60">123 Luxury Way, Oceanfront</p>
                <p className="text-sm text-[#1a1a1a]/60">Miami, FL 33139</p>
                <p className="text-sm text-[#1a1a1a]/60">billing@grandview.com</p>
              </div>
            </div>
          </div>

          <table className="w-full mb-12 border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1a1a1a] text-left">
                <th className="py-4 text-[10px] uppercase tracking-widest font-bold">Description</th>
                <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-center">Qty</th>
                <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-right">Rate</th>
                <th className="py-4 text-[10px] uppercase tracking-widest font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {[
                { desc: 'Room Charge - Standard King (4 Nights)', qty: 4, rate: '$250.00', amt: '$1,000.00' },
                { desc: 'Room Service - Dinner', qty: 1, rate: '$45.50', amt: '$45.50' },
                { desc: 'Spa Treatment - Swedish Massage', qty: 1, rate: '$120.00', amt: '$120.00' },
                { desc: 'Mini Bar - Snacks & Drinks', qty: 1, rate: '$35.00', amt: '$35.00' },
                { desc: 'Late Check-out Fee', qty: 1, rate: '$50.00', amt: '$50.00' },
              ].map((item, i) => (
                <tr key={i}>
                  <td className="py-4 text-sm">{item.desc}</td>
                  <td className="py-4 text-sm text-center">{item.qty}</td>
                  <td className="py-4 text-sm text-right">{item.rate}</td>
                  <td className="py-4 text-sm font-bold text-right">{item.amt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-full max-w-xs space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Subtotal</span>
                <span className="font-medium">$1,250.50</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Tax (10%)</span>
                <span className="font-medium">$125.05</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-[#1a1a1a]">
                <span className="text-xl font-serif font-bold">Total</span>
                <span className="text-xl font-serif font-bold">$1,400.55</span>
              </div>
            </div>
          </div>

          <div className="border-t border-[#1a1a1a]/5 pt-8">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-4">Terms & Conditions</h3>
            <p className="text-[10px] text-[#1a1a1a]/40 leading-relaxed max-w-2xl">
              1. All payments are due upon receipt of invoice. 2. A late fee of 1.5% per month will be charged on all overdue accounts. 3. Any discrepancies must be reported within 7 days of the invoice date. 4. This is a computer-generated document and does not require a signature.
            </p>
          </div>

          <div className="mt-16 text-center">
            <p className="text-sm font-serif italic text-[#1a1a1a]/60">Thank you for choosing GrandView Resort & Spa</p>
          </div>
        </div>
      </div>
    </div>
  );
}
