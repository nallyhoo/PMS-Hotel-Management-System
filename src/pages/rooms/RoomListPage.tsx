import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  Edit2,
  DoorOpen,
  Clock,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useRooms } from '../../api/hooks';
import type { RoomStatus } from '../../types/database';
import { useNavigate } from 'react-router-dom';

interface RoomUI {
  id: string;
  roomNumber: string;
  type: string;
  floor: string;
  status: RoomStatus;
  price: number;
  lastCleaned: string;
}

export default function RoomListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const navigate = useNavigate();
  
  const { data: rooms, isLoading, error, refetch } = useRooms();

  const roomsUI: RoomUI[] = useMemo(() => {
    if (!rooms) return [];
    return rooms.map(room => ({
      id: String(room.roomId),
      roomNumber: room.roomNumber,
      type: `Type ${room.roomTypeId}`,
      floor: `Floor ${room.floorId}`,
      status: room.status,
      price: 0,
      lastCleaned: room.lastCleaned || new Date().toISOString()
    }));
  }, [rooms]);

  const filteredRooms = roomsUI.filter(room => {
    const matchesSearch = room.roomNumber.includes(searchTerm) || 
                         room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || room.status === statusFilter;
    const matchesType = typeFilter === 'All' || room.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusStyles = (status: RoomStatus) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Occupied': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Dirty': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Maintenance': return 'bg-red-50 text-red-600 border-red-100';
      case 'Reserved': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load rooms</h3>
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
          <h1 className="text-3xl font-serif font-light mb-1">Room Inventory</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage hotel rooms, status, and configurations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/rooms/create')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <Plus size={14} />
            Add New Room
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by room number or type..." 
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
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Dirty">Dirty</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
            <DoorOpen size={16} className="text-[#1a1a1a]/30" />
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-medium"
            >
              <option value="All">All Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Room No.</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Floor</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price / Night</th>
                <th className="px-6 py-4">Last Cleaned</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredRooms.map((room) => (
                <tr key={room.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">Room {room.roomNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#1a1a1a]/60">{room.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-[#1a1a1a]/60">{room.floor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-md border ${getStatusStyles(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-serif font-medium">${room.price}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/40">
                      <Clock size={12} />
                      <span>{new Date(room.lastCleaned).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => navigate(`/rooms/details/${room.id}`)}
                        className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60" 
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600" title="Maintenance">
                        <Wrench size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
