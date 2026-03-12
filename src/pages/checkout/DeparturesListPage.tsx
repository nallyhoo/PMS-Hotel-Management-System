import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  Calendar, 
  User, 
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import { format } from 'date-fns';

export default function DeparturesListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'departures'],
    queryFn: () => reservationService.getReservations({ limit: 100 }),
  });

  const reservations = reservationsData?.data || [];

  const departures = reservations.filter((res: any) => 
    res.status === 'Checked In' &&
    (res.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     res.reservationCode?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Today's Departures</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Comprehensive list of guests checking out today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search departures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30 w-full md:w-64"
            />
          </div>
          <button className="p-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-[#1a1a1a]/60 hover:bg-[#f8f9fa] transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Stay Dates</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Checkout Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {departures.map((res: any) => (
                <tr key={res.reservationId} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif text-xs">
                        {res.firstName ? res.firstName.charAt(0) : 'G'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{res.firstName} {res.lastName}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{res.reservationCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                      <Calendar size={12} />
                      <span>{res.checkInDate} - {res.checkOutDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                      <MapPin size={12} />
                      <span>Room {res.assignedRoomId || '—'} - {res.roomTypeName || 'Standard'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                      <Clock size={12} />
                      <span>11:00 AM</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">
                      {res.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/checkout/process/${res.reservationId}`)}
                        className="px-3 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#333] transition-colors"
                      >
                        Check-out
                      </button>
                      <button 
                        onClick={() => navigate(`/reservations/details/${res.reservationId}`)}
                        className="px-3 py-1.5 border border-[#1a1a1a]/10 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#f8f9fa] transition-colors"
                      >
                        Details
                      </button>
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {departures.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <LogOut size={48} className="text-[#1a1a1a]/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Departures Today</h3>
            <p className="text-sm text-[#1a1a1a]/60">No guests are scheduled to check out today.</p>
          </div>
        )}
      </div>
    </div>
  );
}
