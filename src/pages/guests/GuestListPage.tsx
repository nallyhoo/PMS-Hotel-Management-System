import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Star,
  ChevronRight,
  Download,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import { useGuests } from '../../api/hooks';
import { useNavigate } from 'react-router-dom';
import type { Guest } from '../../types/database';

interface GuestUI {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  lastStay: string;
  status: 'Active' | 'Inactive';
}

export default function GuestListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data, isLoading, error, refetch } = useGuests({ limit: 50 });

  const guestsUI: GuestUI[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(guest => ({
      id: String(guest.guestId),
      name: `${guest.firstName} ${guest.lastName}`,
      email: guest.email || '',
      phone: guest.phone || '',
      totalStays: 0,
      loyaltyTier: 'Bronze' as const,
      lastStay: guest.createdDate,
      status: 'Active' as const
    }));
  }, [data]);

  const filteredGuests = guestsUI.filter(guest => 
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum': return 'text-purple-600 bg-purple-50';
      case 'Gold': return 'text-amber-600 bg-amber-50';
      case 'Silver': return 'text-slate-600 bg-slate-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load guests</h3>
        <p className="text-sm text-gray-500 mb-4">{error?.message || 'An error occurred'}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Guest Directory</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage and view your hotel's guest profiles and loyalty data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/guests/add')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <UserPlus size={16} /> Add New Guest
          </button>
          <button className="p-2.5 border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <Download size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search guests by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-1 focus:ring-[#1a1a1a]/10 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa]">
            <Filter size={14} /> Loyalty Tier
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa]">
            Status
          </button>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Loyalty Tier</th>
                <th className="px-6 py-4">Stays</th>
                <th className="px-6 py-4">Last Stay</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredGuests.map((guest) => (
                <tr 
                  key={guest.id} 
                  className="hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                  onClick={() => navigate(`/guests/profile/${guest.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a] font-serif">
                        {guest.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{guest.name}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{guest.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                        <Mail size={12} /> {guest.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                        <Phone size={12} /> {guest.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getTierColor(guest.loyaltyTier)}`}>
                      {guest.loyaltyTier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{guest.totalStays}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#1a1a1a]/60">{guest.lastStay}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`w-2 h-2 rounded-full inline-block mr-2 ${guest.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span className="text-xs font-medium">{guest.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-xs text-[#1a1a1a]/40">Showing 5 of 1,240 guests</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border border-[#1a1a1a]/10 rounded text-[10px] uppercase font-bold tracking-widest disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-[#1a1a1a]/10 rounded text-[10px] uppercase font-bold tracking-widest">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
