import React from 'react';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Search,
  Calendar,
  UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import { format, parseISO } from 'date-fns';

export default function CheckinDashboardPage() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const { data: reservationsData, isLoading } = useQuery({
    queryKey: ['reservations', 'dashboard'],
    queryFn: () => reservationService.getReservations({ limit: 100 }),
  });

  const reservations = reservationsData?.data || [];
  
  const todayArrivals = reservations.filter((res: any) => 
    res.status === 'Confirmed' && res.checkInDate === today
  );
  
  const checkedInToday = reservations.filter((res: any) => 
    res.status === 'Checked In'
  ).length;
  
  const pendingArrivals = todayArrivals.length;

  const stats = [
    { label: 'Total Arrivals', value: pendingArrivals + checkedInToday, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Check-in', value: pendingArrivals, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Checked In', value: checkedInToday, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'VIP Arrivals', value: 0, icon: UserCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Check-in Dashboard</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage today's arrivals and guest welcoming process.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or reservation ID..."
            className="pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm focus:outline-none focus:border-[#1a1a1a]/30 w-full md:w-80"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{stat.label}</p>
              <p className="text-2xl font-serif">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Arrivals List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
              <h3 className="text-lg font-serif">Today's Arrivals</h3>
              <button 
                onClick={() => navigate('/checkin/arrivals')}
                className="text-xs font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a] flex items-center gap-1"
              >
                View All Arrivals <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-[#1a1a1a]/5">
              {todayArrivals.slice(0, 5).map((res: any) => (
                <div key={res.reservationId} className="p-6 hover:bg-[#f8f9fa] transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                      {res.firstName ? res.firstName.charAt(0) : 'G'}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{res.firstName} {res.lastName}</h4>
                      <div className="flex items-center gap-3 text-[10px] text-[#1a1a1a]/40 font-medium uppercase tracking-wider">
                        <span>{res.reservationCode}</span>
                        <span>•</span>
                        <span>{res.roomTypeName || 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">Standard Check-in</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">14:00 PM</p>
                    </div>
                    <button 
                      onClick={() => navigate(`/checkin/process/${res.reservationId}`)}
                      className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-[#333] transition-colors"
                    >
                      Start Check-in
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Quick Actions & Alerts */}
        <div className="space-y-8">
          <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-lg font-serif">Quick Actions</h3>
            <div className="grid grid-cols-1 gap-3">
              <button 
                onClick={() => navigate('/checkin/walkin')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium uppercase tracking-widest transition-colors text-left flex items-center justify-between"
              >
                Walk-in Reservation <Plus size={14} />
              </button>
              <button 
                onClick={() => navigate('/checkin/group')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium uppercase tracking-widest transition-colors text-left flex items-center justify-between"
              >
                Group Check-in <Users size={14} />
              </button>
              <button 
                onClick={() => navigate('/checkin/keycards')}
                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-medium uppercase tracking-widest transition-colors text-left flex items-center justify-between"
              >
                Key Card Management <LayoutGrid size={14} />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle size={18} />
              <h4 className="text-xs font-bold uppercase tracking-widest">Attention Required</h4>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl space-y-1">
                <p className="text-xs font-medium">Room 402 Not Ready</p>
                <p className="text-[10px] text-[#1a1a1a]/60">Guest arriving in 30 mins. Housekeeping alerted.</p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl space-y-1">
                <p className="text-xs font-medium text-red-600">Identity Mismatch</p>
                <p className="text-[10px] text-[#1a1a1a]/60">Reservation #GV-1029 requires manual ID verification.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function LayoutGrid({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
}
