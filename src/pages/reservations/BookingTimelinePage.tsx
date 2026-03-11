import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Loader2
} from 'lucide-react';
import { 
  format, 
  addDays, 
  startOfToday, 
  eachDayOfInterval, 
  isSameDay,
  isWithinInterval,
  parseISO
} from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import reservationService from '../../api/reservations';
import roomService from '../../api/rooms';
import Pagination from '../../components/Pagination';

interface TimelineReservation {
  reservationId: number;
  reservationCode: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  guestName: string;
  roomNumber?: string;
  roomTypeName?: string;
}

export default function BookingTimelinePage() {
  const [startDate, setStartDate] = useState(startOfToday());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRoom, setSelectedRoom] = useState<string>('all');

  const timelineDays = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 13),
  });

  const { data: roomsData, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['reservationsCalendar', format(startDate, 'yyyy-MM-dd'), format(addDays(startDate, 14), 'yyyy-MM-dd')],
    queryFn: () => reservationService.getReservationCalendar(
      format(startDate, 'yyyy-MM-dd'),
      format(addDays(startDate, 14), 'yyyy-MM-dd')
    ),
  });

  const reservations: TimelineReservation[] = useMemo(() => {
    if (!data?.data) return [];
    return data.data;
  }, [data]);

  const rooms = useMemo(() => {
    if (!roomsData) return [];
    return roomsData.map((r: any) => ({
      id: String(r.roomNumber),
      roomId: r.roomId,
      type: r.roomTypeName || 'Standard',
      typeId: r.roomTypeId
    }));
  }, [roomsData]);

  const filteredRooms = selectedRoom === 'all' 
    ? rooms 
    : rooms.filter((r: any) => String(r.roomId) === selectedRoom);

  const getReservationForRoomOnDay = (roomId: string, day: Date): TimelineReservation | undefined => {
    return reservations.find(res => {
      if (res.roomNumber !== roomId) return false;
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
          <button 
            onClick={() => setStartDate(startOfToday())}
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#1a1a1a]/60">Filter by room:</span>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="text-sm border border-[#1a1a1a]/10 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20"
          >
            <option value="all">All Rooms</option>
            {rooms.map((room: any) => (
              <option key={room.id} value={String(room.roomId)}>
                Room {room.id} - {room.type}
              </option>
            ))}
          </select>
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

      {isLoading || roomsLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 size={32} className="animate-spin text-[#1a1a1a]/40" />
        </div>
      ) : (
        <>
          {/* Timeline Grid */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            {/* Date header */}
            <div className="grid border-b border-[#1a1a1a]/5" style={{ gridTemplateColumns: `120px repeat(${timelineDays.length}, 1fr)` }}>
              <div className="px-4 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 bg-[#f8f9fa]">
                Room
              </div>
              {timelineDays.map((day, idx) => (
                <div 
                  key={idx} 
                  className={`px-2 py-3 text-center text-[10px] uppercase tracking-widest font-semibold border-l border-[#1a1a1a]/5 ${
                    isSameDay(day, startOfToday()) ? 'bg-blue-50 text-blue-600' : 'text-[#1a1a1a]/40'
                  }`}
                >
                  <div>{format(day, 'EEE')}</div>
                  <div className="text-xs">{format(day, 'd')}</div>
                </div>
              ))}
            </div>

            {/* Room rows */}
            {filteredRooms.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((room: any) => (
              <div 
                key={room.id} 
                className="grid border-b border-[#1a1a1a]/5 hover:bg-[#f8f9fa]/50"
                style={{ gridTemplateColumns: `120px repeat(${timelineDays.length}, 1fr)` }}
              >
                <div className="px-4 py-3 text-xs font-medium text-[#1a1a1a]/60 bg-[#f8f9fa]/30">
                  <div>Room {room.id}</div>
                  <div className="text-[10px] text-[#1a1a1a]/40">{room.type}</div>
                </div>
                {timelineDays.map((day, idx) => {
                  const reservation = getReservationForRoomOnDay(room.id, day);
                  const isCheckIn = reservation && isSameDay(parseISO(reservation.checkInDate), day);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`relative border-l border-[#1a1a1a]/5 ${
                        isSameDay(day, startOfToday()) ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {reservation && (
                        <div 
                          className={`absolute inset-y-1 rounded ${getStatusColor(reservation.status)}`}
                          style={{
                            left: isCheckIn ? '2px' : '0',
                            right: '2px',
                          }}
                          title={`${reservation.guestName} (${reservation.status})`}
                        >
                          {isCheckIn && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-white font-medium truncate">
                              {reservation.guestName}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRooms.length / pageSize)}
            total={filteredRooms.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            showPageSize={false}
          />
        </>
      )}
    </div>
  );
}
