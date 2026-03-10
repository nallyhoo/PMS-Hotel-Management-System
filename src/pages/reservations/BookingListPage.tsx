import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useReservations } from '../../api/hooks';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ReservationUI {
  id: string;
  guestName: string;
  roomType: string;
  roomNumber?: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Pending';
  amount: number;
  source: 'Website' | 'Booking.com' | 'Expedia' | 'Direct';
  createdAt: string;
}

export default function BookingListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const navigate = useNavigate();
  
  const { data, isLoading, error, refetch } = useReservations({ limit: 50 });

  const reservations: ReservationUI[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((res) => ({
      id: res.reservationCode || String(res.reservationId),
      guestName: `Guest ${res.guestId}`,
      roomType: 'Standard',
      roomNumber: res.assignedRoomId ? String(res.assignedRoomId) : undefined,
      checkIn: res.checkInDate,
      checkOut: res.checkOutDate,
      status: res.status as ReservationUI['status'],
      amount: res.totalAmount,
      source: res.bookingSource as ReservationUI['source'],
      createdAt: res.createdDate
    }));
  }, [data]);

  const filteredReservations = reservations.filter(res => {
    const matchesSearch = res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         res.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status: ReservationUI['status']) => {
    switch (status) {
      case 'Checked In': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Checked Out': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'Cancelled': return 'bg-red-50 text-red-600 border-red-100';
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load reservations</h3>
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Reservations</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage and monitor all guest bookings across the property.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Download size={14} />
            Export
          </button>
          <button 
            onClick={() => navigate('/reservations/create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <Plus size={14} />
            New Booking
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by guest name or reservation ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-light"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
            <Filter size={16} className="text-[#1a1a1a]/30" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-medium"
            >
              <option value="All">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-xs font-medium hover:bg-[#1a1a1a]/5 transition-colors">
            Clear
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Reservation ID</th>
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Room Type</th>
                <th className="px-6 py-4">Check-in / Out</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-medium text-[#1a1a1a]/60">{res.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-bold">
                        {res.guestName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium">{res.guestName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-medium">{res.roomType}</p>
                      {res.roomNumber && (
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">Room {res.roomNumber}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs space-y-1">
                      <p className="font-medium">{format(new Date(res.checkIn), 'MMM dd, yyyy')}</p>
                      <p className="text-[#1a1a1a]/40">{format(new Date(res.checkOut), 'MMM dd, yyyy')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border ${getStatusStyles(res.status)}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-serif font-medium">${res.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">{res.source}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/reservations/details/${res.id}`)}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Cancel">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-xs text-[#1a1a1a]/40 font-light">
            Showing <span className="font-medium text-[#1a1a1a]">1 to {filteredReservations.length}</span> of <span className="font-medium text-[#1a1a1a]">{data?.total || filteredReservations.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50" disabled={!data?.total || data.page <= 1}>
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-1">
              <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] text-white rounded-lg text-xs font-medium">1</button>
              <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f8f9fa] rounded-lg text-xs font-medium">2</button>
            </div>
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
