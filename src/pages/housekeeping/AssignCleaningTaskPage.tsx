import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Search, 
  CheckCircle2, 
  Calendar,
  Info,
  Clock,
  Users,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import type { HousekeepingRoom, HousekeepingStaff } from '../../api/housekeeping';
import { format } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

export default function AssignCleaningTaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<number | ''>('');
  const [taskType, setTaskType] = useState('Standard Clean');
  const [priority, setPriority] = useState('Normal');
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [notes, setNotes] = useState('');
  const [roomSearch, setRoomSearch] = useState('');
  const [showAllRooms, setShowAllRooms] = useState(false);

  useEffect(() => {
    const roomParam = searchParams.get('room');
    const roomsParam = searchParams.get('rooms');
    if (roomParam) {
      const roomId = parseInt(roomParam, 10);
      if (!isNaN(roomId)) {
        setSelectedRooms([roomId]);
        setShowAllRooms(true);
      }
    }
    if (roomsParam) {
      const roomIds = roomsParam.split(',').map(r => parseInt(r, 10)).filter(r => !isNaN(r));
      if (roomIds.length > 0) {
        setSelectedRooms(roomIds);
        setShowAllRooms(true);
      }
    }
  }, [searchParams]);

  const { data: allRooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['housekeeping', 'rooms', showAllRooms ? 'all' : 'dirty'],
    queryFn: () => showAllRooms 
      ? housekeepingService.getRooms() 
      : housekeepingService.getDirtyRooms(),
  });

  const { data: staff, isLoading: loadingStaff } = useQuery({
    queryKey: ['housekeeping', 'staff'],
    queryFn: () => housekeepingService.getStaff(),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { roomId: number; taskType: string; assignedStaffId?: number; priority: string; scheduledDate: string; scheduledTime?: string; notes?: string }) => 
      housekeepingService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to create task');
    }
  });

  const handleBulkAssign = async () => {
    if (selectedRooms.length === 0 || selectedStaffId === null) return;
    
    let successCount = 0;
    let errorCount = 0;

    for (const roomId of selectedRooms) {
      try {
        await createTaskMutation.mutateAsync({
          roomId,
          taskType,
          assignedStaffId: selectedStaffId,
          priority,
          scheduledDate,
          scheduledTime: scheduledTime || undefined,
          notes: notes || undefined,
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    if (errorCount === 0) {
      toastSuccess(`${successCount} task(s) assigned successfully`);
      navigate('/housekeeping/tasks');
    } else {
      toastError(`${errorCount} task(s) failed to assign`);
    }
  };

  const rooms: any[] = allRooms || [];
  const staffList: any[] = staff || [];

  const filteredRooms = useMemo(() => {
    if (!roomSearch.trim()) return rooms;
    const search = roomSearch.toLowerCase();
    return rooms.filter(r => 
      (r.roomNumber || r.RoomNumber || '').toLowerCase().includes(search) ||
      (r.typeName || r.TypeName || '').toLowerCase().includes(search)
    );
  }, [rooms, roomSearch]);

  const getWorkloadColor = (tasks: number) => {
    if (tasks === 0) return 'bg-emerald-100 text-emerald-700';
    if (tasks <= 3) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const getStaffWorkload = (staffId: number) => {
    const staffMember = staffList.find(s => Number(s.employeeId || s.EmployeeID) === staffId);
    return staffMember?.activeTasks ?? staffMember?.ActiveTasks ?? 0;
  };
  
  const getSelectedStaffId = () => {
    if (assignedStaff === '' || assignedStaff === null) return null;
    const parsed = parseInt(String(assignedStaff), 10);
    if (isNaN(parsed)) return null;
    return parsed;
  };
  
  const selectedStaffId = getSelectedStaffId();
  const currentWorkload = selectedStaffId !== null ? getStaffWorkload(selectedStaffId) : 0;

  const toggleRoom = (roomId: number) => {
    const id = Number(roomId);
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const getLastCleanedDisplay = (lastCleaned: string | undefined) => {
    if (!lastCleaned) return 'Never';
    const date = new Date(lastCleaned);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return 'Just now';
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  };

  const getRoomStatus = (cleaningStatus: string | undefined) => {
    if (!cleaningStatus || cleaningStatus === 'Dirty') return 'Dirty';
    return cleaningStatus;
  };

  const estimatedTimePerTask = taskType === 'Deep Clean' ? 90 : taskType === 'Standard Clean' ? 45 : 30;
  const totalEstimatedTime = selectedRooms.length * estimatedTimePerTask;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Assign Cleaning Tasks</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Bulk assign rooms to housekeeping staff.</p>
          </div>
        </div>
        <button 
          onClick={handleBulkAssign}
          disabled={selectedRooms.length === 0 || selectedStaffId === null || createTaskMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {createTaskMutation.isPending ? (
            <>Processing...</>
          ) : selectedRooms.length === 0 ? (
            <>Select Rooms</>
          ) : selectedStaffId === null ? (
            <>Select Staff</>
          ) : (
            <><Save size={16} /> Confirm Assignment</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Select Rooms</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowAllRooms(!showAllRooms)}
                  className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${
                    showAllRooms ? 'bg-amber-100 text-amber-700' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]'
                  }`}
                >
                  {showAllRooms ? 'Showing All' : 'Show All Rooms'}
                </button>
                <span className="text-[#1a1a1a]/10">|</span>
                <button 
                  onClick={() => setSelectedRooms(filteredRooms.filter(r => !r.cleaningStatus || r.cleaningStatus === 'Dirty').map(r => r.roomId))}
                  className="text-[10px] uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700"
                >
                  Select Dirty
                </button>
                <span className="text-[#1a1a1a]/10">|</span>
                <button 
                  onClick={() => setSelectedRooms([])}
                  className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={16} />
              <input
                type="text"
                placeholder="Search by room number or type..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto">
              {loadingRooms ? (
                <p className="col-span-full text-center py-8 text-[#1a1a1a]/40">Loading rooms...</p>
              ) : filteredRooms.length === 0 ? (
                <p className="col-span-full text-center py-8 text-[#1a1a1a]/40">No rooms found</p>
              ) : (
                filteredRooms.map((room) => (
                  <button
                    key={room.roomId || room.RoomID}
                    onClick={() => toggleRoom(room.roomId || room.RoomID)}
                    className={`p-4 rounded-xl border transition-all text-left relative ${
                      selectedRooms.includes(room.roomId || room.RoomID) 
                        ? 'border-[#1a1a1a] bg-[#1a1a1a]/5 shadow-inner' 
                        : 'border-[#1a1a1a]/5 bg-white hover:border-[#1a1a1a]/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-lg font-serif">Room {room.roomNumber || room.RoomNumber}</span>
                      {selectedRooms.includes(room.roomId || room.RoomID) && (
                        <CheckCircle2 size={16} className="text-[#1a1a1a]" />
                      )}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{room.typeName || room.TypeName || 'Standard'}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        getRoomStatus(room.cleaningStatus || room.CleaningStatus) === 'Dirty' ? 'text-amber-500' : 'text-emerald-500'
                      }`}>
                        {getRoomStatus(room.cleaningStatus || room.CleaningStatus)}
                      </span>
                      <span className="text-[10px] text-[#1a1a1a]/40">{getLastCleanedDisplay(room.lastCleaned || room.LastCleaned)}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-serif">Assignment Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Assign To Staff</label>
                <select 
                  value={selectedStaffId !== null ? selectedStaffId : ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssignedStaff(val === '' ? '' : parseInt(val, 10));
                  }}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="">Select Housekeeper</option>
                  {loadingStaff ? (
                    <option value="">Loading...</option>
                  ) : staffList.length === 0 ? (
                    <option value="">No staff available</option>
                  ) : (
                    staffList.map(s => (
                      <option key={s.employeeId || s.EmployeeID} value={parseInt(String(s.employeeId || s.EmployeeID), 10)}>
                        {s.firstName || s.FirstName} {s.lastName || s.LastName} ({s.activeTasks ?? s.activeTasks ?? 0} tasks)
                      </option>
                    ))
                  )}
                </select>
                {selectedStaffId !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    <Users size={14} className="text-[#1a1a1a]/40" />
                    <span className="text-xs text-[#1a1a1a]/60">Current workload:</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getWorkloadColor(currentWorkload)}`}>
                      {currentWorkload} active task(s)
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Cleaning Type</label>
                <select 
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="Standard Clean">Full Clean (Checkout)</option>
                  <option value="Turnover">Stay-over Clean</option>
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Special Request">Special Request</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Scheduled Date</label>
                  <input 
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Scheduled Time</label>
                  <input 
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Priority Level</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Low', 'Normal', 'High', 'Urgent'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        priority === p 
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                          : 'bg-white text-[#1a1a1a]/40 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/40'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions for the housekeeper..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-[#1a1a]/5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Rooms Selected</span>
                <span className="font-medium">{selectedRooms.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Est. Total Time</span>
                <span className="font-medium">{totalEstimatedTime} mins</span>
              </div>
              {selectedStaffId !== null && selectedRooms.length > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#1a1a1a]/40">Staff Total</span>
                    <span className="font-medium">{selectedRooms.length * estimatedTimePerTask + currentWorkload * 45} mins</span>
                  </div>
                  {selectedRooms.length * estimatedTimePerTask + currentWorkload * 45 > 480 && (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle size={16} className="text-amber-600" />
                      <span className="text-xs text-amber-700">Warning: Total workload exceeds 8 hours</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <Info className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-800 leading-relaxed">
              Assigning multiple rooms to a single staff member will automatically queue them in their task list based on the priority level selected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
