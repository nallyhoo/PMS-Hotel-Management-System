import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw,
  MoreVertical,
  User,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  ToggleLeft,
  ToggleRight,
  Home,
  BedDouble,
  Wrench,
  Calendar,
  Trash2,
  Users,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import type { HousekeepingRoom } from '../../api/housekeeping';
import { toastSuccess, toastError } from '../../lib/toast';

interface RoomWithFloor extends HousekeepingRoom {
  floorNumber?: number;
}

export default function CleaningStatusBoard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [floorFilter, setFloorFilter] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [bulkMode, setBulkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(null);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshInterval = 30000; // 30 seconds

  const { data: roomsData, isLoading, refetch } = useQuery({
    queryKey: ['housekeeping', 'rooms', 'status-board'],
    queryFn: () => housekeepingService.getRooms(),
    refetchInterval: autoRefresh ? refreshInterval : false,
  });

  const getRoomId = (room: any) => room.roomId || room.RoomID;
  const getRoomNumber = (room: any) => {
    const num = room.roomNumber || room.RoomNumber || getRoomId(room);
    return `Room ${num}`;
  };
  const getRoomType = (room: any) => room.typeName || room.TypeName || 'Standard';
  const getRoomStatus = (room: any) => room.roomStatus || room.RoomStatus;
  const getCleaningStatus = (room: any) => room.cleaningStatus || room.CleaningStatus;
  const getFloorId = (room: any) => room.floorId || room.FloorID || 1;

  const getStatusStyle = (room: any) => {
    const status = room.cleaningStatus || room.CleaningStatus;
    switch (status) {
      case 'Clean': return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'Inspected': return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'Cleaning': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Dirty': return 'bg-amber-50 border-amber-200 text-amber-700';
      default: return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getStatusIcon = (room: any) => {
    const status = room.cleaningStatus || room.CleaningStatus;
    switch (status) {
      case 'Clean': return <CheckCircle2 size={14} />;
      case 'Inspected': return <Sparkles size={14} />;
      case 'Cleaning': return <Clock size={14} />;
      case 'Dirty': return <AlertTriangle size={14} />;
      default: return <AlertTriangle size={14} />;
    }
  };

  const getOccupancyIcon = (room: any) => {
    const status = room.roomStatus || room.RoomStatus;
    switch (status) {
      case 'Occupied': return <Users size={12} />;
      case 'Available': return <Home size={12} />;
      case 'Maintenance': return <Wrench size={12} />;
      case 'Reserved': return <Calendar size={12} />;
      default: return <Home size={12} />;
    }
  };

  const getOccupancyColor = (room: any) => {
    const status = room.roomStatus || room.RoomStatus;
    switch (status) {
      case 'Occupied': return 'text-orange-600 bg-orange-50';
      case 'Available': return 'text-emerald-600 bg-emerald-50';
      case 'Maintenance': return 'text-red-600 bg-red-50';
      case 'Reserved': return 'text-purple-600 bg-purple-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const displayStatus = (room: any) => {
    const status = room.cleaningStatus || room.CleaningStatus;
    if (!status || status === 'Dirty') return 'Dirty';
    return status;
  };

  const getLastCleanedDisplay = (room: any) => {
    const lastCleaned = room.lastCleaned || room.LastCleaned;
    if (!lastCleaned) return null;
    const date = new Date(lastCleaned);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const rooms: any[] = roomsData || [];

  const stats = useMemo(() => {
    return {
      total: rooms.length,
      dirty: rooms.filter(r => !r.cleaningStatus || r.CleaningStatus || r.cleaningStatus === 'Dirty').length,
      cleaning: rooms.filter(r => r.cleaningStatus === 'Cleaning' || r.CleaningStatus === 'Cleaning').length,
      clean: rooms.filter(r => r.cleaningStatus === 'Clean' || r.CleaningStatus === 'Clean').length,
      inspected: rooms.filter(r => r.cleaningStatus === 'Inspected' || r.CleaningStatus === 'Inspected').length,
      occupied: rooms.filter(r => r.roomStatus === 'Occupied' || r.RoomStatus === 'Occupied').length,
      available: rooms.filter(r => r.roomStatus === 'Available' || r.RoomStatus === 'Available').length,
    };
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const roomNum = room.roomNumber || room.RoomNumber || '';
      const floorId = room.floorId || room.FloorID;
      const cleaningStatus = room.cleaningStatus || room.CleaningStatus;
      const matchesSearch = !searchQuery || roomNum.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || cleaningStatus === statusFilter || (!cleaningStatus && statusFilter === 'Dirty');
      const matchesFloor = !floorFilter || String(floorId) === floorFilter;
      return matchesSearch && matchesStatus && matchesFloor;
    });
  }, [rooms, searchQuery, statusFilter, floorFilter]);

  const floors = filteredRooms.reduce((acc, room) => {
    const floorNum = getFloorId(room);
    if (!acc[floorNum]) {
      acc[floorNum] = [];
    }
    acc[floorNum].push(room);
    return acc;
  }, {} as Record<number, any[]>);

  const uniqueFloors = [...new Set(rooms.map(r => getFloorId(r)))].sort();

  const toggleRoomSelection = (roomId: number) => {
    const id = Number(roomId);
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const selectAllFiltered = () => {
    setSelectedRooms(filteredRooms.map(r => getRoomId(r)));
  };

  const clearSelection = () => {
    setSelectedRooms([]);
  };

  const StatCard = ({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: React.ElementType }) => (
    <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{label}</p>
          <p className="text-2xl font-serif mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Status Board</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time room cleaning and inspection status.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs font-medium uppercase tracking-widest transition-colors ${
              autoRefresh ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-[#1a1a1a]/10 text-[#1a1a1a]/40'
            }`}
          >
            {autoRefresh ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
            Auto
          </button>
          <button 
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <StatCard label="Total" value={stats.total} color="bg-slate-100" icon={Home} />
        <StatCard label="Dirty" value={stats.dirty} color="bg-amber-100" icon={AlertTriangle} />
        <StatCard label="Cleaning" value={stats.cleaning} color="bg-indigo-100" icon={Clock} />
        <StatCard label="Clean" value={stats.clean} color="bg-emerald-100" icon={CheckCircle2} />
        <StatCard label="Inspected" value={stats.inspected} color="bg-blue-100" icon={Sparkles} />
        <StatCard label="Occupied" value={stats.occupied} color="bg-orange-100" icon={Users} />
        <StatCard label="Available" value={stats.available} color="bg-emerald-100" icon={BedDouble} />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={16} />
          <input
            type="text"
            placeholder="Search room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[#1a1a1a]/40" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#f8f9fa] border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
          >
            <option value="">All Status</option>
            <option value="Dirty">Dirty</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Clean">Clean</option>
            <option value="Inspected">Inspected</option>
          </select>

          <select
            value={floorFilter}
            onChange={(e) => setFloorFilter(e.target.value)}
            className="px-3 py-2 bg-[#f8f9fa] border-none rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
          >
            <option value="">All Floors</option>
            {uniqueFloors.map(floor => (
              <option key={floor} value={floor}>Floor {floor}</option>
            ))}
          </select>
        </div>

        {searchQuery || statusFilter || floorFilter ? (
          <button
            onClick={() => { setSearchQuery(''); setStatusFilter(''); setFloorFilter(''); }}
            className="text-xs text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
          >
            Clear Filters
          </button>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
              bulkMode ? 'bg-[#1a1a1a] text-white' : 'bg-[#f8f9fa] text-[#1a1a1a]/60 hover:bg-[#f0f0f0]'
            }`}
          >
            {bulkMode ? <CheckCircle2 size={14} /> : <Users size={14} />}
            {bulkMode ? 'Selecting' : 'Bulk Select'}
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkMode && selectedRooms.length > 0 && (
        <div className="bg-[#1a1a1a] text-white p-4 rounded-xl flex items-center justify-between">
          <span className="text-sm">{selectedRooms.length} room(s) selected</span>
          <div className="flex items-center gap-3">
            <button
              onClick={selectAllFiltered}
              className="text-xs hover:underline"
            >
              Select All Visible
            </button>
            <button
              onClick={clearSelection}
              className="text-xs hover:underline"
            >
              Clear
            </button>
            <button
              onClick={() => navigate(`/housekeeping/assign-tasks?rooms=${selectedRooms.join(',')}`)}
              className="px-4 py-2 bg-white text-[#1a1a1a] rounded-lg text-xs font-medium"
            >
              Assign Tasks
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-wrap items-center gap-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Legend:</span>
        {[
          { label: 'Dirty', color: 'bg-amber-500' },
          { label: 'Cleaning', color: 'bg-indigo-500' },
          { label: 'Clean', color: 'bg-emerald-500' },
          { label: 'Inspected', color: 'bg-blue-500' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </div>
        ))}
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 ml-4">Occupancy:</span>
        {[
          { label: 'Occupied', icon: Users },
          { label: 'Available', icon: Home },
          { label: 'Maintenance', icon: Wrench },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <item.icon size={12} className="text-[#1a1a1a]/40" />
            <span className="text-xs font-medium text-[#1a1a1a]/60">{item.label}</span>
          </div>
        ))}
      </div>

      {isLoading && !roomsData ? (
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-[#1a1a1a]/40">Loading room status...</p>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-[#1a1a1a]/40">No rooms found</p>
        </div>
      ) : (
        /* Floors Grid */
        <div className="space-y-12">
          {Object.entries(floors as Record<number, any[]>).map(([floorNum, floorRooms]: [string, any[]]) => (
            <div key={floorNum} className="space-y-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-serif">Floor {floorNum}</h2>
                <div className="h-px flex-1 bg-[#1a1a1a]/5" />
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                  {floorRooms.length} Rooms
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {floorRooms.map((room) => (
                  <div 
                    key={getRoomId(room)}
                    onClick={() => bulkMode ? toggleRoomSelection(getRoomId(room)) : navigate(`/housekeeping/tasks?roomId=${getRoomId(room)}`)}
                    className={`p-4 rounded-2xl border-2 transition-all group relative cursor-pointer ${
                      bulkMode && selectedRooms.includes(getRoomId(room)) 
                        ? 'border-[#1a1a1a] ring-2 ring-[#1a1a1a]/20' 
                        : getStatusStyle(room)
                    } ${bulkMode ? 'hover:border-[#1a1a1a]/50' : ''}`}
                  >
                    {bulkMode && (
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedRooms.includes(getRoomId(room)) 
                          ? 'bg-[#1a1a1a] border-[#1a1a1a]' 
                          : 'border-[#1a1a1a]/20'
                      }`}>
                        {selectedRooms.includes(getRoomId(room)) && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    )}
                    {!bulkMode && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="relative">
                          <button 
                            type="button"
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              e.preventDefault();
                              setMenuOpen(menuOpen === getRoomId(room) ? null : getRoomId(room)); 
                            }}
                            className="p-1.5 hover:bg-black/10 rounded-full bg-white/80 shadow-sm"
                          >
                            <MoreVertical size={14} className="text-[#1a1a1a]/60" />
                          </button>
                          {menuOpen === getRoomId(room) && (
                            <div className="absolute right-0 top-8 w-48 bg-white rounded-xl shadow-xl border border-[#1a1a1a]/10 z-50 py-1.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMenuOpen(null);
                                  setTimeout(() => navigate(`/housekeeping/tasks/new?roomId=${getRoomId(room)}`), 50);
                                }}
                                className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#f8f9fa] flex items-center gap-2"
                              >
                                <Sparkles size={14} className="text-indigo-500" />
                                Create Task
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMenuOpen(null);
                                  setTimeout(() => navigate(`/housekeeping/assign?room=${getRoomId(room)}`), 50);
                                }}
                                className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#f8f9fa] flex items-center gap-2"
                              >
                                <User size={14} className="text-emerald-500" />
                                Assign to Staff
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setMenuOpen(null);
                                  setTimeout(() => navigate(`/rooms/details/${getRoomId(room)}`), 50);
                                }}
                                className="w-full px-4 py-2.5 text-left text-xs hover:bg-[#f8f9fa] flex items-center gap-2"
                              >
                                <Home size={14} className="text-blue-500" />
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-serif">{getRoomNumber(room)}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                        {getStatusIcon(room)}
                        {displayStatus(room)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] font-medium opacity-60">
                          <User size={12} />
                          {getRoomType(room)}
                        </div>
                        {getRoomStatus(room) && (
                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] ${getOccupancyColor(room)}`}>
                            {getOccupancyIcon(room)}
                            {getRoomStatus(room)}
                          </div>
                        )}
                      </div>
                      {getLastCleanedDisplay(room) && (
                        <div className="flex items-center gap-1 text-[10px] text-[#1a1a1a]/40">
                          <Clock size={10} />
                          {getLastCleanedDisplay(room)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
