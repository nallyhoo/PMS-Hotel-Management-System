import React, { useState, useEffect, useRef } from 'react';
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
  Loader2,
  Trash2,
  AlertCircle,
  UserPlus,
  X,
  Upload
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import guestService from '../../api/guests';
import { toastSuccess, toastError } from '../../lib/toast';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dob: string;
  gender: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  vipStatus: string;
  notes: string;
  marketingConsent: boolean;
  blacklistReason: string;
  loyaltyTier: string;
  imageUrl: string;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  nationality: '',
  dob: '',
  gender: '',
  address: '',
  city: '',
  country: '',
  zipCode: '',
  vipStatus: 'Regular',
  notes: '',
  marketingConsent: false,
  blacklistReason: '',
  loyaltyTier: 'Bronze',
  imageUrl: '',
};

export default function EditGuestPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState<FormData>(initialFormData);

  const guestId = id ? Number(id) : null;
  const { data: guest, isLoading, error } = useQuery({
    queryKey: ['guest', guestId],
    queryFn: () => guestService.getGuest(guestId!),
    enabled: isEdit && !!guestId && !isNaN(guestId),
  });

  useEffect(() => {
    if (guest) {
      setFormData({
        firstName: guest.firstName || '',
        lastName: guest.lastName || '',
        email: guest.email || '',
        phone: guest.phone || '',
        nationality: guest.nationality || '',
        dob: guest.dateOfBirth || '',
        gender: guest.gender || '',
        address: guest.address || '',
        city: guest.city || '',
        country: guest.country || '',
        zipCode: guest.postalCode || '',
        vipStatus: guest.vipStatus || 'Regular',
        notes: guest.notes || '',
        marketingConsent: guest.marketingConsent || false,
        blacklistReason: guest.blacklistReason || '',
        loyaltyTier: 'Bronze',
        imageUrl: guest.imageUrl || '',
      });
    }
  }, [guest]);

  const createMutation = useMutation({
    mutationFn: (data: FormData) => guestService.createGuest({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality,
      dateOfBirth: data.dob,
      gender: data.gender,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.zipCode,
      vipStatus: data.vipStatus,
      notes: data.notes,
    }),
    onSuccess: (result) => {
      toastSuccess('Guest created successfully');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      navigate(`/guests/profile/${result.guestId}`);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to create guest');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => guestService.updateGuest(guestId!, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      nationality: data.nationality,
      dateOfBirth: data.dob,
      gender: data.gender,
      address: data.address,
      city: data.city,
      country: data.country,
      postalCode: data.zipCode,
      vipStatus: data.vipStatus,
      notes: data.notes,
    }),
    onSuccess: () => {
      toastSuccess('Guest updated successfully');
      queryClient.invalidateQueries({ queryKey: ['guest', guestId] });
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      navigate(`/guests/profile/${id}`);
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update guest');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => guestService.deleteGuest(guestId!),
    onSuccess: () => {
      toastSuccess('Guest deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      navigate('/guests');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to delete guest');
    },
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const imageMutation = useMutation({
    mutationFn: ({ guestId, imageUrl }: { guestId: number; imageUrl: string }) => 
      guestService.updateGuestImage(guestId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest', guestId] });
      toastSuccess('Photo updated successfully');
    },
    onError: (err: any) => {
      toastError(err.message || 'Failed to update photo');
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      if (isEdit && guestId) {
        imageMutation.mutate({ guestId, imageUrl: base64 });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    if (isEdit && guestId) {
      imageMutation.mutate({ guestId, imageUrl: '' });
    }
  };

  useEffect(() => {
    if (guest?.imageUrl) {
      setImagePreview(guest.imageUrl);
    }
  }, [guest]);

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
      </div>
    );
  }

  if (isEdit && error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-red-500">Failed to load guest data</p>
        <button 
          onClick={() => navigate('/guests')}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm"
        >
          Back to Guests
        </button>
      </div>
    );
  }

  const isBlacklisted = formData.vipStatus === 'Blacklist';
  const isPending = isEdit ? updateMutation.isPending : createMutation.isPending;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(isEdit ? `/guests/profile/${id}` : '/guests')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">{isEdit ? 'Edit Guest' : 'Add New Guest'}</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">
              {isEdit ? 'Update guest profile information.' : 'Create a new guest profile in the hotel management system.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isEdit && (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-red-50 transition-colors"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button 
            onClick={handleSubmit}
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg disabled:opacity-50"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isEdit ? 'Update Guest' : 'Save Guest'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center space-y-6">
            <div className="relative inline-block">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Guest" 
                    className="w-32 h-32 rounded-3xl object-cover border-2 border-[#1a1a1a]/10"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 bg-white rounded-lg text-[#1a1a1a]"
                    >
                      <Upload size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 bg-white rounded-lg text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-3xl bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 flex items-center justify-center text-[#1a1a1a]/20 cursor-pointer hover:border-[#1a1a1a]/30 hover:text-[#1a1a1a]/40 transition-colors"
                >
                  <User size={48} />
                </div>
              )}
              {!imagePreview && (
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 p-2.5 bg-[#1a1a1a] text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Guest Photo</h3>
              <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">JPG, PNG up to 5MB</p>
              {imageMutation.isPending && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs text-[#1a1a1a]/60">Uploading...</span>
                </div>
              )}
            </div>
          </div>

          {isEdit && (
            <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Status</h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="marketingConsent"
                  name="marketingConsent"
                  checked={formData.marketingConsent}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded"
                />
                <label htmlFor="marketingConsent" className="text-sm font-medium">Marketing Consent</label>
              </div>
              <p className="text-xs text-[#1a1a1a]/40">Guest agrees to receive promotional emails</p>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">VIP Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">VIP Level</label>
                <select 
                  name="vipStatus"
                  value={formData.vipStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="Regular">Regular</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                  <option value="Blacklist">Blacklist</option>
                </select>
              </div>
              {formData.vipStatus !== 'Regular' && (
                <div className={`p-4 rounded-xl border ${formData.vipStatus === 'Blacklist' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
                  <p className={`text-xs ${formData.vipStatus === 'Blacklist' ? 'text-red-800' : 'text-amber-800'}`}>
                    {formData.vipStatus === 'Blacklist' 
                      ? 'This guest is blacklisted and cannot make reservations.'
                      : 'This guest receives priority service and special amenities.'
                    }
                  </p>
                </div>
              )}
              {formData.vipStatus === 'Blacklist' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-red-600">Blacklist Reason</label>
                  <input 
                    type="text" 
                    name="blacklistReason"
                    value={formData.blacklistReason}
                    onChange={handleInputChange}
                    placeholder="Reason for blacklisting..."
                    className="w-full px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-red-200"
                  />
                </div>
              )}
            </div>
          </div>

          {!isEdit && (
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
          )}
        </div>

        {/* Right Column: Detailed Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">First Name *</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="e.g. Alexander"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="e.g. Wright"
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
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
                    value={formData.phone}
                    onChange={handleInputChange}
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
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Nationality</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/20" size={16} />
                  <input 
                    type="text" 
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
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
                    value={formData.address}
                    onChange={handleInputChange}
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
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Country</label>
                  <input 
                    type="text" 
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="USA"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Zip Code</label>
                  <input 
                    type="text" 
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="10001"
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Internal Notes</label>
                <textarea 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Add internal notes about this guest..."
                  className="w-full px-4 py-3 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-serif">Delete Guest</h3>
              <p className="text-sm text-[#1a1a1a]/60 mt-2">
                Are you sure you want to delete {formData.firstName} {formData.lastName}? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate()}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete Guest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
