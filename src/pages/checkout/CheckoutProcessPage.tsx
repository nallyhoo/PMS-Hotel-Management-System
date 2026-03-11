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
  Loader2,
  DollarSign,
  Plus,
  Minus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import { format, differenceInDays } from 'date-fns';

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
  const [currentStep, setCurrentStep] = useState<Step>('invoice');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');
  const [roomInspected, setRoomInspected] = useState(false);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [additionalCharges, setAdditionalCharges] = useState(0);
  const [notes, setNotes] = useState('');

  const { data: reservation, isLoading, error } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: !!id,
  });

  const checkoutMutation = useMutation({
    mutationFn: (data: { totalBill: number; paymentStatus: string; roomInspected: boolean; inspectionNotes?: string; notes?: string }) => 
      reservationService.checkOut(Number(id), data),
    onSuccess: () => {
      setCurrentStep('summary');
    },
  });

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'invoice', label: 'Invoice Review', icon: Receipt },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'summary', label: 'Summary', icon: CheckCircle2 },
  ];

  const nights = reservation ? differenceInDays(
    new Date(reservation.checkOutDate || reservation.checkOutDate), 
    new Date(reservation.checkInDate || reservation.checkInDate)
  ) : 0;

  const roomCharge = reservation?.totalAmount || 0;
  const taxes = Math.round(roomCharge * 0.1);
  const subtotal = roomCharge + additionalCharges;
  const total = subtotal + taxes;

  const handleNext = () => {
    if (currentStep === 'invoice') setCurrentStep('payment');
    else if (currentStep === 'payment') {
      checkoutMutation.mutate({
        totalBill: total,
        paymentStatus: 'Paid',
        roomInspected,
        inspectionNotes: inspectionNotes || undefined,
        notes: notes || undefined,
      });
    }
  };

  const canProceed = () => {
    if (currentStep === 'invoice') return true;
    if (currentStep === 'payment') return true;
    return true;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-[#1a1a1a]/40" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load reservation</h3>
        <button 
          onClick={() => navigate('/checkout')}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333]"
        >
          Back to Check-out
        </button>
      </div>
    );
  }

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
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              {reservation.reservationCode} • {reservation.firstName} {reservation.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step.id}>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                currentStep === step.id ? 'bg-[#1a1a1a] text-white' : 
                steps.findIndex(s => s.id === currentStep) > idx ? 'bg-emerald-500 text-white' : 'text-[#1a1a1a]/40'
              }`}>
                {steps.findIndex(s => s.id === currentStep) > idx ? <Check size={14} /> : <step.icon size={14} />}
                <span className="text-[10px] uppercase tracking-widest font-bold hidden sm:block">{step.label}</span>
              </div>
              {idx < steps.length - 1 && <ChevronRight size={14} className="text-[#1a1a1a]/20" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step 1: Invoice Review */}
      {currentStep === 'invoice' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#1a1a1a]/5">
            <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center">
              <Receipt size={24} className="text-[#1a1a1a]/60" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Invoice Review</h2>
              <p className="text-sm text-[#1a1a1a]/60">Review all charges before payment</p>
            </div>
          </div>

          {/* Guest & Stay Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Guest</p>
              <p className="font-medium">{reservation.firstName} {reservation.lastName}</p>
              <p className="text-sm text-[#1a1a1a]/60">{reservation.email}</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Stay Details</p>
              <p className="font-medium">{nights} nights</p>
              <p className="text-sm text-[#1a1a1a]/60">
                Room {reservation.assignedRoomId}
              </p>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
              <span className="text-sm">Room Charge ({nights} nights)</span>
              <span className="font-medium">${roomCharge.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 border border-[#1a1a1a]/10 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[#1a1a1a]/40" />
                <span className="text-sm">Additional Charges</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAdditionalCharges(Math.max(0, additionalCharges - 10))}
                  className="p-1 hover:bg-[#f8f9fa] rounded"
                >
                  <Minus size={14} />
                </button>
                <span className="w-16 text-center font-medium">${additionalCharges.toFixed(2)}</span>
                <button 
                  onClick={() => setAdditionalCharges(additionalCharges + 10)}
                  className="p-1 hover:bg-[#f8f9fa] rounded"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
              <span className="text-sm">Taxes (10%)</span>
              <span className="font-medium">${taxes.toFixed(2)}</span>
            </div>
          </div>

          {/* Room Inspection */}
          <div className="p-4 border border-[#1a1a1a]/10 rounded-xl space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="roomInspected"
                checked={roomInspected}
                onChange={(e) => setRoomInspected(e.target.checked)}
                className="w-5 h-5 rounded border-[#1a1a1a]/20"
              />
              <label htmlFor="roomInspected" className="text-sm font-medium">
                Room has been inspected and is in good condition
              </label>
            </div>
            {roomInspected && (
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm"
                placeholder="Inspection notes (optional)..."
              />
            )}
          </div>

          {/* Total */}
          <div className="p-6 bg-[#1a1a1a] text-white rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount Due</span>
              <span className="text-2xl font-serif">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {currentStep === 'payment' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#1a1a1a]/5">
            <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center">
              <CreditCard size={24} className="text-[#1a1a1a]/60" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Payment</h2>
              <p className="text-sm text-[#1a1a1a]/60">Select payment method and process payment</p>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-4 bg-[#f8f9fa] rounded-xl">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#1a1a1a]/60">Total Amount Due</span>
              <span className="text-xl font-serif font-medium">${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Select Payment Method</p>
            {[
              { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
              { id: 'cash', label: 'Cash', icon: DollarSign },
              { id: 'transfer', label: 'Bank Transfer', icon: ShieldCheck },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`w-full flex items-center gap-4 p-4 border rounded-xl transition-all ${
                  paymentMethod === method.id 
                    ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                    : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                }`}
              >
                <method.icon size={20} className={paymentMethod === method.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40'} />
                <span className="font-medium">{method.label}</span>
                {paymentMethod === method.id && <Check size={18} className="ml-auto text-emerald-600" />}
              </button>
            ))}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Process Payment Button */}
          <button
            onClick={handleNext}
            disabled={checkoutMutation.isPending}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {checkoutMutation.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Complete Payment & Check-out
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 3: Summary */}
      {currentStep === 'summary' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-serif font-light mb-2">Check-out Complete!</h2>
            <p className="text-[#1a1a1a]/60 mb-8">Guest has been successfully checked out</p>
            
            <div className="inline-block p-6 bg-[#f8f9fa] rounded-xl text-left">
              <p className="text-sm text-[#1a1a1a]/60 mb-2">Checkout Details</p>
              <p className="font-medium">{reservation.firstName} {reservation.lastName}</p>
              <p className="text-sm">Room {reservation.assignedRoomId}</p>
              <p className="text-sm">Total Paid: ${total.toFixed(2)}</p>
              <p className="text-sm text-[#1a1a1a]/60">
                {format(new Date(), 'MMM dd, yyyy HH:mm')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (currentStep === 'invoice') navigate('/checkout');
            else if (currentStep === 'payment') setCurrentStep('invoice');
            else navigate('/checkout');
          }}
          className="px-6 py-3 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
        >
          {currentStep === 'summary' ? 'Back to Dashboard' : 'Back'}
        </button>

        {currentStep !== 'summary' && (
          <button
            onClick={handleNext}
            disabled={!canProceed() || checkoutMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === 'payment' ? 'Complete Check-out' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        )}

        {currentStep === 'summary' && (
          <button
            onClick={() => navigate('/checkout')}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333]"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
