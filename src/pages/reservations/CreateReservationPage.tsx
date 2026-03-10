import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';

export default function CreateReservationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: format(new Date(), 'yyyy-MM-dd'),
    checkOut: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    roomType: 'Deluxe',
    guests: 2,
    specialRequests: '',
    paymentMethod: 'Credit Card',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving
    console.log('Saving reservation:', formData);
    navigate('/reservations/list');
  };

  const steps = [
    { id: 1, name: 'Guest Information', icon: User },
    { id: 2, name: 'Stay Details', icon: Calendar },
    { id: 3, name: 'Payment & Confirm', icon: CreditCard },
  ];

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
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Full Name</label>
                  <input 
                    type="text" 
                    name="guestName"
                    value={formData.guestName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    placeholder="e.g. Julianne Moore"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    placeholder="guest@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
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
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Room Type</label>
                  <select 
                    name="roomType"
                    value={formData.roomType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
                  >
                    <option value="Standard">Standard Room</option>
                    <option value="Deluxe">Deluxe Room</option>
                    <option value="Suite">Executive Suite</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Number of Guests</label>
                  <input 
                    type="number" 
                    name="guests"
                    min="1"
                    max="10"
                    value={formData.guests}
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
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">Room Rate (3 nights)</span>
                  <span className="text-sm font-medium">$750.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">Service Fee</span>
                  <span className="text-sm font-medium">$45.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light text-[#1a1a1a]/60">Taxes (12%)</span>
                  <span className="text-sm font-medium">$95.40</span>
                </div>
                <div className="pt-4 border-t border-[#1a1a1a]/10 flex justify-between items-center">
                  <span className="text-base font-serif">Total Amount</span>
                  <span className="text-xl font-serif font-medium">$890.40</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Credit Card', 'Bank Transfer', 'Pay at Hotel', 'Corporate Account'].map(method => (
                    <label key={method} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      formData.paymentMethod === method ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' : 'border-[#1a1a1a]/10 hover:bg-[#f8f9fa]'
                    }`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method}
                        checked={formData.paymentMethod === method}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        formData.paymentMethod === method ? 'border-[#1a1a1a]' : 'border-[#1a1a1a]/20'
                      }`}>
                        {formData.paymentMethod === method && <div className="w-2 h-2 bg-[#1a1a1a] rounded-full"></div>}
                      </div>
                      <span className="text-sm font-medium">{method}</span>
                    </label>
                  ))}
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
                className="px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                Continue
              </button>
            ) : (
              <button 
                type="submit"
                className="px-8 py-3 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
