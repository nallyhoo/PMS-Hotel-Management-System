import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Calendar, 
  Bed, 
  CreditCard, 
  Plus, 
  Trash2,
  CheckCircle2,
  Info,
  Search,
  Loader2,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, addDays, differenceInDays } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import guestService from '../../api/guests';
import reservationService from '../../api/reservations';
import roomService from '../../api/rooms';
import type { Guest, RoomType } from '../../types/database';

interface RoomTypeOption {
  id: number;
  name: string;
  price: number;
}

interface AvailableRoom {
  roomId: number;
  roomNumber: string;
  roomTypeId: number;
  typeName: string;
  basePrice: number;
  capacity: number;
  status: string;
}

interface CreateReservationPageProps {
  isEdit?: boolean;
}

export default function CreateReservationPage({ isEdit }: CreateReservationPageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [guestSearch, setGuestSearch] = useState('');
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<AvailableRoom | null>(null);
  const [formData, setFormData] = useState({
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    roomTypeId: 2,
    adults: 2,
    children: 0,
    specialRequests: '',
    bookingSource: 'Direct',
  });

  const { data: existingReservation, isLoading: loadingReservation } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: isEdit && !!id,
  });

  useMemo(() => {
    if (existingReservation) {
      setSelectedGuest({
        guestId: existingReservation.guestId,
        firstName: existingReservation.firstName || '',
        lastName: existingReservation.lastName || '',
        email: existingReservation.email || '',
        phone: existingReservation.phone || '',
      } as Guest);
      setFormData({
        checkIn: existingReservation.checkInDate,
        checkOut: existingReservation.checkOutDate,
        roomTypeId: existingReservation.assignedRoomId || 2,
        adults: existingReservation.adults || 2,
        children: existingReservation.children || 0,
        specialRequests: existingReservation.specialRequests || '',
        bookingSource: existingReservation.bookingSource || 'Direct',
      });
      if (existingReservation.assignedRoomId) {
        setSelectedRoom({
          roomId: existingReservation.assignedRoomId,
          roomNumber: String(existingReservation.assignedRoomId),
          roomTypeId: 1,
          typeName: existingReservation.roomTypeName || 'Standard',
          basePrice: existingReservation.totalAmount || 100,
          capacity: 2,
          status: 'Available',
        });
      }
    }
  }, [existingReservation]);

  const { data: guestsData } = useQuery({
    queryKey: ['guests', guestSearch],
    queryFn: () => guestService.getGuests({ search: guestSearch, limit: 10 }),
    enabled: guestSearch.length > 0,
  });

  const { data: roomTypesData } = useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => reservationService.getRoomTypes(),
  });

  const { data: availableRooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['availableRooms', formData.checkIn, formData.checkOut, formData.roomTypeId],
    queryFn: () => roomService.checkAvailability({
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      roomTypeId: formData.roomTypeId,
      guests: formData.adults + formData.children,
    }),
    enabled: !!formData.checkIn && !!formData.checkOut && formData.checkOut > formData.checkIn,
  });

  const roomTypes: RoomTypeOption[] = useMemo(() => {
    if (!roomTypesData) return [
      { id: 1, name: 'Standard', price: 100 },
      { id: 2, name: 'Deluxe', price: 150 },
      { id: 3, name: 'Suite', price: 250 },
      { id: 4, name: 'Penthouse', price: 500 },
    ];
    return roomTypesData.map((rt: any) => ({
      id: rt.roomTypeId || rt.RoomTypeID,
      name: rt.typeName || rt.TypeName,
      price: rt.basePrice || rt.BasePrice || 100,
    }));
  }, [roomTypesData]);

  const roomsList: AvailableRoom[] = useMemo(() => {
    if (!availableRooms) return [];
    return availableRooms.map((r: any) => ({
      roomId: r.roomId || r.RoomID,
      roomNumber: r.roomNumber || r.RoomNumber,
      roomTypeId: r.roomTypeId || r.RoomTypeID,
      typeName: r.typeName || r.TypeName,
      basePrice: r.basePrice || r.BasePrice || 100,
      capacity: r.capacity || r.Capacity || 2,
      status: r.status || r.Status || 'Available',
    }));
  }, [availableRooms]);

  const selectedRoomType = roomTypes.find(rt => rt.id === formData.roomTypeId) || roomTypes[1];

  const nights = differenceInDays(new Date(formData.checkOut), new Date(formData.checkIn));
  const roomPrice = selectedRoom?.basePrice || selectedRoomType.price;
  const subtotal = roomPrice * (nights > 0 ? nights : 1);
  const serviceFee = Math.round(subtotal * 0.05);
  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + serviceFee + taxes;

  const createMutation = useMutation({
    mutationFn: (data: any) => reservationService.createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      navigate('/reservations/list');
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    setGuestSearch('');
    setShowGuestDropdown(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuest) return;

    createMutation.mutate({
      guestId: selectedGuest.guestId,
      branchId: 1,
      checkInDate: formData.checkIn,
      checkOutDate: formData.checkOut,
      bookingSource: formData.bookingSource,
      adults: formData.adults,
      children: formData.children,
      specialRequests: formData.specialRequests,
      totalAmount: total,
      depositAmount: Math.round(total * 0.2),
      depositPaid: false,
      assignedRoomId: selectedRoom?.roomId,
    });
  };

  const steps = [
    { id: 1, name: 'Guest Information', icon: User },
    { id: 2, name: 'Stay Details', icon: Calendar },
    { id: 3, name: 'Payment & Confirm', icon: CreditCard },
  ];

  const canProceed = () => {
    if (step === 1) return !!selectedGuest;
    if (step === 2) return formData.checkIn && formData.checkOut && nights > 0 && !!selectedRoom;
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/reservations/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">New Reservation</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Create a new booking for a guest.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/reservations/list')}
            className="px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            Discard
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!canProceed() || createMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending && <Loader2 size={14} className="animate-spin" />}
            <Save size={14} />
            Save Reservation
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between items-center px-8">
        {steps.map((s, idx) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= s.id ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' : 'bg-white border-[#1a1a1a]/10 text-[#1a1a1a]/40'
              }`}>
                <s.icon size={18} />
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-semibold ${
                step >= s.id ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40'
              }`}>
                {s.name}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`flex-1 h-px mx-4 ${step > s.id ? 'bg-[#1a1a1a]' : 'bg-[#1a1a1a]/10'}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-serif">Guest Information</h3>
              
              {selectedGuest ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedGuest.firstName} {selectedGuest.lastName}</p>
                      <p className="text-sm text-emerald-600/70">{selectedGuest.email}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedGuest(null)}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Search Existing Guest</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
                    <input 
                      type="text" 
                      value={guestSearch}
                      onChange={(e) => {
                        setGuestSearch(e.target.value);
                        setShowGuestDropdown(true);
                      }}
                      onFocus={() => setShowGuestDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                      placeholder="Search by name, email, or phone..."
                    />
                    {showGuestDropdown && guestsData?.data && guestsData.data.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#1a1a1a]/10 rounded-xl shadow-lg max-h-60 overflow-auto">
                        {guestsData.data.map((guest: Guest) => (
                          <button
                            key={guest.guestId}
                            type="button"
                            onClick={() => handleGuestSelect(guest)}
                            className="w-full px-4 py-3 text-left hover:bg-[#f8f9fa] border-b border-[#1a1a1a]/5 last:border-0"
                          >
                            <p className="font-medium">{guest.firstName} {guest.lastName}</p>
                            <p className="text-sm text-[#1a1a1a]/60">{guest.email} · {guest.phone}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                <Info size={16} />
                <span>Or select an existing guest from the database</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-serif">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Check-in Date</label>
                  <input 
                    type="date" 
                    name="checkIn"
                    value={formData.checkIn}
                    onChange={handleInputChange}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Check-out Date</label>
                  <input 
                    type="date" 
                    name="checkOut"
                    value={formData.checkOut}
                    onChange={handleInputChange}
                    min={formData.checkIn}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Room Type</label>
                  <select 
                    name="roomTypeId"
                    value={formData.roomTypeId}
                    onChange={(e) => {
                      handleInputChange(e);
                      setSelectedRoom(null);
                    }}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  >
                    {roomTypes.map(rt => (
                      <option key={rt.id} value={rt.id}>
                        {rt.name} - ${rt.price}/night
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Room Availability */}
                <div className="col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Select Room</label>
                    {loadingRooms && <Loader2 size={14} className="animate-spin text-[#1a1a1a]/40" />}
                  </div>
                  
                  {roomsList.length > 0 ? (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {roomsList.map(room => (
                        <button
                          key={room.roomId}
                          type="button"
                          onClick={() => setSelectedRoom(room)}
                          className={`p-3 border rounded-xl text-left transition-all ${
                            selectedRoom?.roomId === room.roomId 
                              ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                              : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Room {room.roomNumber}</span>
                            {selectedRoom?.roomId === room.roomId && (
                              <Check size={14} className="text-emerald-600" />
                            )}
                          </div>
                          <p className="text-[10px] text-[#1a1a1a]/40 mt-1">{room.capacity} guests max</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
                      No rooms available for the selected dates and room type. Please try different dates or room type.
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Booking Source</label>
                  <select 
                    name="bookingSource"
                    value={formData.bookingSource}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  >
                    <option value="Direct">Direct Booking</option>
                    <option value="Website">Website</option>
                    <option value="Booking.com">Booking.com</option>
                    <option value="Expedia">Expedia</option>
                    <option value="Phone">Phone</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Adults</label>
                  <input 
                    type="number" 
                    name="adults"
                    min="1"
                    max="10"
                    value={formData.adults}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Children</label>
                  <input 
                    type="number" 
                    name="children"
                    min="0"
                    max="10"
                    value={formData.children}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Special Requests</label>
                <textarea 
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  placeholder="e.g. Late check-in, dietary restrictions..."
                ></textarea>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-serif">Payment & Confirmation</h3>
              <div className="p-6 bg-[#f8f9fa] rounded-2xl border border-[#1a1a1a]/5 space-y-4">
                {selectedRoom && (
                  <div className="pb-4 border-b border-[#1a1a1a]/10">
                    <span className="text-xs text-[#1a1a1a]/60">Assigned Room</span>
                    <p className="font-medium">Room {selectedRoom.roomNumber} - {selectedRoom.typeName}</p>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">
                    Room Rate ({selectedRoomType.name} × {nights > 0 ? nights : 1} nights)
                  </span>
                  <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">Service Fee (5%)</span>
                  <span className="text-sm font-medium">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">Taxes (12%)</span>
                  <span className="text-sm font-medium">${taxes.toFixed(2)}</span>
                </div>
                <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between items-center">
                  <span className="text-base font-serif">Total Amount</span>
                  <span className="text-xl font-serif font-medium">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Reservation Summary</p>
                    <p className="text-sm text-blue-700/70">
                      {selectedGuest?.firstName} {selectedGuest?.lastName} · {nights} nights · {formData.adults} adult(s), {formData.children} child(ren)
                    </p>
                    <p className="text-sm text-blue-700/70">
                      Room: {selectedRoom ? `Room ${selectedRoom.roomNumber}` : 'Not assigned'} · {selectedRoomType.name}
                    </p>
                    <p className="text-sm text-blue-700/70">
                      Check-in: {format(new Date(formData.checkIn), 'MMM dd, yyyy')} · Check-out: {format(new Date(formData.checkOut), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 border-t border-[#1a1a1a]/5 flex justify-between">
            <button 
              type="button"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
              className="px-6 py-2 text-xs font-medium uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] disabled:opacity-0 transition-all"
            >
              Back
            </button>
            {step < 3 ? (
              <button 
                type="button"
                onClick={() => setStep(prev => prev + 1)}
                disabled={!canProceed()}
                className="px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            ) : (
              <button 
                type="submit"
                disabled={!canProceed() || createMutation.isPending}
                className="px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
