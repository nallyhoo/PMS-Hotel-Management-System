import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  Plus,
  MoreHorizontal
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
  subMonths 
} from 'date-fns';
import { mockReservations } from '../../data/mockReservations';

export default function ReservationCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getReservationsForDay = (day: Date) => {
    return mockReservations.filter(res => isSameDay(new Date(res.checkIn), day));
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
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Plus size={14} />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-[#1a1a1a]/5 bg-[#f8f9fa]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{day}</span>
            </div>
          ))}
        </div>

        {/* Calendar cells */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayReservations = getReservationsForDay(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div 
                key={idx} 
                className={`min-h-[120px] p-2 border-b border-r border-[#1a1a1a]/5 transition-colors hover:bg-[#f8f9fa]/50 ${
                  !isCurrentMonth ? 'bg-[#f8f9fa]/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-[#1a1a1a] text-white' : isCurrentMonth ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/20'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayReservations.length > 0 && (
                    <span className="text-[10px] font-bold text-[#1a1a1a]/40">{dayReservations.length} Arrivals</span>
                  )}
                </div>

                <div className="space-y-1">
                  {dayReservations.slice(0, 3).map(res => (
                    <div 
                      key={res.id} 
                      className={`px-2 py-1 rounded text-[10px] font-medium truncate border ${
                        res.status === 'Checked In' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                        res.status === 'Confirmed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-gray-50 text-gray-700 border-gray-100'
                      }`}
                      title={`${res.guestName} - ${res.roomType}`}
                    >
                      {res.guestName}
                    </div>
                  ))}
                  {dayReservations.length > 3 && (
                    <div className="text-[9px] text-center text-[#1a1a1a]/40 font-medium">
                      + {dayReservations.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 px-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-100"></div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Checked In</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-50 border border-blue-100"></div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-50 border border-amber-100"></div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-50 border border-red-100"></div>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Cancelled</span>
        </div>
      </div>
    </div>
  );
}
