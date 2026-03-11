import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  User, 
  DoorOpen, 
  CreditCard, 
  Check, 
  ChevronRight,
  ShieldCheck,
  MapPin,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import roomService from '../../api/rooms';

type Step = 'identity' | 'room' | 'key' | 'confirmation';

export default function CheckinProcessPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [idVerified, setIdVerified] = useState(false);
  const [keyCardNumber, setKeyCardNumber] = useState('');
  const [notes, setNotes] = useState('');

  const { data: reservation, isLoading, error } = useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: !!id,
  });

  const { data: availableRooms } = useQuery({
    queryKey: ['availableRooms', reservation?.checkInDate, reservation?.checkOutDate],
    queryFn: () => roomService.checkAvailability({
      checkIn: reservation?.checkInDate,
      checkOut: reservation?.checkOutDate,
    }),
    enabled: !!reservation?.checkInDate && !!reservation?.checkOutDate,
  });

  const checkinMutation = useMutation({
    mutationFn: (data: { roomId: number; keyCardNumber?: string; notes?: string }) => 
      reservationService.checkIn(Number(id), data),
    onSuccess: () => {
      setCurrentStep('confirmation');
    },
  });

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'room', label: 'Room', icon: DoorOpen },
    { id: 'key', label: 'Key Card', icon: CreditCard },
    { id: 'confirmation', label: 'Confirm', icon: CheckCircle2 },
  ];

  const handleNext = () => {
    if (currentStep === 'identity') {
      if (!idVerified) {
        setIdVerified(true);
        return;
      }
      setCurrentStep('room');
    }
    else if (currentStep === 'room') setCurrentStep('key');
    else if (currentStep === 'key') {
      const roomId = selectedRoomId || reservation?.assignedRoomId;
      if (!roomId) return;
      
      checkinMutation.mutate({
        roomId,
        keyCardNumber: keyCardNumber || undefined,
        notes: notes || undefined,
      });
    }
  };

  const canProceed = () => {
    if (currentStep === 'identity') return idVerified;
    if (currentStep === 'room') return true;
    if (currentStep === 'key') return true;
    return true;
  };

  const generateKeyCard = () => {
    const random = Math.floor(100000 + Math.random() * 900000);
    setKeyCardNumber(String(random));
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
          onClick={() => navigate('/checkin')}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333]"
        >
          Back to Check-in
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
            onClick={() => navigate('/checkin')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Check-in Process</h1>
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

      {/* Main Content */}
      {currentStep === 'identity' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#1a1a1a]/5">
            <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center">
              <User size={24} className="text-[#1a1a1a]/60" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Guest Identity Verification</h2>
              <p className="text-sm text-[#1a1a1a]/60">Verify guest's identity and booking details</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Guest Name</p>
              <p className="font-medium">{reservation.firstName} {reservation.lastName}</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Email</p>
              <p className="font-medium">{reservation.email}</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Phone</p>
              <p className="font-medium">{reservation.phone}</p>
            </div>
            <div className="p-4 bg-[#f8f9fa] rounded-xl">
              <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 mb-1">Booking Source</p>
              <p className="font-medium">{reservation.bookingSource}</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Stay Details</p>
                <p className="text-sm text-blue-700/70">
                  Check-in: {reservation.checkInDate} • Check-out: {reservation.checkOutDate}
                </p>
                <p className="text-sm text-blue-700/70">
                  Adults: {reservation.adults} • Children: {reservation.children}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 border border-[#1a1a1a]/10 rounded-xl">
            <input
              type="checkbox"
              id="idVerified"
              checked={idVerified}
              onChange={(e) => setIdVerified(e.target.checked)}
              className="w-5 h-5 rounded border-[#1a1a1a]/20"
            />
            <label htmlFor="idVerified" className="text-sm">
              I have verified the guest's identity and all booking details are correct
            </label>
          </div>
        </div>
      )}

      {currentStep === 'room' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#1a1a1a]/5">
            <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center">
              <DoorOpen size={24} className="text-[#1a1a1a]/60" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Room Assignment</h2>
              <p className="text-sm text-[#1a1a1a]/60">Assign or confirm room for guest</p>
            </div>
          </div>

          {reservation.assignedRoomId ? (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600" />
                <div>
                  <p className="font-medium text-emerald-900">Pre-assigned Room</p>
                  <p className="text-sm text-emerald-700/70">Room {reservation.assignedRoomId} is already assigned to this reservation</p>
                </div>
              </div>
            </div>
          ) : availableRooms && availableRooms.length > 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-[#1a1a1a]/60">Select an available room:</p>
              <div className="grid grid-cols-4 gap-4">
                {(availableRooms as any[]).map((room: any) => (
                  <button
                    key={room.roomId}
                    onClick={() => setSelectedRoomId(room.roomId)}
                    className={`p-4 border rounded-xl text-left transition-all ${
                      selectedRoomId === room.roomId 
                        ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                        : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Room {room.roomNumber}</span>
                      {selectedRoomId === room.roomId && <Check size={16} className="text-emerald-600" />}
                    </div>
                    <p className="text-xs text-[#1a1a1a]/40 mt-1">{room.typeName}</p>
                    <p className="text-xs text-[#1a1a1a]/40">${room.basePrice}/night</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-700">
              No rooms available for the selected dates.
            </div>
          )}
        </div>
      )}

      {currentStep === 'key' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-6 border-b border-[#1a1a1a]/5">
            <div className="w-12 h-12 bg-[#f8f9fa] rounded-full flex items-center justify-center">
              <CreditCard size={24} className="text-[#1a1a1a]/60" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Key Card Assignment</h2>
              <p className="text-sm text-[#1a1a1a]/60">Generate and assign room key card</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-[#f8f9fa] rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">Room</p>
                <p className="font-medium">Room {selectedRoomId || reservation.assignedRoomId}</p>
              </div>
              <button
                onClick={generateKeyCard}
                className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm"
              >
                Generate Key
              </button>
            </div>

            {keyCardNumber && (
              <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                <p className="text-[10px] uppercase tracking-widest text-emerald-600 mb-2">Key Card Number</p>
                <p className="text-3xl font-mono font-bold text-emerald-700">{keyCardNumber}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm"
                placeholder="Any special instructions or notes..."
              />
            </div>
          </div>
        </div>
      )}

      {currentStep === 'confirmation' && (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-serif font-light mb-2">Check-in Complete!</h2>
            <p className="text-[#1a1a1a]/60 mb-8">Guest has been successfully checked in</p>
            
            <div className="inline-block p-6 bg-[#f8f9fa] rounded-xl text-left">
              <p className="text-sm text-[#1a1a1a]/60 mb-2">Confirmation Details</p>
              <p className="font-medium">{reservation.firstName} {reservation.lastName}</p>
              <p className="text-sm">Room {selectedRoomId || reservation.assignedRoomId}</p>
              {keyCardNumber && <p className="text-sm">Key Card: {keyCardNumber}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-between">
        <button
          onClick={() => {
            if (currentStep === 'identity') navigate('/checkin');
            else if (currentStep === 'room') setCurrentStep('identity');
            else if (currentStep === 'key') setCurrentStep('room');
            else navigate('/checkin');
          }}
          className="px-6 py-3 text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
        >
          {currentStep === 'confirmation' ? 'Back to Dashboard' : 'Back'}
        </button>

        {currentStep !== 'confirmation' && (
          <button
            onClick={handleNext}
            disabled={!canProceed() || checkinMutation.isPending}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checkinMutation.isPending && <Loader2 size={16} className="animate-spin" />}
            {currentStep === 'key' ? 'Complete Check-in' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        )}

        {currentStep === 'confirmation' && (
          <button
            onClick={() => navigate('/checkin')}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333]"
          >
            Back to Dashboard
          </button>
        )}
      </div>
    </div>
  );
}
