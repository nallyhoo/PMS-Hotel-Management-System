import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  Receipt, 
  CreditCard, 
  Check, 
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Mail,
  Printer,
  Download,
  Plus,
  Minus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockReservations } from '../../data/mockReservations';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'invoice' | 'payment' | 'summary';

interface InvoiceItem {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: 'room' | 'service' | 'tax';
}

export default function CheckoutProcessPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const reservation = mockReservations.find(res => res.id === id) || mockReservations[0];
  const [currentStep, setCurrentStep] = useState<Step>('invoice');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'invoice', label: 'Invoice Review', icon: Receipt },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'summary', label: 'Summary', icon: CheckCircle2 },
  ];

  const [invoiceItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Room Charge (5 Nights)', date: '2026-03-10', amount: 1250, type: 'room' },
    { id: '2', description: 'Minibar - Beverages', date: '2026-03-12', amount: 45, type: 'service' },
    { id: '3', description: 'Laundry Service', date: '2026-03-13', amount: 35, type: 'service' },
    { id: '4', description: 'City Tax', date: '2026-03-15', amount: 25, type: 'tax' },
  ]);

  const subtotal = invoiceItems.reduce((acc, item) => acc + item.amount, 0);
  const total = subtotal; // Simplified for demo

  const handleNext = () => {
    if (currentStep === 'invoice') setCurrentStep('payment');
    else if (currentStep === 'payment') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep('summary');
      }, 2000);
    }
  };

  const handleFinish = () => {
    navigate('/checkout');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
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
            <h1 className="text-2xl font-serif font-light">Check-out Process</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Room {reservation.roomNumber} • {reservation.guestName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                currentStep === step.id ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]/40'
              }`}>
                <step.icon size={14} />
                <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">{step.label}</span>
              </div>
              {idx < steps.length - 1 && <ChevronRight size={14} className="text-[#1a1a1a]/20" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step Content */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 'invoice' && (
              <motion.div 
                key="invoice"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif">Invoice Review</h3>
                    <p className="text-sm text-[#1a1a1a]/60 font-light">Review all charges with the guest before proceeding to payment.</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-[#f8f9fa] transition-colors">
                    <Plus size={14} /> Add Charge
                  </button>
                </div>

                <div className="bg-[#f8f9fa] rounded-2xl overflow-hidden border border-[#1a1a1a]/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1a1a1a]/5">
                      {invoiceItems.map((item) => (
                        <tr key={item.id} className="text-sm">
                          <td className="px-6 py-4 font-medium">{item.description}</td>
                          <td className="px-6 py-4 text-[#1a1a1a]/60">{item.date}</td>
                          <td className="px-6 py-4 text-right font-medium">${item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-[#1a1a1a]/5 font-serif">
                        <td colSpan={2} className="px-6 py-4 text-right">Total Amount Due</td>
                        <td className="px-6 py-4 text-right text-lg">${total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="pt-6 border-t border-[#1a1a1a]/5 flex justify-end gap-4">
                  <button className="flex items-center gap-2 px-6 py-3 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
                    <Printer size={14} /> Print Draft
                  </button>
                  <button 
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Proceed to Payment
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'payment' && (
              <motion.div 
                key="payment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-serif">Payment Collection</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Select payment method and process the final balance of ${total.toFixed(2)}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'cash', label: 'Cash', icon: DollarSign },
                    { id: 'transfer', label: 'Bank Transfer', icon: Globe },
                  ].map((method) => (
                    <button 
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                        paymentMethod === method.id 
                          ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                          : 'border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                      }`}
                    >
                      <method.icon size={24} className={paymentMethod === method.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/20'} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">{method.label}</span>
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="p-8 bg-[#f8f9fa] rounded-2xl border border-[#1a1a1a]/5 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-widest">Card on File</h4>
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold">VISA •••• 4242</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 p-4 bg-white rounded-xl border border-[#1a1a1a]/10 flex items-center justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Authorization Code</span>
                        <span className="text-sm font-mono">#AUTH-9283</span>
                      </div>
                      <button className="px-4 py-4 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium hover:bg-[#f8f9fa] transition-colors">
                        Use Different Card
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-[#1a1a1a]/5 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentStep('invoice')}
                    className="text-xs font-medium uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                  >
                    Back to Invoice
                  </button>
                  <button 
                    disabled={isProcessing}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
                    {!isProcessing && <ArrowRight size={14} />}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'summary' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center space-y-8"
              >
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif">Check-out Complete</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Guest {reservation.guestName} has been successfully checked out from Room {reservation.roomNumber}.</p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-1 gap-4 text-left">
                  <div className="p-6 bg-[#f8f9fa] rounded-2xl space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Invoice Number</span>
                      <span className="text-sm font-medium">#INV-2026-0042</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Payment Status</span>
                      <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold uppercase">Paid in Full</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Room Status</span>
                      <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-bold uppercase">Dirty - Pending HK</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button 
                    onClick={() => setEmailSent(true)}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl text-xs font-medium uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      emailSent ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white border border-[#1a1a1a]/10 hover:bg-[#f8f9fa]'
                    }`}
                  >
                    {emailSent ? <Check size={14} /> : <Mail size={14} />}
                    {emailSent ? 'Receipt Emailed' : 'Email Receipt'}
                  </button>
                  <button className="w-full sm:w-auto px-8 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors flex items-center justify-center gap-2">
                    <Printer size={14} /> Print Receipt
                  </button>
                  <button 
                    onClick={handleFinish}
                    className="w-full sm:w-auto px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Finish
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Summary */}
        <div className="space-y-8">
          <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-[#1a1a1a]/5 space-y-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Stay Details</h4>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{reservation.guestName}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Guest Name</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{reservation.checkIn} - {reservation.checkOut}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Stay Period</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">Room {reservation.roomNumber}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{reservation.roomType}</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#1a1a1a]/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Total Charges</span>
                <span className="text-sm font-medium">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Payments Made</span>
                <span className="text-sm font-medium">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#1a1a1a]/5">
                <span className="text-sm font-serif">Balance Due</span>
                <span className="text-lg font-serif text-red-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg text-amber-600">
              <AlertCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-900">Checkout Note</p>
              <p className="text-[10px] text-amber-700/60 leading-relaxed mt-1">
                Guest mentioned a minor issue with the shower pressure in Room {reservation.roomNumber}. Maintenance notified.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DollarSign({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

function Globe({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
    </svg>
  );
}
