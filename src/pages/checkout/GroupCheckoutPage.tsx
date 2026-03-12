import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ChevronRight,
  User,
  CreditCard,
  Receipt,
  LogOut,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import roomService from '../../api/rooms';
import keyCardService from '../../api/keycards';
import { format, parseISO, differenceInDays } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

interface ProcessingGuest {
  reservationId: number;
  guestName: string;
  roomNumber?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export default function GroupCheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const [selectedDate, setSelectedDate] = useState(today);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuests, setSelectedGuests] = useState<Set<number>>(new Set());
  const [processingGuests, setProcessingGuests] = useState<Map<number, ProcessingGuest>>(new Map());
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'transfer'>('card');

  const { data: reservationsData, isLoading, refetch } = useQuery({
    queryKey: ['reservations', 'departures', selectedDate],
    queryFn: () => reservationService.getReservations({ 
      limit: 100 
    }),
  });

  const reservations = reservationsData?.data || [];
  
  const checkedInReservations = reservations.filter((res: any) => 
    res.status === 'Checked In' &&
    (res.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalSelected = processingGuests.size;
  const completedCount = Array.from(processingGuests.values()).filter(g => g.status === 'completed').length;

  const toggleGuest = (reservationId: number) => {
    const newSelected = new Set(selectedGuests);
    if (newSelected.has(reservationId)) {
      newSelected.delete(reservationId);
      setProcessingGuests(prev => {
        const newMap = new Map(prev);
        newMap.delete(reservationId);
        return newMap;
      });
    } else {
      newSelected.add(reservationId);
    }
    setSelectedGuests(newSelected);
  };

  const selectAll = () => {
    const allIds = new Set(checkedInReservations.map((r: any) => r.reservationId));
    setSelectedGuests(allIds);
  };

  const deselectAll = () => {
    setSelectedGuests(new Set());
    setProcessingGuests(new Map());
  };

  const checkOutMutation = useMutation({
    mutationFn: async ({ reservationId, totalBill }: { reservationId: number; totalBill: number }) => {
      await reservationService.checkOut(reservationId, {
        totalBill,
        paymentStatus: 'Paid',
        roomInspected: true,
      });
    },
  });

  const processGroupCheckout = async () => {
    setShowConfirmation(false);
    
    const newProcessing = new Map<number, ProcessingGuest>();
    selectedGuests.forEach(id => {
      const res = checkedInReservations.find((r: any) => r.reservationId === id);
      newProcessing.set(id, {
        reservationId: id,
        guestName: res ? `${res.firstName} ${res.lastName}` : `Reservation #${id}`,
        roomNumber: res?.assignedRoomId ? `Room ${res.assignedRoomId}` : undefined,
        status: 'pending',
      });
    });
    setProcessingGuests(newProcessing);

    for (const reservationId of selectedGuests) {
      const res = checkedInReservations.find((r: any) => r.reservationId === reservationId);
      
      setProcessingGuests(prev => {
        const newMap = new Map(prev);
        const guest = newMap.get(reservationId);
        if (guest) {
          newMap.set(reservationId, { ...guest, status: 'processing' });
        }
        return newMap;
      });

      try {
        // Calculate total (simplified - use actual invoice data in production)
        const nights = res ? differenceInDays(
          new Date(res.checkOutDate), 
          new Date(res.checkInDate)
        ) : 1;
        const totalBill = (res?.totalAmount || 0);

        await checkOutMutation.mutateAsync({ 
          reservationId,
          totalBill,
        });
        
        // Return key card if exists
        try {
          const keyCards = await keyCardService.getKeyCardsByRoom(res.assignedRoomId);
          const activeCard = keyCards.find((kc: any) => kc.status === 'Active');
          if (activeCard) {
            await keyCardService.returnKeyCard(activeCard.keyCardId);
          }
        } catch (e) {
          // Ignore key card return errors
        }
        
        setProcessingGuests(prev => {
          const newMap = new Map(prev);
          newMap.set(reservationId, {
            reservationId,
            guestName: `${res.firstName} ${res.lastName}`,
            roomNumber: res?.assignedRoomId ? `Room ${res.assignedRoomId}` : 'Checked Out',
            status: 'completed',
          });
          return newMap;
        });
      } catch (error: any) {
        setProcessingGuests(prev => {
          const newMap = new Map(prev);
          newMap.set(reservationId, {
            reservationId,
            guestName: `${res.firstName} ${res.lastName}`,
            status: 'error',
            errorMessage: error.message || 'Checkout failed',
          });
          return newMap;
        });
      }
    }

    queryClient.invalidateQueries({ queryKey: ['reservations'] });
    const finalCompleted = Array.from(processingGuests.values()).filter(g => g.status === 'completed').length;
    toastSuccess(`${finalCompleted} guests checked out successfully`);
  };

  const handleCheckout = () => {
    if (selectedGuests.size === 0) return;
    setShowConfirmation(true);
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
            <h1 className="text-2xl font-serif font-light">Group Check-out</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              Check out multiple guests at once
            </p>
          </div>
        </div>
        
        {totalSelected > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-[#1a1a1a]/60">Progress:</span>{' '}
              <span className="font-medium">{completedCount}/{totalSelected}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Date Picker & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedGuests(new Set());
              setProcessingGuests(new Map());
            }}
            className="pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search guests by name or reservation code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30"
          />
        </div>
        {checkedInReservations.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={selectAll}
              className="px-4 py-2 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors"
            >
              Select All ({checkedInReservations.length})
            </button>
            {selectedGuests.size > 0 && (
              <button
                onClick={deselectAll}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Guest List */}
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
            </div>
          ) : checkedInReservations.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-12 text-center">
              <Users size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Departures Found</h3>
              <p className="text-sm text-[#1a1a1a]/60">
                No checked-in guests for {format(parseISO(selectedDate), 'MMMM d, yyyy')}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
                <p className="text-sm font-medium">
                  {checkedInReservations.length} checked-in guests
                  {selectedGuests.size > 0 && (
                    <span className="ml-2 text-blue-600">({selectedGuests.size} selected)</span>
                  )}
                </p>
              </div>
              <div className="divide-y divide-[#1a1a1a]/5">
                {checkedInReservations.map((res: any) => {
                  const nights = differenceInDays(
                    new Date(res.checkOutDate), 
                    new Date(res.checkInDate)
                  );
                  return (
                    <div 
                      key={res.reservationId}
                      className={`p-4 flex items-center gap-4 transition-colors ${
                        selectedGuests.has(res.reservationId) ? 'bg-blue-50' : 'hover:bg-[#f8f9fa]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGuests.has(res.reservationId)}
                        onChange={() => toggleGuest(res.reservationId)}
                        disabled={processingGuests.has(res.reservationId)}
                        className="w-5 h-5 rounded border-[#1a1a1a]/20"
                      />
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                        {res.firstName ? res.firstName.charAt(0) : 'G'}
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">${res.totalAmount?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
            <h3 className="font-serif text-lg">Check-out Summary</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Date</span>
                <span className="font-medium">{format(parseISO(selectedDate), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Checked-in Guests</span>
                <span className="font-medium">{checkedInReservations.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1a1a1a]/60">Selected</span>
                <span className="font-medium text-blue-600">{selectedGuests.size}</span>
              </div>
            </div>

            <hr className="border-[#1a1a1a]/5" />

            {/* Payment Method */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Payment Method</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Card' },
                  { id: 'cash', label: 'Cash' },
                  { id: 'transfer', label: 'Transfer' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      paymentMethod === method.id 
                        ? 'bg-[#1a1a1a] text-white' 
                        : 'bg-[#f8f9fa] text-[#1a1a1a]/60 hover:bg-[#f0f0f0]'
                    }`}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
            </div>

            {selectedGuests.size > 0 && (
              <button
                onClick={handleCheckout}
                disabled={selectedGuests.size === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <LogOut size={18} />
                Check Out {selectedGuests.size} Guest{selectedGuests.size > 1 ? 's' : ''}
              </button>
            )}
          </div>

          {/* Processing Status */}
          {processingGuests.size > 0 && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-4">
              <h3 className="font-serif text-lg">Processing Status</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Array.from(processingGuests.values()).map((guest) => (
                  <div 
                    key={guest.reservationId}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      guest.status === 'completed' ? 'bg-emerald-50' :
                      guest.status === 'error' ? 'bg-red-50' :
                      guest.status === 'processing' ? 'bg-blue-50' :
                      'bg-[#f8f9fa]'
                    }`}
                  >
                    {guest.status === 'completed' && <CheckCircle2 size={18} className="text-emerald-600" />}
                    {guest.status === 'processing' && <Loader2 size={18} className="animate-spin text-blue-600" />}
                    {guest.status === 'error' && <AlertCircle size={18} className="text-red-600" />}
                    {guest.status === 'pending' && <Clock size={18} className="text-[#1a1a1a]/40" />}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{guest.guestName}</p>
                      {guest.roomNumber && (
                        <p className="text-[10px] text-[#1a1a1a]/40">{guest.roomNumber}</p>
                      )}
                      {guest.errorMessage && (
                        <p className="text-[10px] text-red-600">{guest.errorMessage}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-serif">Confirm Group Check-out</h3>
              <p className="text-sm text-[#1a1a1a]/60 mt-2">
                Are you sure you want to check out {selectedGuests.size} guest{selectedGuests.size > 1 ? 's' : ''}?
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Array.from(selectedGuests).map(id => {
                const res = checkedInReservations.find((r: any) => r.reservationId === id);
                return (
                  <div key={id} className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl">
                    <User size={16} className="text-[#1a1a1a]/40" />
                    <div>
                      <p className="text-sm font-medium">{res?.firstName} {res?.lastName}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40">Room {res?.assignedRoomId} - ${res?.totalAmount?.toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={processGroupCheckout}
                className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors"
              >
                Confirm Check-out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
