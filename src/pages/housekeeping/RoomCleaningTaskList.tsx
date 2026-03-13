import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowRight,
  LayoutGrid,
  List,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import type { HousekeepingTask } from '../../types/database';

interface TaskWithDetails extends HousekeepingTask {
  roomNumber?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
}

export default function RoomCleaningTaskList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['housekeeping', 'tasks', statusFilter, priorityFilter],
    queryFn: () => housekeepingService.getTasks(
      statusFilter || priorityFilter ? { 
        status: statusFilter || undefined,
        priority: priorityFilter || undefined
      } : undefined
    ),
  });

  const tasks: TaskWithDetails[] = tasksData || [];

  const filteredTasks = tasks.filter(task => {
    const taskAny = task as any;
    const roomNum = taskAny.roomNumber || taskAny.RoomNumber || '';
    const firstName = taskAny.firstName || taskAny.FirstName || '';
    const lastName = taskAny.lastName || taskAny.LastName || '';
    
    if (!searchQuery) return true;
    const search = searchQuery.toLowerCase();
    return (
      roomNum.toLowerCase().includes(search) ||
      firstName.toLowerCase().includes(search) ||
      lastName.toLowerCase().includes(search)
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600';
      case 'In Progress': return 'bg-indigo-50 text-indigo-600';
      case 'Verified': return 'bg-green-50 text-green-600';
      case 'Cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
      case 'High': return 'bg-red-50 text-red-600';
      case 'Normal': return 'bg-amber-50 text-amber-600';
      default: return 'bg-blue-50 text-blue-600';
    }
  };

  const getTaskTypeLabel = (taskType: string) => {
    const labels: Record<string, string> = {
      'Standard Clean': 'Standard',
      'Deep Clean': 'Deep Clean',
      'Turnover': 'Turnover',
      'Inspection': 'Inspection',
      'Special Request': 'Special'
    };
    return labels[taskType] || taskType;
  };

  const formatTime = (time: string | null | undefined) => {
    if (!time) return '-';
    return time;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Cleaning Tasks</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Manage and track daily room cleaning operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-[#1a1a1a]/10 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]/40 hover:bg-[#f8f9fa]'}`}
            >
              <List size={18} />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#1a1a1a] text-white' : 'text-[#1a1a1a]/40 hover:bg-[#f8f9fa]'}`}
            >
              <LayoutGrid size={18} />
            </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Download size={16} /> Export List
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input 
            type="text" 
            placeholder="Search by room number or staff name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-1 focus:ring-[#1a1a1a]/10 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa] bg-white"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Verified">Verified</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa] bg-white"
          >
            <option value="">All Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 text-center">
          <p className="text-[#1a1a1a]/40">Loading tasks...</p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Assigned To</th>
                  <th className="px-6 py-4">Start Time</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/5">
                {filteredTasks.map((task) => {
                  const taskAny = task as any;
                  const roomNum = taskAny.roomNumber || taskAny.RoomNumber || taskAny.roomId || taskAny.RoomID;
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
                      <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">TSK-{taskIdValue}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#1a1a1a]/60">{getTaskTypeLabel(taskType)}</p>
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
                      <p className="text-xs text-[#1a1a1a]/60">{formatTime(taskAny.scheduledTime || taskAny.ScheduledTime || taskAny.startTime || taskAny.StartTime)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(priority)}`}>
                        {priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTasks.map((task) => {
            const taskAny = task as any;
            const roomNum = taskAny.roomNumber || taskAny.RoomNumber || taskAny.roomId || taskAny.RoomID;
            const firstName = taskAny.firstName || taskAny.FirstName;
            const lastName = taskAny.lastName || taskAny.LastName;
            const taskType = taskAny.taskType || taskAny.TaskType;
            const taskIdValue = taskAny.TaskID || taskAny.taskId || taskAny.TaskID;
            const priority = taskAny.priority || taskAny.Priority || 'Normal';
            const status = taskAny.status || taskAny.Status || 'Pending';
            return (
            <div 
              key={taskIdValue}
              onClick={() => navigate(`/housekeeping/tasks/${taskIdValue}`)}
              className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm hover:border-[#1a1a1a]/20 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-serif">Room {roomNum}</h3>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">TSK-{taskIdValue}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Type</span>
                  <span className="font-medium">{getTaskTypeLabel(taskType)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Staff</span>
                  <span className="font-medium">{firstName && lastName ? `${firstName} ${lastName}` : 'Unassigned'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Priority</span>
                  <span className={`font-bold uppercase tracking-widest ${getPriorityColor(priority).replace('bg-', 'text-').split(' ')[1]}`}>{priority}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">
                  {taskAny.startTime || taskAny.StartTime ? formatTime(taskAny.startTime || taskAny.StartTime) : 'Not started'}
                </div>
                <button className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
