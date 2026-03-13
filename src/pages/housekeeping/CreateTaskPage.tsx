import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Clock,
  AlertCircle,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import { format } from 'date-fns';
import { toastSuccess, toastError } from '../../lib/toast';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  
  const [roomId, setRoomId] = useState<number | ''>('');
  const [taskType, setTaskType] = useState('Standard Clean');
  const [assignedStaffId, setAssignedStaffId] = useState<number | ''>('');
  const [priority, setPriority] = useState('Normal');
  const [scheduledDate, setScheduledDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [scheduledTime, setScheduledTime] = useState('09:00');
  const [notes, setNotes] = useState('');

  const { data: rooms, isLoading: loadingRooms } = useQuery({
    queryKey: ['housekeeping', 'rooms', 'all'],
    queryFn: () => housekeepingService.getRooms(),
  });

  const { data: staff, isLoading: loadingStaff } = useQuery({
    queryKey: ['housekeeping', 'staff'],
    queryFn: () => housekeepingService.getStaff(),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { roomId: number; taskType: string; assignedStaffId?: number; priority: string; scheduledDate: string; scheduledTime?: string; notes?: string }) => 
      housekeepingService.createTask(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      toastSuccess('Task created successfully');
      navigate(`/housekeeping/tasks/${data.taskId}`);
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to create task');
    }
  });

  useEffect(() => {
    const roomParam = searchParams.get('roomId');
    if (roomParam) {
      const id = parseInt(roomParam, 10);
      if (!isNaN(id)) {
        setRoomId(id);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId === '') {
      toastError('Please select a room');
      return;
    }
    createTaskMutation.mutate({
      roomId: Number(roomId),
      taskType,
      assignedStaffId: assignedStaffId ? Number(assignedStaffId) : undefined,
      priority,
      scheduledDate,
      scheduledTime: scheduledTime || undefined,
      notes: notes || undefined,
    });
  };

  const selectedRoom = rooms?.find((r: any) => r.roomId === roomId || r.RoomID === roomId);
  const roomNumber = selectedRoom ? (selectedRoom.roomNumber || selectedRoom.RoomNumber) : '';

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/housekeeping/status')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-light">Create Cleaning Task</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Create a new housekeeping task for a room.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Select Room *</label>
            <select 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            >
              <option value="">Select a room...</option>
              {loadingRooms ? (
                <option value="">Loading...</option>
              ) : rooms && rooms.length > 0 ? (
                rooms.map((r: any) => (
                  <option key={r.roomId || r.RoomID} value={r.roomId || r.RoomID}>
                    Room {r.roomNumber || r.RoomNumber} - {r.typeName || r.TypeName || 'Standard'}
                  </option>
                ))
              ) : (
                <option value="">No rooms available</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Task Type</label>
            <select 
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            >
              <option value="Standard Clean">Standard Clean</option>
              <option value="Deep Clean">Deep Clean</option>
              <option value="Turnover">Turnover</option>
              <option value="Special Request">Special Request</option>
              <option value="Inspection">Inspection</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Assign To (Optional)</label>
            <select 
              value={assignedStaffId}
              onChange={(e) => setAssignedStaffId(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            >
              <option value="">Unassigned</option>
              {loadingStaff ? (
                <option value="">Loading...</option>
              ) : staff && staff.length > 0 ? (
                staff.map((s: any) => (
                  <option key={s.employeeId || s.EmployeeID} value={s.employeeId || s.EmployeeID}>
                    {s.firstName || s.FirstName} {s.lastName || s.LastName}
                  </option>
                ))
              ) : (
                <option value="">No staff available</option>
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Priority</label>
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
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Notes (Optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any special instructions..."
              rows={3}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1a1a1a]/5">
          <button 
            type="button"
            onClick={() => navigate('/housekeeping/status')}
            className="px-6 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={createTaskMutation.isPending || roomId === ''}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createTaskMutation.isPending ? (
              <>Processing...</>
            ) : (
              <><Save size={16} /> Create Task</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
