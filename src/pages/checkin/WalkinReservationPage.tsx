import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft,
  Search,
  User,
  Home,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Plus,
  X,
  Calendar,
  Users,
  Bed,
  Phone,
  Mail,
  MapPin,
  Loader2,
  AlertCircle,
  Key,
  Receipt,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays, differenceInDays, parseISO } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import guestService from '../../api/guests';
import reservationService from '../../api/reservations';
import roomService from '../../api/rooms';

type Step = 'guest' | 'room' | 'payment' | 'confirmation';

interface Guest {
  guestId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  nationality?: string;
  dateOfBirth?: string;
  idType?: string;
  idNumber?: string;
}

interface AvailableRoom {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  typeName: string;
  floorNumber: number;
  basePrice: number;
  capacity: number;
  amenities?: string[];
}

export default function WalkinReservationPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>('guest');
  const [guestSearch, setGuestSearch] = useState('');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [isNewGuest, setIsNewGuest] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash');
  const [depositPaid, setDepositPaid] = useState(true);
  const [keyCardNumber, setKeyCardNumber] = useState('');
  
  const [guestData, setGuestData] = useState<Guest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });

  const [stayData, setStayData] = useState({
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    adults: 1,
    children: 0,
    notes: '',
  });

  const [paymentData, setPaymentData] = useState({
    roomRate: 0,
    discount: 0,
    subtotal: 0,
    taxes: 0,
    total: 0,
    depositAmount: 0,
    depositPaid: true,
  });

  const { data: guestsData, isLoading: loadingGuests } = useQuery({
    queryKey: ['guests', guestSearch],
    queryFn: () => guestService.getGuests({ search: guestSearch, limit: 10 }),
    enabled: guestSearch.length > 0 && !isNewGuest,
  });

  const { data: availableRooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['availableRooms', stayData.checkIn, stayData.checkOut],
    queryFn: () => roomService.checkAvailability({
      checkIn: stayData.checkIn,
      checkOut: stayData.checkOut,
    }),
    enabled: !!stayData.checkIn && !!stayData.checkOut,
  });

  const roomsList: AvailableRoom[] = useMemo(() => {
    if (!availableRooms) return [];
    return availableRooms.map((r: any) => ({
      roomId: r.roomId || r.RoomID,
      roomNumber: r.roomNumber || r.RoomNumber,
      roomTypeId: r.roomTypeId || r.RoomTypeID,
      typeName: r.typeName || r.TypeName || r.roomTypeName,
      floorNumber: r.floorNumber || r.FloorNumber || 1,
      basePrice: r.basePrice || r.BasePrice || 100,
      capacity: r.capacity || r.Capacity || 2,
    }));
  }, [availableRooms]);

  const nights = differenceInDays(parseISO(stayData.checkOut), parseISO(stayData.checkIn));
  const effectiveNights = nights > 0 ? nights : 1;

  const calculatePayment = (room: AvailableRoom) => {
    const subtotal = room.basePrice * effectiveNights;
    const taxes = Math.round(subtotal * 0.1);
    const total = subtotal + taxes;
    const deposit = Math.round(total * 0.5);
    return { subtotal, taxes, total, deposit };
  };

  useMemo(() => {
    if (selectedRoom) {
      const { subtotal, taxes, total, deposit } = calculatePayment(selectedRoom);
      setPaymentData(prev => ({ ...prev, roomRate: selectedRoom.basePrice, subtotal, taxes, total, depositAmount: deposit }));
    }
  }, [selectedRoom, effectiveNights]);

  const createGuestMutation = useMutation({
    mutationFn: (data: any) => guestService.createGuest(data),
  });

  const createReservationMutation = useMutation({
    mutationFn: (data: any) => reservationService.createReservation(data),
  });

  const checkInMutation = useMutation({
    mutationFn: ({ reservationId, roomId, keyCardNumber }: { reservationId: number; roomId: number; keyCardNumber?: string }) =>
      reservationService.checkIn(reservationId, { roomId, keyCardNumber }),
  });

  const handleGuestSelect = (guest: any) => {
    setGuestData({
      guestId: guest.guestId,
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email || '',
      phone: guest.phone || '',
      address: guest.address,
      city: guest.city,
      country: guest.country,
    });
    setGuestSearch('');
    setShowGuestDropdown(false);
  };

  const handleCreateGuest = async () => {
    if (!guestData.firstName || !guestData.lastName || !guestData.phone) return;
    
    try {
      const result = await createGuestMutation.mutateAsync(guestData);
      setGuestData({ ...guestData, guestId: result.guestId });
      setIsNewGuest(false);
    } catch (error) {
      console.error('Failed to create guest:', error);
    }
  };

  const handleCompleteReservation = async () => {
    if (!guestData.guestId || !selectedRoom) return;

    try {
      const reservationData = {
        guestId: guestData.guestId,
        branchId: 1,
        checkInDate: stayData.checkIn,
        checkOutDate: stayData.checkOut,
        bookingSource: 'Walk-in',
        adults: stayData.adults,
        children: stayData.children,
        specialRequests: stayData.notes,
        totalAmount: paymentData.total,
        depositAmount: paymentData.depositAmount,
        depositPaid: depositPaid,
        assignedRoomId: selectedRoom.roomId,
      };

      const reservation = await createReservationMutation.mutateAsync(reservationData);

      if (depositPaid && selectedRoom) {
        await checkInMutation.mutateAsync({
          reservationId: reservation.reservationId,
          roomId: selectedRoom.roomId,
          keyCardNumber: keyCardNumber || undefined,
        });
      }

      setStep('confirmation');
    } catch (error) {
      console.error('Failed to complete reservation:', error);
    }
  };

  const steps = [
    { id: 'guest', label: 'Guest', icon: User },
    { id: 'room', label: 'Room', icon: Bed },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'confirmation', label: 'Complete', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  if (step === 'confirmation') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-12 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-emerald-600" />
          </div>
          <h2 className="text-3xl font-serif font-light mb-2">Check-in Complete!</h2>
          <p className="text-[#1a1a1a]/60 mb-8">Guest has been successfully checked in.</p>
          
          <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Guest Name</span>
                <span className="font-medium">{guestData.firstName} {guestData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Room</span>
                <span className="font-medium">{selectedRoom?.roomNumber} - {selectedRoom?.typeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Check-in</span>
                <span className="font-medium">{format(parseISO(stayData.checkIn), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a1a]/60">Check-out</span>
                <span className="font-medium">{format(parseISO(stayData.checkOut), 'MMM dd, yyyy')}</span>
              </div>
              {depositPaid && (
                <div className="flex justify-between text-emerald-600">
                  <span>Deposit Paid</span>
                  <span className="font-medium">${paymentData.depositAmount}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/checkin')}
              className="flex-1 px-6 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f0f0f0]"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate(`/rooms/details/${selectedRoom?.roomId}`)}
              className="flex-1 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333]"
            >
              View Room
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-[#f8f9fa] rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Walk-in Reservation</h1>
          <p className="text-sm text-[#1a1a1a]/60">Process guest check-in without prior booking</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div 
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                idx <= currentStepIndex 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'bg-[#f8f9fa] text-[#1a1a1a]/40'
              }`}
            >
              <s.icon size={16} />
              <span className="text-xs font-medium">{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${idx < currentStepIndex ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]/10'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Guest Selection */}
          {step === 'guest' && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
              <h3 className="text-lg font-serif mb-6">Guest Information</h3>
              
              {!isNewGuest ? (
                <>
                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
                    <input
                      type="text"
                      placeholder="Search existing guest by name or phone..."
                      value={guestSearch}
                      onChange={(e) => {
                        setGuestSearch(e.target.value);
                        setShowGuestDropdown(true);
                      }}
                      onFocus={() => setShowGuestDropdown(true)}
                      className="w-full pl-12 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                    />
                    {showGuestDropdown && guestsData?.data && guestsData.data.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#1a1a1a]/10 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
                        {guestsData.data.map((guest: any) => (
                          <button
                            key={guest.guestId}
                            onClick={() => handleGuestSelect(guest)}
                            className="w-full px-4 py-3 text-left hover:bg-[#f8f9fa] flex items-center gap-3"
                          >
                            <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-xs font-serif">
                              {guest.firstName?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{guest.firstName} {guest.lastName}</p>
                              <p className="text-xs text-[#1a1a1a]/40">{guest.phone}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-[#1a1a1a]/60 mb-3">Or create a new guest profile</p>
                    <button
                      onClick={() => setIsNewGuest(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm hover:bg-[#f8f9fa]"
                    >
                      <Plus size={16} />
                      New Guest
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">First Name *</label>
                      <input
                        type="text"
                        value={guestData.firstName}
                        onChange={(e) => setGuestData({ ...guestData, firstName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Last Name *</label>
                      <input
                        type="text"
                        value={guestData.lastName}
                        onChange={(e) => setGuestData({ ...guestData, lastName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Phone *</label>
                      <input
                        type="tel"
                        value={guestData.phone}
                        onChange={(e) => setGuestData({ ...guestData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Email</label>
                      <input
                        type="email"
                        value={guestData.email}
                        onChange={(e) => setGuestData({ ...guestData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Address</label>
                    <input
                      type="text"
                      value={guestData.address}
                      onChange={(e) => setGuestData({ ...guestData, address: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">City</label>
                      <input
                        type="text"
                        value={guestData.city}
                        onChange={(e) => setGuestData({ ...guestData, city: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Country</label>
                      <input
                        type="text"
                        value={guestData.country}
                        onChange={(e) => setGuestData({ ...guestData, country: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Nationality</label>
                      <input
                        type="text"
                        value={guestData.nationality}
                        onChange={(e) => setGuestData({ ...guestData, nationality: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsNewGuest(false)}
                      className="px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm hover:bg-[#f8f9fa]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateGuest}
                      disabled={!guestData.firstName || !guestData.lastName || !guestData.phone || createGuestMutation.isPending}
                      className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm hover:bg-[#333] disabled:opacity-50"
                    >
                      {createGuestMutation.isPending ? 'Creating...' : 'Create Guest'}
                    </button>
                  </div>
                </div>
              )}

              {guestData.guestId && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <User size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{guestData.firstName} {guestData.lastName}</p>
                      <p className="text-xs text-emerald-600">Guest selected</p>
                    </div>
                    <button 
                      onClick={() => setGuestData({ firstName: '', lastName: '', email: '', phone: '', guestId: undefined })}
                      className="ml-auto p-1 hover:bg-emerald-100 rounded"
                    >
                      <X size={16} className="text-emerald-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Room Selection */}
          {step === 'room' && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
              <h3 className="text-lg font-serif mb-6">Select Available Room</h3>
              
              {/* Stay Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Check-in</label>
                  <input
                    type="date"
                    value={stayData.checkIn}
                    onChange={(e) => setStayData({ ...stayData, checkIn: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Check-out</label>
                  <input
                    type="date"
                    value={stayData.checkOut}
                    onChange={(e) => setStayData({ ...stayData, checkOut: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Adults</label>
                  <select
                    value={stayData.adults}
                    onChange={(e) => setStayData({ ...stayData, adults: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[#1a1a1a]/60 mb-1 block">Children</label>
                  <select
                    value={stayData.children}
                    onChange={(e) => setStayData({ ...stayData, children: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
                  >
                    {[0,1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {loadingRooms ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#1a1a1a]/40" />
                </div>
              ) : roomsList.length === 0 ? (
                <div className="text-center py-12">
                  <Bed size={48} className="mx-auto text-[#1a1a1a]/20 mb-4" />
                  <p className="text-[#1a1a1a]/60">No rooms available for selected dates</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roomsList.map((room) => (
                    <button
                      key={room.roomId}
                      onClick={() => setSelectedRoom(room)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedRoom?.roomId === room.roomId
                          ? 'border-[#1a1a1a] bg-[#1a1a1a]/5'
                          : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-serif text-lg">Room {room.roomNumber}</h4>
                          <p className="text-xs text-[#1a1a1a]/60">{room.typeName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${room.basePrice}</p>
                          <p className="text-xs text-[#1a1a1a]/40">per night</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#1a1a1a]/60">
                        <span className="flex items-center gap-1"><Home size={12} /> Floor {room.floorNumber}</span>
                        <span className="flex items-center gap-1"><Users size={12} /> {room.capacity} guests</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 'payment' && selectedRoom && (
            <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
              <h3 className="text-lg font-serif mb-6">Payment & Deposit</h3>

              {/* Key Card */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <label className="text-xs font-medium text-blue-600 mb-2 block">Key Card Number (Optional)</label>
                <div className="flex gap-2">
                  <Key size={18} className="text-blue-400 mt-2.5" />
                  <input
                    type="text"
                    value={keyCardNumber}
                    onChange={(e) => setKeyCardNumber(e.target.value)}
                    placeholder="Enter key card number"
                    className="flex-1 px-4 py-2.5 bg-white border border-blue-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <label className="text-xs font-medium text-[#1a1a1a]/60 mb-3 block">Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cash', label: 'Cash', icon: DollarSign },
                    { id: 'card', label: 'Card', icon: CreditCard },
                    { id: 'transfer', label: 'Transfer', icon: Receipt },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id as any)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-[#1a1a1a] bg-[#1a1a1a]/5'
                          : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                      }`}
                    >
                      <method.icon size={24} />
                      <span className="text-xs font-medium">{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Deposit Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={depositPaid}
                    onChange={(e) => setDepositPaid(e.target.checked)}
                    className="w-5 h-5 rounded border-[#1a1a1a]/20"
                  />
                  <span className="text-sm">Collect deposit at check-in (${paymentData.depositAmount})</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-medium text-[#1a1a1a]/60 mb-2 block">Special Requests</label>
                <textarea
                  value={stayData.notes}
                  onChange={(e) => setStayData({ ...stayData, notes: e.target.value })}
                  rows={2}
                  placeholder="Any special requests..."
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 sticky top-6">
            <h3 className="text-lg font-serif mb-6">Reservation Summary</h3>

            {/* Guest Summary */}
            {(guestData.firstName || isNewGuest) && (
              <div className="mb-4 pb-4 border-b border-[#1a1a1a]/5">
                <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider mb-2">Guest</p>
                <p className="font-medium">{guestData.firstName} {guestData.lastName}</p>
                <p className="text-xs text-[#1a1a1a]/60">{guestData.phone}</p>
              </div>
            )}

            {/* Room Summary */}
            {selectedRoom && (
              <div className="mb-4 pb-4 border-b border-[#1a1a1a]/5">
                <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider mb-2">Room</p>
                <p className="font-medium">Room {selectedRoom.roomNumber}</p>
                <p className="text-xs text-[#1a1a1a]/60">{selectedRoom.typeName} - Floor {selectedRoom.floorNumber}</p>
              </div>
            )}

            {/* Stay Summary */}
            <div className="mb-4 pb-4 border-b border-[#1a1a1a]/5">
              <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider mb-2">Stay</p>
              <div className="flex justify-between text-sm">
                <span>Check-in</span>
                <span>{format(parseISO(stayData.checkIn), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Check-out</span>
                <span>{format(parseISO(stayData.checkOut), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Nights</span>
                <span>{effectiveNights}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Guests</span>
                <span>{stayData.adults} Adult{stayData.adults > 1 ? 's' : ''}{stayData.children > 0 ? `, ${stayData.children} Child` : ''}</span>
              </div>
            </div>

            {/* Price Summary */}
            {selectedRoom && (
              <div className="space-y-2">
                <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-wider mb-2">Payment Details</p>
                <div className="flex justify-between text-sm">
                  <span>${paymentData.roomRate} x {effectiveNights} night{paymentData.subtotal > paymentData.roomRate ? 's' : ''}</span>
                  <span>${paymentData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes (10%)</span>
                  <span>${paymentData.taxes}</span>
                </div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-[#1a1a1a]/5">
                  <span>Total</span>
                  <span>${paymentData.total}</span>
                </div>
                {depositPaid && (
                  <div className="flex justify-between text-emerald-600 text-sm">
                    <span>Deposit Due</span>
                    <span>${paymentData.depositAmount}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {step === 'guest' && (
                <button
                  onClick={() => setStep('room')}
                  disabled={!guestData.guestId}
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
                >
                  Select Room
                </button>
              )}
              {step === 'room' && (
                <button
                  onClick={() => setStep('payment')}
                  disabled={!selectedRoom}
                  className="w-full px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
                >
                  Continue to Payment
                </button>
              )}
              {step === 'payment' && (
                <button
                  onClick={handleCompleteReservation}
                  disabled={createReservationMutation.isPending || checkInMutation.isPending}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(createReservationMutation.isPending || checkInMutation.isPending) ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      {depositPaid ? 'Check In Guest' : 'Create Reservation'}
                    </>
                  )}
                </button>
              )}
              {step > 'guest' && (
                <button
                  onClick={() => setStep(step === 'payment' ? 'room' : 'guest')}
                  className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f0f0f0]"
                >
                  Back
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
