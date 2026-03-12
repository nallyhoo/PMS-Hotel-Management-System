import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  User,
  CreditCard,
  Receipt,
  LogOut,
  Zap,
  Calendar,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import keyCardService from '../../api/keycards';
import { format, differenceInDays } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

export default function ExpressCheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'express-checkout'],
    queryFn: () => reservationService.getReservations({ limit: 100 }),
  });

  const reservations = reservationsData?.data || [];
  
  // Express checkout candidates: checked-in guests with paid deposits
  const expressCandidates = reservations.filter((res: any) => 
    res.status === 'Checked In' &&
    (res.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.assignedRoomId?.toString().includes(searchTerm))
  );

  const checkoutMutation = useMutation({
    mutationFn: async ({ reservationId, totalBill }: { reservationId: number; totalBill: number }) => {
      await reservationService.checkOut(reservationId, {
        totalBill,
        paymentStatus: 'Paid',
        roomInspected: true,
        notes: 'Express checkout',
      });
    },
  });

  const handleExpressCheckout = async () => {
    if (!selectedGuest) return;
    
    setIsProcessing(true);
    try {
      const nights = differenceInDays(
        new Date(selectedGuest.checkOutDate), 
        new Date(selectedGuest.checkInDate)
      );
      const totalBill = selectedGuest.totalAmount || 0;

      await checkoutMutation.mutateAsync({ 
        reservationId: selectedGuest.reservationId,
        totalBill,
      });

      // Return key card if exists
      try {
        const keyCards = await keyCardService.getKeyCardsByRoom(selectedGuest.assignedRoomId);
        const activeCard = keyCards.find((kc: any) => kc.status === 'Active');
        if (activeCard) {
          await keyCardService.returnKeyCard(activeCard.keyCardId);
        }
      } catch (e) {
        // Ignore key card errors
      }

      toastSuccess(`Express checkout complete for ${selectedGuest.firstName} ${selectedGuest.lastName}`);
      setSelectedGuest(null);
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    } catch (error: any) {
      toastError(error.message || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const nights = selectedGuest ? differenceInDays(
    new Date(selectedGuest.checkOutDate), 
    new Date(selectedGuest.checkInDate)
  ) : 0;

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
            <h1 className="text-2xl font-serif font-light">Express Check-out</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Quick checkout for pre-paid reservations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl">
          <Zap size={18} className="text-amber-600" />
          <span className="text-sm text-amber-700 font-medium">Fast checkout mode</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Guest Selection */}
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, reservation code, or room number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
            />
          </div>

          {/* Guest List */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#1a1a1a]/5">
              <p className="text-sm font-medium">
                {expressCandidates.length} guests available for express checkout
              </p>
            </div>
            <div className="divide-y divide-[#1a1a1a]/5 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
                </div>
              ) : expressCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <LogOut size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Guests Found</h3>
                  <p className="text-sm text-[#1a1a1a]/60">
                    No checked-in guests match your search.
                  </p>
                </div>
              ) : (
                expressCandidates.map((res: any) => (
                  <button
                    key={res.reservationId}
                    onClick={() => setSelectedGuest(res)}
                    className={`w-full p-4 flex items-center gap-4 text-left transition-colors ${
                      selectedGuest?.reservationId === res.reservationId 
                        ? 'bg-blue-50' 
                        : 'hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                      {res.firstName ? res.firstName.charAt(0) : 'G'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{res.firstName} {res.lastName}</p>
                      <div className="flex items-center gap-3 text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider">
                        <span>{res.reservationCode}</span>
                        <span>•</span>
                        <span>Room {res.assignedRoomId}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${res.totalAmount?.toFixed(2) || '0.00'}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40">Total</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Checkout Panel */}
        <div className="space-y-4">
          {selectedGuest ? (
            <>
              {/* Guest Info */}
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-[#1a1a1a]/5">
                  <div className="w-12 h-12 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif text-xl">
                    {selectedGuest.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{selectedGuest.firstName} {selectedGuest.lastName}</h3>
                    <p className="text-sm text-[#1a1a1a]/60">{selectedGuest.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-[#f8f9fa] rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Room</p>
                    <p className="font-medium flex items-center gap-2">
                      <MapPin size={14} className="text-[#1a1a1a]/40" />
                      Room {selectedGuest.assignedRoomId}
                    </p>
                  </div>
                  <div className="p-3 bg-[#f8f9fa] rounded-xl">
                    <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Nights</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar size={14} className="text-[#1a1a1a]/40" />
                      {nights} nights
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[10px] uppercase tracking-widest text-blue-600 mb-1">Stay Period</p>
                  <p className="text-sm font-medium text-blue-900">
                    {selectedGuest.checkInDate} → {selectedGuest.checkOutDate}
                  </p>
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
                <h3 className="font-serif text-lg">Invoice Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
                    <span className="text-sm">Room Charge ({nights} nights)</span>
                    <span className="font-medium">${selectedGuest.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-[#f8f9fa] rounded-lg">
                    <span className="text-sm">Taxes & Fees</span>
                    <span className="font-medium">$0.00</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                    <span className="text-sm font-medium text-emerald-700">Deposit Paid</span>
                    <span className="font-medium text-emerald-700">-${selectedGuest.depositAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>

                <div className="p-4 bg-[#1a1a1a] text-white rounded-xl">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Balance Due</span>
                    <span className="text-2xl font-serif">${Math.max(0, (selectedGuest.totalAmount || 0) - (selectedGuest.depositAmount || 0)).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Express Checkout Button */}
              <button
                onClick={handleExpressCheckout}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Complete Express Check-out
                  </>
                )}
              </button>

              {/* Alternative */}
              <button
                onClick={() => navigate(`/checkout/process/${selectedGuest.reservationId}`)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
              >
                <Receipt size={16} />
                View Full Invoice & Checkout
              </button>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-12 text-center">
              <Zap size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Guest</h3>
              <p className="text-sm text-[#1a1a1a]/60">
                Choose a guest from the list to process express checkout.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
