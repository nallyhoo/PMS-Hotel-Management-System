import React from 'react';
import { 
  LayoutGrid, 
  RefreshCw,
  DoorOpen,
  Users,
  Wrench,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import { useNavigate } from 'react-router-dom';
import type { RoomStatus } from '../../types/database';

export default function RoomStatusBoardPage() {
  const navigate = useNavigate();
  
  const { data: rooms, isLoading, refetch } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Occupied': return 'bg-blue-500';
      case 'Dirty': return 'bg-amber-500';
      case 'Maintenance': return 'bg-red-500';
      case 'Reserved': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Available': return <CheckCircle2 size={14} />;
      case 'Occupied': return <Users size={14} />;
      case 'Dirty': return <AlertCircle size={14} />;
      case 'Maintenance': return <Wrench size={14} />;
      case 'Reserved': return <DoorOpen size={14} />;
      default: return null;
    }
  };

  const statusCounts = {
    Available: rooms?.filter(r => r.status === 'Available').length || 0,
    Occupied: rooms?.filter(r => r.status === 'Occupied').length || 0,
    Dirty: rooms?.filter(r => r.status === 'Dirty').length || 0,
    Maintenance: rooms?.filter(r => r.status === 'Maintenance').length || 0,
    Reserved: rooms?.filter(r => r.status === 'Reserved').length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Room Status Board</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time visual grid of all property rooms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => refetch()}
            className="p-2 bg-white border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors"
          >
            <RefreshCw size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <LayoutGrid size={14} />
            Grid View
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6 bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
        {[
          { label: 'Available', color: 'bg-emerald-500', count: statusCounts.Available },
          { label: 'Occupied', color: 'bg-blue-500', count: statusCounts.Occupied },
          { label: 'Dirty', color: 'bg-amber-500', count: statusCounts.Dirty },
          { label: 'Maintenance', color: 'bg-red-500', count: statusCounts.Maintenance },
          { label: 'Reserved', color: 'bg-purple-500', count: statusCounts.Reserved },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">{item.label}</span>
            <span className="text-[10px] font-bold text-[#1a1a1a] bg-[#f8f9fa] px-1.5 py-0.5 rounded">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {rooms?.map((room) => (
          <div 
            key={room.roomId}
            className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
            onClick={() => navigate(`/rooms/details/${room.roomId}`)}
          >
            <div className={`h-1.5 w-full ${getStatusColor(room.status)}`}></div>
            <div className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-sm font-bold">Room {room.roomNumber}</span>
                <div className={`text-white p-1 rounded-md ${getStatusColor(room.status)}`}>
                  {getStatusIcon(room.status)}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-semibold">{room.roomTypeName || `Type ${room.roomTypeId}`}</p>
                <p className="text-[10px] text-[#1a1a1a]/60">Floor {room.floorNumber || room.floorId}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex justify-between items-center">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">View Details</span>
              <RefreshCw size={10} className="text-[#1a1a1a]/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
