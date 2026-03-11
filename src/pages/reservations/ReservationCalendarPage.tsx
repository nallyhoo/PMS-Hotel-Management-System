import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  Plus,
  MoreHorizontal,
  Loader2
} from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import Pagination from '../../components/Pagination';

interface CalendarReservation {
  reservationId: number;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  guestName: string;
  roomNumber?: string;
  roomTypeName?: string;
}

export default function ReservationCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const { data, isLoading } = useQuery({
    queryKey: ['reservationsCalendar', format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd'), currentPage, pageSize],
    queryFn: () => reservationService.getReservationCalendar(
      format(startDate, 'yyyy-MM-dd'),
      format(endDate, 'yyyy-MM-dd')
    ),
  });

  const reservations: CalendarReservation[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getReservationsForDay = (day: Date) => {
    return reservations.filter(res => {
      const checkIn = parseISO(res.checkInDate);
      const checkOut = parseISO(res.checkOutDate);
      return isWithinInterval(day, { start: checkIn, end: checkOut }) || isSameDay(checkIn, day);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Checked In': return 'bg-emerald-500';
      case 'Confirmed': return 'bg-blue-500';
      case 'Pending': return 'bg-amber-500';
      case 'Checked Out': return 'bg-gray-400';
      case 'Cancelled': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Reservation Calendar</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Visual overview of arrivals and occupancy trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#1a1a1a]/10 rounded-xl overflow-hidden">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-[#f8f9fa] transition-colors border-r border-[#1a1a1a]/10"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="px-4 py-2 min-w-[140px] text-center">
              <span className="text-sm font-serif font-medium">{format(currentMonth, 'MMMM yyyy')}</span>
            </div>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-[#f8f9fa] transition-colors border-l border-[#1a1a1a]/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <button className="p-2 bg-white border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button 
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-[#1a1a1a]/60">Status:</span>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[#1a1a1a]/60">Checked In</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-[#1a1a1a]/60">Confirmed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span className="text-[#1a1a1a]/60">Pending</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="animate-spin text-[#1a1a1a]/40" />
        </div>
      ) : (
        <>
          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-[#1a1a1a]/5 bg-[#f8f9fa]">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="px-4 py-3 text-center text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const dayReservations = getReservationsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isToday = isSameDay(day, new Date());
                
                return (
                  <div 
                    key={idx} 
                    className={`min-h-[100px] border-b border-r border-[#1a1a1a]/5 p-2 ${
                      !isCurrentMonth ? 'bg-[#f8f9fa]/50' : ''
                    }`}
                  >
                    <div className={`text-xs font-medium mb-1 ${
                      isToday 
                        ? 'w-6 h-6 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center' 
                        : isCurrentMonth 
                          ? 'text-[#1a1a1a]' 
                          : 'text-[#1a1a1a]/30'
                    }`}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-1">
                      {dayReservations.slice(0, 3).map((res) => (
                        <div 
                          key={res.reservationId}
                          className={`text-[10px] px-1.5 py-0.5 rounded text-white truncate ${getStatusColor(res.status)}`}
                          title={`${res.guestName} - ${res.status}`}
                        >
                          {res.guestName}
                        </div>
                      ))}
                      {dayReservations.length > 3 && (
                        <div className="text-[10px] text-[#1a1a1a]/40 text-center">
                          +{dayReservations.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={data ? Math.ceil(data.total / pageSize) : 1}
            total={data?.total || 0}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            showPageSize={false}
          />
        </>
      )}
    </div>
  );
}
