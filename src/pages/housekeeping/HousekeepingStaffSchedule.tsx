import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus, 
  ArrowLeft,
  Filter,
  Download,
  X,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format, addDays, startOfWeek, subDays } from 'date-fns';
import housekeepingService from '../../api/housekeeping';

interface ScheduleShift {
  scheduleId: number;
  employeeId: number;
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  status: string;
  firstName: string;
  lastName: string;
  position: string;
}

const SHIFT_TYPES = [
  { value: 'Morning', label: 'Morning', time: '08:00 - 16:00' },
  { value: 'Afternoon', label: 'Afternoon', time: '14:00 - 22:00' },
  { value: 'Night', label: 'Night', time: '22:00 - 06:00' },
  { value: 'OFF', label: 'OFF', time: '-' },
];

export default function HousekeepingStaffSchedule() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ employeeId: number; date: string } | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));
  const weekLabel = `${format(weekStart, 'MMM d')} - ${format(addDays(weekStart, 6), 'MMM d, yyyy')}`;

  const { data: staffData } = useQuery({
    queryKey: ['housekeeping', 'staff'],
    queryFn: () => housekeepingService.getStaff(),
  });

  const { data: schedulesData, isLoading } = useQuery({
    queryKey: ['housekeeping', 'schedule', weekDays[0], weekDays[6]],
    queryFn: () => housekeepingService.getSchedule({ 
      startDate: weekDays[0], 
      endDate: weekDays[6] 
    }),
  });

  const { data: shiftsData } = useQuery({
    queryKey: ['housekeeping', 'shifts', currentDate.toISOString()],
    queryFn: () => housekeepingService.getShifts(currentDate.toISOString().split('T')[0]),
  });

  const staff = (staffData || []).map((s: any) => ({
    ...s,
    employeeId: s.employeeId || s.EmployeeID,
    firstName: s.firstName || s.FirstName,
    lastName: s.lastName || s.LastName,
    position: s.position || s.Position || 'Housekeeper',
    activeTasks: s.activeTasks ?? s.ActiveTasks ?? 0,
  }));
  const schedules: ScheduleShift[] = (schedulesData || []).map((s: any) => ({
    ...s,
    employeeId: s.employeeId || s.EmployeeID,
    scheduleId: s.scheduleId || s.ScheduleID,
    firstName: s.firstName || s.FirstName,
    lastName: s.lastName || s.LastName,
    shiftType: s.shiftType || s.ShiftType,
    shiftDate: s.shiftDate || s.ShiftDate,
    startTime: s.startTime || s.StartTime,
    endTime: s.endTime || s.EndTime,
    status: s.status || s.Status,
  }));

  const createScheduleMutation = useMutation({
    mutationFn: (data: { employeeId: number; shiftDate: string; shiftType: string; startTime: string; endTime: string }) => 
      housekeepingService.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping', 'schedule'] });
      setShowAddModal(false);
      setSelectedCell(null);
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: number) => housekeepingService.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping', 'schedule'] });
    },
  });

  const getShiftForDay = (employeeId: number, date: string) => {
    return schedules.find(s => Number(s.employeeId) === Number(employeeId) && s.shiftDate === date);
  };

  const handlePrevWeek = () => setCurrentDate(subDays(weekStart, 7));
  const handleNextWeek = () => setCurrentDate(addDays(weekStart, 7));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleCellClick = (employeeId: number, date: string) => {
    setSelectedCell({ employeeId, date });
    setShowAddModal(true);
  };

  const handleAddShift = (shiftType: string) => {
    if (!selectedCell) return;
    
    const shiftInfo = SHIFT_TYPES.find(s => s.value === shiftType);
    if (!shiftInfo || shiftType === 'OFF') {
      setShowAddModal(false);
      setSelectedCell(null);
      return;
    }

    const [start, end] = shiftInfo.time.split(' - ');
    createScheduleMutation.mutate({
      employeeId: selectedCell.employeeId,
      shiftDate: selectedCell.date,
      shiftType,
      startTime: start,
      endTime: end,
    });
  };

  const getShiftDisplay = (shift: ScheduleShift | undefined) => {
    if (!shift) return null;
    if (shift.shiftType === 'OFF') return 'OFF';
    return `${shift.startTime?.slice(0, 5)} - ${shift.endTime?.slice(0, 5)}`;
  };

  return (
    <div className="space-y-8">
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Add Shift</h3>
              <button onClick={() => { setShowAddModal(false); setSelectedCell(null); }}>
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-[#1a1a1a]/60">
              {selectedCell && `Date: ${format(new Date(selectedCell.date), 'EEEE, MMM d, yyyy')}`}
            </p>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-widest font-bold text-[#1a1a1a]/40">Select Shift</p>
              <div className="grid grid-cols-2 gap-2">
                {SHIFT_TYPES.map((shift) => (
                  <button
                    key={shift.value}
                    onClick={() => handleAddShift(shift.value)}
                    className="p-3 border border-[#1a1a1a]/10 rounded-xl text-left hover:border-[#1a1a1a]/30 transition-all"
                  >
                    <p className="text-sm font-medium">{shift.label}</p>
                    <p className="text-[10px] text-[#1a1a1a]/40">{shift.time}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Staff Schedule</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Manage housekeeping shifts and availability.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/housekeeping/assign')}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <Plus size={14} /> Assign Tasks
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Download size={14} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <Plus size={16} /> Add Shift
          </button>
        </div>
      </div>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Total Staff</p>
          <p className="text-2xl font-serif">{staff.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">On Duty Today</p>
          <p className="text-2xl font-serif">
            {staff.filter(s => {
              const today = new Date().toISOString().split('T')[0];
              const shift = schedules.find(sc => Number(sc.employeeId) === Number(s.employeeId) && sc.shiftDate === today);
              return shift && shift.shiftType !== 'OFF';
            }).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Active Tasks</p>
          <p className="text-2xl font-serif">
            {staff.reduce((sum, s) => sum + (s.activeTasks || 0), 0)}
          </p>
        </div>
      </div>

      {/* Week Selector */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={handlePrevWeek} className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar size={18} className="text-[#1a1a1a]/40" />
            {weekLabel}
          </div>
          <button onClick={handleNextWeek} className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"><ChevronRight size={20} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-[10px] uppercase tracking-widest font-bold">Week</button>
          <button className="px-4 py-1.5 hover:bg-[#f8f9fa] rounded-lg text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Month</button>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 text-center">
          <p className="text-[#1a1a1a]/40">Loading schedule...</p>
        </div>
      ) : (
        /* Schedule Table */
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                  <th className="px-6 py-4 min-w-[200px]">Staff Member</th>
                  {weekDays.map((date, idx) => (
                    <th key={idx} className="px-4 py-4 min-w-[120px] text-center">
                      <div>{days[idx]}</div>
                      <div className="text-[8px] font-normal">{format(new Date(date), 'MMM d')}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {staff.map((member) => (
                  <tr key={member.employeeId} className="hover:bg-[#f8f9fa] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                          {member.firstName?.[0]}{member.lastName?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{member.firstName} {member.lastName}</p>
                          <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{member.position || 'Housekeeper'}</p>
                        </div>
                      </div>
                    </td>
                    {weekDays.map((date, idx) => {
                      const shift = getShiftForDay(member.employeeId, date);
                      return (
                        <td key={idx} className="px-2 py-2">
                          <button
                            onClick={() => handleCellClick(member.employeeId, date)}
                            className="w-full"
                          >
                            {shift ? (
                              shift.shiftType === 'OFF' ? (
                                <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-center">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">OFF</span>
                                </div>
                              ) : (
                                <div className="bg-white border border-[#1a1a1a]/5 rounded-xl p-2 text-center shadow-sm group-hover:border-[#1a1a1a]/20 transition-all relative">
                                  {shift.status === 'Cancelled' && (
                                    <div className="absolute inset-0 bg-red-50/50 rounded-xl flex items-center justify-center">
                                      <Trash2 size={12} className="text-red-400" />
                                    </div>
                                  )}
                                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#1a1a1a]/60">
                                    <Clock size={10} /> {getShiftDisplay(shift)}
                                  </div>
                                </div>
                              )
                            ) : (
                              <div className="h-10 border border-dashed border-[#1a1a1a]/10 rounded-xl hover:border-[#1a1a1a]/30 hover:bg-[#f8f9fa] transition-all flex items-center justify-center">
                                <Plus size={12} className="text-[#1a1a1a]/20" />
                              </div>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
