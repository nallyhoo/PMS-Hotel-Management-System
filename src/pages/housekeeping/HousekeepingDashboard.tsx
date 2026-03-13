import React from 'react';
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import housekeepingService, { HousekeepingStaff } from '../../api/housekeeping';
import type { HousekeepingTask } from '../../types/database';

interface TaskWithDetails extends HousekeepingTask {
  roomNumber?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
}

interface StaffWithTasks extends HousekeepingStaff {
  status: 'Active' | 'Busy' | 'Break';
}

export default function HousekeepingDashboard() {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['housekeeping', 'dashboard'],
    queryFn: () => housekeepingService.getDashboard(),
  });

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Something went wrong: {(error as Error).message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#1a1a1a]/40">Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Total Rooms', value: dashboardData?.stats?.totalRooms || 0, icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Dirty Rooms', value: dashboardData?.stats?.dirtyRooms || 0, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'In Progress', value: dashboardData?.stats?.inProgress || 0, icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Clean & Ready', value: dashboardData?.stats?.cleanAndReady || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentTasks: TaskWithDetails[] = dashboardData?.activeTasks || [];
  const staffOnDuty: StaffWithTasks[] = (dashboardData?.staffOnDuty || []).map((s: any, idx: number) => ({
    ...s,
    employeeId: s.employeeId || s.EmployeeID,
    firstName: s.firstName || s.FirstName,
    lastName: s.lastName || s.LastName,
    position: s.position || s.Position,
    activeTasks: s.activeTasks ?? s.ActiveTasks ?? 0,
    status: idx === 2 ? 'Break' : ((s.activeTasks ?? s.ActiveTasks ?? 0) > 2) ? 'Busy' : 'Active',
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Housekeeping Overview</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Monitor cleaning operations and staff efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/housekeeping/assign')}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <UserPlus size={16} /> Assign Tasks
          </button>
          <button 
            onClick={() => navigate('/housekeeping/status')}
            className="flex items-center gap-2 px-6 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <Sparkles size={16} /> Status Board
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{stat.label}</p>
            <p className="text-3xl font-serif">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif">Active Cleaning Tasks</h2>
            <button 
              onClick={() => navigate('/housekeeping/tasks')}
              className="text-xs font-medium text-[#1a1a1a]/40 hover:text-[#1a1a1a] flex items-center gap-1"
            >
              View All Tasks <ArrowRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Task Type</th>
                  <th className="px-6 py-4">Staff</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {recentTasks.map((task) => {
                  const taskAny = task as any;
                  const roomNum = taskAny.roomNumber || taskAny.RoomNumber || `ID: ${taskAny.roomId || taskAny.RoomID}`;
                  const firstName = taskAny.firstName || taskAny.FirstName;
                  const lastName = taskAny.lastName || taskAny.LastName;
                  const taskType = taskAny.taskType || taskAny.TaskType;
                  const taskIdValue = taskAny.TaskID || taskAny.taskId || taskAny.TaskID;
                  const priority = taskAny.priority || taskAny.Priority || 'Normal';
                  const status = taskAny.status || taskAny.Status || 'Pending';
                  return (
                  <tr 
                    key={taskIdValue} 
                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                    onClick={() => navigate(`/housekeeping/tasks/${taskIdValue}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">Room {roomNum}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#1a1a1a]/60">{taskType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-bold">
                          {firstName && lastName ? `${firstName[0]}${lastName[0]}` : '-'}
                        </div>
                        <p className="text-xs font-medium">{firstName && lastName ? `${firstName} ${lastName}` : 'Unassigned'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        priority === 'Urgent' || priority === 'High' ? 'bg-red-50 text-red-600' : 
                        priority === 'Normal' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                        status === 'In Progress' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-600'
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]">
                        <ArrowRight size={16} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Availability */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif">Staff on Duty</h2>
            <button 
              onClick={() => navigate('/housekeeping/schedule')}
              className="text-xs font-medium text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
            >
              Schedule
            </button>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
            {staffOnDuty.length > 0 ? (
              <>
                {staffOnDuty.slice(0, 4).map((staff) => {
                  const staffAny = staff as any;
                  const firstName = staffAny.firstName || staffAny.FirstName || '';
                  const lastName = staffAny.lastName || staffAny.LastName || '';
                  const position = staffAny.position || staffAny.Position || 'Housekeeper';
                  const activeTasks = staffAny.activeTasks ?? 0;
                  const empId = staffAny.employeeId || staffAny.EmployeeID;
                  
                  return (
                  <div key={empId} className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-[#f8f9fa] transition-colors cursor-pointer" onClick={() => navigate(`/housekeeping/schedule`)}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] text-white flex items-center justify-center text-xs font-bold">
                        {firstName && lastName ? `${firstName[0]}${lastName[0]}` : 'HK'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{firstName} {lastName}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                        staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                        staff.status === 'Busy' ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                      }`}>
                        {staff.status}
                      </span>
                      <p className="text-[10px] text-[#1a1a1a]/40 mt-1">{activeTasks} tasks</p>
                    </div>
                  </div>
                );
                })}
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[#f8f9fa] flex items-center justify-center mx-auto mb-3">
                  <UserPlus size={20} className="text-[#1a1a1a]/30" />
                </div>
                <p className="text-sm text-[#1a1a1a]/40">No staff on duty</p>
                <button 
                  onClick={() => navigate('/housekeeping/schedule')}
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                >
                  Assign shifts
                </button>
              </div>
            )}
            {staffOnDuty.length > 4 && (
              <button 
                onClick={() => navigate('/housekeeping/schedule')}
                className="w-full py-2 text-xs text-[#1a1a1a]/60 hover:text-[#1a1a1a] text-center border-t border-[#1a1a1a]/5 pt-4 mt-2"
              >
                View all {staffOnDuty.length} staff →
              </button>
            )}
            <button 
              onClick={() => navigate('/housekeeping/schedule')}
              className="w-full py-3 border border-dashed border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/40 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all"
            >
              Manage Staff
            </button>
          </div>

          {/* Quick Reports */}
          <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-3">
              <BarChart3 size={20} className="text-indigo-400" />
              <h3 className="text-sm font-medium">Daily Performance</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-white/40">
                <span>Cleaning Efficiency</span>
                <span>92%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-400 w-[92%]" />
              </div>
            </div>
            <button 
              onClick={() => navigate('/housekeeping/reports')}
              className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-colors"
            >
              View Detailed Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
