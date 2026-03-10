import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Filter,
  Search,
  MoreVertical
} from 'lucide-react';
import { 
  format, 
  addDays, 
  startOfToday, 
  eachDayOfInterval, 
  isSameDay,
  isWithinInterval
} from 'date-fns';
import { mockReservations } from '../../data/mockReservations';

const rooms = [
  { id: '101', type: 'Standard' },
  { id: '102', type: 'Standard' },
  { id: '105', type: 'Deluxe' },
  { id: '202', type: 'Standard' },
  { id: '302', type: 'Suite' },
  { id: '402', type: 'Suite' },
  { id: '405', type: 'Suite' },
  { id: 'P01', type: 'Penthouse' },
];

export default function BookingTimelinePage() {
  const [startDate, setStartDate] = useState(startOfToday());
  const timelineDays = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 13), // 2 week view
  });

  const getReservationForRoomOnDay = (roomId: string, day: Date) => {
    return mockReservations.find(res => 
      res.roomNumber === roomId && 
      isWithinInterval(day, { 
        start: new Date(res.checkIn), 
        end: new Date(res.checkOut) 
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Booking Timeline</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Gantt-style view of room occupancy and availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#1a1a1a]/10 rounded-xl overflow-hidden text-xs font-medium">
            <button 
              onClick={() => setStartDate(addDays(startDate, -7))}
              className="px-3 py-2 hover:bg-[#f8f9fa] transition-colors border-r border-[#1a1a1a]/10"
            >
              Previous Week
            </button>
            <div className="px-4 py-2 min-w-[180px] text-center bg-[#f8f9fa]/50">
              {format(startDate, 'MMM dd')} - {format(addDays(startDate, 13), 'MMM dd, yyyy')}
            </div>
            <button 
              onClick={() => setStartDate(addDays(startDate, 7))}
              className="px-3 py-2 hover:bg-[#f8f9fa] transition-colors border-l border-[#1a1a1a]/10"
            >
              Next Week
            </button>
          </div>
          <button className="p-2 bg-white border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1200px]">
            {/* Header: Dates */}
            <div className="flex border-b border-[#1a1a1a]/5 bg-[#f8f9fa]">
              <div className="w-48 p-4 border-r border-[#1a1a1a]/5 shrink-0">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Room / Date</span>
              </div>
              {timelineDays.map((day, idx) => (
                <div key={idx} className={`flex-1 p-3 text-center border-r border-[#1a1a1a]/5 ${isSameDay(day, new Date()) ? 'bg-[#1a1a1a]/5' : ''}`}>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{format(day, 'EEE')}</p>
                  <p className={`text-xs font-medium ${isSameDay(day, new Date()) ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/60'}`}>{format(day, 'dd')}</p>
                </div>
              ))}
            </div>

            {/* Rows: Rooms */}
            <div className="divide-y divide-[#1a1a1a]/5">
              {rooms.map(room => (
                <div key={room.id} className="flex group hover:bg-[#f8f9fa]/30 transition-colors">
                  <div className="w-48 p-4 border-r border-[#1a1a1a]/5 shrink-0 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Room {room.id}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest">{room.type}</p>
                    </div>
                    <button className="p-1 hover:bg-[#1a1a1a]/5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} className="text-[#1a1a1a]/40" />
                    </button>
                  </div>
                  {timelineDays.map((day, idx) => {
                    const res = getReservationForRoomOnDay(room.id, day);
                    const isStart = res && isSameDay(day, new Date(res.checkIn));
                    const isEnd = res && isSameDay(day, new Date(res.checkOut));

                    return (
                      <div key={idx} className={`flex-1 h-16 border-r border-[#1a1a1a]/5 relative ${isSameDay(day, new Date()) ? 'bg-[#1a1a1a]/5' : ''}`}>
                        {res && (
                          <div 
                            className={`absolute inset-y-2 left-0 right-0 z-10 mx-0.5 rounded-sm flex items-center px-2 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] ${
                              res.status === 'Checked In' ? 'bg-emerald-500 text-white' :
                              res.status === 'Confirmed' ? 'bg-blue-500 text-white' :
                              'bg-gray-400 text-white'
                            }`}
                            title={`${res.guestName} (${res.status})`}
                          >
                            {(isStart || idx === 0) && (
                              <span className="text-[10px] font-medium truncate">{res.guestName}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-emerald-500"></div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Reserved</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-white border border-[#1a1a1a]/10"></div>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/60">Available</span>
          </div>
        </div>
        <p className="text-[10px] text-[#1a1a1a]/40 font-medium">
          Last updated: Today, 08:30 PM
        </p>
      </div>
    </div>
  );
}
