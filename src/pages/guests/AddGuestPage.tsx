import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  ShieldCheck,
  Camera,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AddGuestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    dob: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    loyaltyTier: 'Bronze',
    preferences: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving
    console.log('Saving guest:', formData);
    navigate('/guests');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/guests')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Add New Guest</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Create a new guest profile in the hotel management system.</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg"
        >
          <Save size={16} /> Save Guest Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center space-y-6">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-3xl bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/20">
                <User size={48} />
              </div>
              <button type="button" className="absolute -bottom-2 -right-2 p-2.5 bg-[#1a1a1a] text-white rounded-xl shadow-lg hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Guest Photo</h3>
              <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">JPG, PNG up to 5MB</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Loyalty Program</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Initial Tier</label>
                <select 
                  name="loyaltyTier"
                  value={formData.loyaltyTier}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <ShieldCheck size={16} className="text-emerald-600 mt-0.5" />
                <p className="text-[10px] text-emerald-800 leading-relaxed">
                  New guests are automatically enrolled in the Bronze tier of the GrandView Rewards program.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  placeholder="e.g. Alexander"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  placeholder="e.g. Wright"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    placeholder="alex.wright@email.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="date" 
                    name="dob"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="text" 
                    name="nationality"
                    placeholder="e.g. American"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Address Details</h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="text" 
                    name="address"
                    placeholder="123 Park Avenue"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">City</label>
                  <input 
                    type="text" 
                    name="city"
                    placeholder="New York"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    placeholder="USA"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    placeholder="10001"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Preferences & Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Guest Preferences</label>
                <textarea 
                  name="preferences"
                  rows={4}
                  placeholder="e.g. High floor, extra pillows, vegetarian diet..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
