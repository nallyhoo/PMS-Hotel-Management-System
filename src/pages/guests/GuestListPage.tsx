import React, { useState, useMemo, useEffect } from 'react';
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
  AlertCircle,
  X,
  DownloadCloud,
  BarChart3,
  Loader2
} from 'lucide-react';
import { useGuests } from '../../api/hooks';
import { useNavigate } from 'react-router-dom';
import type { Guest } from '../../types/database';
import Pagination from '../../components/Pagination';
import { toastSuccess } from '../../lib/toast';

interface GuestUI {
  id: string;
  guestId: number;
  name: string;
  email: string;
  phone: string;
  totalStays: number;
  loyaltyTier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  vipStatus: string;
  lastStay: string;
  status: 'Active' | 'Inactive';
  imageUrl?: string;
}

export default function GuestListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    loyaltyTier: '' as string,
    vipStatus: '' as string,
    status: '' as string,
  });

  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error, refetch } = useGuests({ 
    page: currentPage, 
    limit: pageSize,
    search: debouncedSearch || undefined,
  });

  const guestsUI: GuestUI[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map(guest => ({
      id: String(guest.guestId),
      guestId: guest.guestId,
      name: `${guest.firstName} ${guest.lastName}`,
      email: guest.email || '',
      phone: guest.phone || '',
      totalStays: 0,
      loyaltyTier: 'Bronze' as const,
      vipStatus: guest.vipStatus || 'Regular',
      lastStay: guest.createdDate,
      status: guest.isActive !== false ? 'Active' as const : 'Inactive' as const,
      imageUrl: guest.imageUrl,
    }));
  }, [data]);

  const filteredGuests = guestsUI.filter(guest => {
    const matchesLoyalty = !filters.loyaltyTier || guest.loyaltyTier === filters.loyaltyTier;
    const matchesVip = !filters.vipStatus || guest.vipStatus === filters.vipStatus;
    const matchesStatus = !filters.status || guest.status === filters.status;
    
    return matchesLoyalty && matchesVip && matchesStatus;
  });

  const activeFiltersCount = [filters.vipStatus, filters.status].filter(Boolean).length;

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.loyaltyTier, filters.vipStatus, filters.status]);

  const clearFilters = () => {
    setFilters({ loyaltyTier: '', vipStatus: '', status: '' });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Phone', 'VIP Status', 'Status', 'Created Date'];
    const rows = filteredGuests.map(g => [
      g.id,
      g.name,
      g.email,
      g.phone,
      g.vipStatus,
      g.status,
      g.lastStay
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guests-export-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toastSuccess('Guest list exported successfully');
  };

  const totalRecords = data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Guest Directory</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage and view your hotel's guest profiles and loyalty data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/guests/analytics')}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <BarChart3 size={16} /> Analytics
          </button>
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <DownloadCloud size={16} /> Export
          </button>
          <button 
            onClick={() => navigate('/guests/add')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <UserPlus size={16} /> Add New Guest
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-1 focus:ring-[#1a1a1a]/10 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filters.vipStatus}
            onChange={(e) => setFilters(prev => ({ ...prev, vipStatus: e.target.value }))}
            className="px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 bg-white"
          >
            <option value="">All VIP</option>
            <option value="Regular">Regular</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
            <option value="Platinum">Platinum</option>
            <option value="Blacklist">Blacklist</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 bg-white"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {activeFiltersCount > 0 && (
            <button 
              onClick={clearFilters}
              className="flex items-center gap-1 px-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl"
            >
              <X size={14} /> Clear ({activeFiltersCount})
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
            <span className="text-xs text-[#1a1a1a]/60">Show</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-transparent border-none focus:outline-none text-xs font-medium"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Guest Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-[#1a1a1a]/40" size={32} />
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-[#1a1a1a]/20 mb-4" />
            <h3 className="text-lg font-medium text-[#1a1a1a]/60 mb-2">No guests found</h3>
            <p className="text-sm text-[#1a1a1a]/40">
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first guest to get started'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                  <th className="px-6 py-4">Guest</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">VIP Status</th>
                  <th className="px-6 py-4">Loyalty Tier</th>
                  <th className="px-6 py-4">Member Since</th>
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
                        {guest.imageUrl ? (
                          <img 
                            src={guest.imageUrl} 
                            alt={guest.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a] font-serif">
                            {guest.name ? guest.name.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{guest.name || 'Unknown'}</p>
                          <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">G-{guest.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                          <Mail size={12} /> {guest.email || '—'}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                          <Phone size={12} /> {guest.phone || '—'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {guest.vipStatus !== 'Regular' ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          guest.vipStatus === 'Platinum' ? 'bg-purple-50 text-purple-600' : 
                          guest.vipStatus === 'Gold' ? 'bg-amber-50 text-amber-600' :
                          guest.vipStatus === 'Silver' ? 'bg-slate-50 text-slate-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {guest.vipStatus}
                        </span>
                      ) : (
                        <span className="text-xs text-[#1a1a1a]/40">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getTierColor(guest.loyaltyTier)}`}>
                        {guest.loyaltyTier}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#1a1a1a]/60">{guest.lastStay?.split('T')[0]}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`w-2 h-2 rounded-full inline-block mr-2 ${guest.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <span className="text-xs font-medium">{guest.status}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={totalRecords}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          showPageSize={false}
        />
      </div>
    </div>
  );
}
