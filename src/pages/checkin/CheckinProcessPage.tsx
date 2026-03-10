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
  ArrowRight
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockReservations } from '../../data/mockReservations';
import { mockRooms } from '../../data/mockRooms';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'identity' | 'room' | 'key' | 'confirmation';

export default function CheckinProcessPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const reservation = mockReservations.find(res => res.id === id) || mockReservations[0];
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [idVerified, setIdVerified] = useState(false);
  const [keyAssigned, setKeyAssigned] = useState(false);

  const steps: { id: Step; label: string; icon: any }[] = [
    { id: 'identity', label: 'Identity', icon: User },
    { id: 'room', label: 'Room', icon: DoorOpen },
    { id: 'key', label: 'Key Card', icon: CreditCard },
    { id: 'confirmation', label: 'Confirm', icon: CheckCircle2 },
  ];

  const availableRooms = mockRooms.filter(room => room.type === reservation.roomType && room.status === 'Available');

  const handleNext = () => {
    if (currentStep === 'identity') setCurrentStep('room');
    else if (currentStep === 'room') setCurrentStep('key');
    else if (currentStep === 'key') setCurrentStep('confirmation');
  };

  const handleFinish = () => {
    navigate('/checkin');
  };

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
            <p className="text-sm text-[#1a1a1a]/60 font-light">Reservation {reservation.id} • {reservation.guestName}</p>
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
            {currentStep === 'identity' && (
              <motion.div 
                key="identity"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-serif">Guest Identity Verification</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Verify the guest's identity by scanning their passport or ID card.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="p-6 bg-[#f8f9fa] rounded-2xl border-2 border-dashed border-[#1a1a1a]/10 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#1a1a1a]/30 transition-all cursor-pointer">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a1a1a]/20 shadow-sm">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Scan Guest ID</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Passport, Driver License, or National ID</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                      <AlertCircle size={14} className="text-amber-600" />
                      <span>Ensure the name matches the reservation exactly.</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Verified Information</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]/5">
                          <span className="text-xs text-[#1a1a1a]/60">Full Name</span>
                          <span className="text-sm font-medium">{reservation.guestName}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]/5">
                          <span className="text-xs text-[#1a1a1a]/60">Document Type</span>
                          <span className="text-sm font-medium">Passport</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-[#1a1a1a]/5">
                          <span className="text-xs text-[#1a1a1a]/60">Document Number</span>
                          <span className="text-sm font-medium">E-9283741</span>
                        </div>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500" 
                        checked={idVerified}
                        onChange={(e) => setIdVerified(e.target.checked)}
                      />
                      <span className="text-sm font-medium text-emerald-800">I confirm that the ID has been verified.</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1a1a1a]/5 flex justify-end">
                  <button 
                    disabled={!idVerified}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Room Assignment
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'room' && (
              <motion.div 
                key="room"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-serif">Room Assignment</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Select an available room for the guest. Only {reservation.roomType} rooms are shown.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {availableRooms.map((room) => (
                    <button 
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      className={`p-6 rounded-2xl border-2 transition-all text-center space-y-2 ${
                        selectedRoom === room.id 
                          ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                          : 'border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                      }`}
                    >
                      <p className="text-2xl font-serif">{room.id}</p>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Floor {room.floor}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#1a1a1a]/5 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentStep('identity')}
                    className="text-xs font-medium uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!selectedRoom}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Key Card
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'key' && (
              <motion.div 
                key="key"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-serif">Key Card Assignment</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Encode and assign physical key cards for Room {selectedRoom}.</p>
                </div>

                <div className="flex flex-col items-center justify-center py-12 space-y-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                    keyAssigned ? 'bg-emerald-50 text-emerald-600' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/20'
                  }`}>
                    <CreditCard size={48} />
                  </div>
                  <div className="text-center space-y-2">
                    <h4 className="text-lg font-serif">{keyAssigned ? 'Key Cards Encoded' : 'Ready to Encode'}</h4>
                    <p className="text-sm text-[#1a1a1a]/60 font-light max-w-xs mx-auto">
                      Place the key cards on the encoder to write the access data for Room {selectedRoom}.
                    </p>
                  </div>
                  {!keyAssigned ? (
                    <button 
                      onClick={() => setKeyAssigned(true)}
                      className="px-6 py-3 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
                    >
                      Encode 2 Key Cards
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium">
                      <CheckCircle2 size={18} />
                      <span>Successfully assigned to Room {selectedRoom}</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-[#1a1a1a]/5 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentStep('room')}
                    className="text-xs font-medium uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                  >
                    Back
                  </button>
                  <button 
                    disabled={!keyAssigned}
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Final Confirmation
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 'confirmation' && (
              <motion.div 
                key="confirmation"
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
                  <h3 className="text-3xl font-serif">Check-in Successful</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light">Guest {reservation.guestName} has been successfully checked into Room {selectedRoom}.</p>
                </div>

                <div className="max-w-md mx-auto grid grid-cols-2 gap-4 text-left">
                  <div className="p-4 bg-[#f8f9fa] rounded-xl space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Room Number</p>
                    <p className="text-lg font-serif">{selectedRoom}</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Key Cards</p>
                    <p className="text-lg font-serif">2 Issued</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Check-out</p>
                    <p className="text-lg font-serif">{reservation.checkOut}</p>
                  </div>
                  <div className="p-4 bg-[#f8f9fa] rounded-xl space-y-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Total Balance</p>
                    <p className="text-lg font-serif">$0.00 (Paid)</p>
                  </div>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto px-8 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
                    Print Welcome Letter
                  </button>
                  <button 
                    onClick={handleFinish}
                    className="w-full sm:w-auto px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar: Summary */}
        <div className="space-y-8">
          <div className="bg-[#f8f9fa] p-8 rounded-2xl border border-[#1a1a1a]/5 space-y-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Reservation Summary</h4>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{reservation.guestName}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Primary Guest</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{reservation.checkIn} - {reservation.checkOut}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Stay Duration</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg text-[#1a1a1a]/40">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium">{reservation.roomType}</p>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">Room Category</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-[#1a1a1a]/10 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Room Rate</span>
                <span className="text-sm font-medium">$280.00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[#1a1a1a]/60">Tax & Fees</span>
                <span className="text-sm font-medium">$42.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#1a1a1a]/5">
                <span className="text-sm font-serif">Total</span>
                <span className="text-lg font-serif">$322.00</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg text-blue-600">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-900">Guest Preference</p>
              <p className="text-[10px] text-blue-700/60 leading-relaxed mt-1">
                Guest requested a high floor room away from the elevator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
