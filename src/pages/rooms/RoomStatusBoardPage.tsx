import React from 'react';
import { 
  LayoutGrid, 
  Filter, 
  Search, 
  RefreshCw,
  DoorOpen,
  Users,
  Wrench,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { mockRooms, Room } from '../../data/mockRooms';

export default function RoomStatusBoardPage() {
  const getStatusColor = (status: Room['status']) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500';
      case 'Occupied': return 'bg-blue-500';
      case 'Dirty': return 'bg-amber-500';
      case 'Maintenance': return 'bg-red-500';
      case 'Reserved': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Room['status']) => {
    switch (status) {
      case 'Available': return <CheckCircle2 size={14} />;
      case 'Occupied': return <Users size={14} />;
      case 'Dirty': return <AlertCircle size={14} />;
      case 'Maintenance': return <Wrench size={14} />;
      case 'Reserved': return <DoorOpen size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Room Status Board</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time visual grid of all property rooms.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 bg-white border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
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
          { label: 'Available', color: 'bg-emerald-500', count: mockRooms.filter(r => r.status === 'Available').length },
          { label: 'Occupied', color: 'bg-blue-500', count: mockRooms.filter(r => r.status === 'Occupied').length },
          { label: 'Dirty', color: 'bg-amber-500', count: mockRooms.filter(r => r.status === 'Dirty').length },
          { label: 'Maintenance', color: 'bg-red-500', count: mockRooms.filter(r => r.status === 'Maintenance').length },
          { label: 'Reserved', color: 'bg-purple-500', count: mockRooms.filter(r => r.status === 'Reserved').length },
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
        {mockRooms.map((room) => (
          <div 
            key={room.id}
            className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all cursor-pointer"
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
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40 font-semibold">{room.type}</p>
                <p className="text-[10px] text-[#1a1a1a]/60">{room.floor}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[9px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">View Details</span>
              <RefreshCw size={10} className="text-[#1a1a1a]/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
