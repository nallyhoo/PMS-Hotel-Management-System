import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  User,
  LayoutGrid,
  List,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CleaningTask {
  id: string;
  room: string;
  type: 'Full Clean' | 'Stay-over' | 'Deep Clean' | 'Touch-up';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Delayed';
  priority: 'High' | 'Medium' | 'Low';
  assignedTo: string;
  startTime: string;
  estimatedTime: string;
}

const mockTasks: CleaningTask[] = [
  { id: 'TSK-101', room: '402', type: 'Full Clean', status: 'In Progress', priority: 'High', assignedTo: 'Maria G.', startTime: '09:30 AM', estimatedTime: '45 min' },
  { id: 'TSK-102', room: '105', type: 'Stay-over', status: 'Pending', priority: 'Medium', assignedTo: 'John D.', startTime: '-', estimatedTime: '20 min' },
  { id: 'TSK-103', room: 'Suite 2', type: 'Deep Clean', status: 'Completed', priority: 'High', assignedTo: 'Elena R.', startTime: '08:00 AM', estimatedTime: '120 min' },
  { id: 'TSK-104', room: '308', type: 'Full Clean', status: 'In Progress', priority: 'Low', assignedTo: 'Marcus C.', startTime: '10:15 AM', estimatedTime: '40 min' },
  { id: 'TSK-105', room: '215', type: 'Touch-up', status: 'Pending', priority: 'Medium', assignedTo: 'Maria G.', startTime: '-', estimatedTime: '15 min' },
  { id: 'TSK-106', room: '501', type: 'Full Clean', status: 'Delayed', priority: 'High', assignedTo: 'John D.', startTime: '-', estimatedTime: '45 min' },
];

export default function RoomCleaningTaskList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600';
      case 'In Progress': return 'bg-indigo-50 text-indigo-600';
      case 'Delayed': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
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
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm focus:ring-1 focus:ring-[#1a1a1a]/10 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa]">
            <Filter size={14} /> Status
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium text-[#1a1a1a]/60 hover:bg-[#f8f9fa]">
            Priority
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
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
                {mockTasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="hover:bg-[#f8f9fa] transition-colors cursor-pointer group"
                    onClick={() => navigate(`/housekeeping/tasks/${task.id}`)}
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium">Room {task.room}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{task.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#1a1a1a]/60">{task.type}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-bold">
                          {task.assignedTo.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-xs font-medium">{task.assignedTo}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-[#1a1a1a]/60">{task.startTime}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${
                        task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]">
                        <ArrowRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockTasks.map((task) => (
            <div 
              key={task.id}
              onClick={() => navigate(`/housekeeping/tasks/${task.id}`)}
              className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm hover:border-[#1a1a1a]/20 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-serif">Room {task.room}</h3>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{task.id}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Type</span>
                  <span className="font-medium">{task.type}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Staff</span>
                  <span className="font-medium">{task.assignedTo}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1a1a1a]/40">Priority</span>
                  <span className={`font-bold uppercase tracking-widest ${
                    task.priority === 'High' ? 'text-red-500' : 
                    task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'
                  }`}>{task.priority}</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">
                  <Clock size={12} /> {task.startTime === '-' ? 'Not started' : task.startTime}
                </div>
                <button className="text-[#1a1a1a]/40 group-hover:text-[#1a1a1a] transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
