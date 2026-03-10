import React from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { mockRooms } from '../../data/mockRooms';

const maintenanceTasks = [
  { id: 'MT-001', room: '302', type: 'Plumbing', priority: 'High', status: 'In Progress', assignedTo: 'John Smith', date: '2026-03-09' },
  { id: 'MT-002', room: '105', type: 'Electrical', priority: 'Medium', status: 'Pending', assignedTo: 'Sarah Lee', date: '2026-03-10' },
  { id: 'MT-003', room: '202', type: 'HVAC', priority: 'Low', status: 'Completed', assignedTo: 'Mike Ross', date: '2026-03-08' },
  { id: 'MT-004', room: 'P01', type: 'General', priority: 'High', status: 'Pending', assignedTo: 'John Smith', date: '2026-03-10' },
];

export default function RoomMaintenancePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Room Maintenance</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Track and manage room repairs and maintenance tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Plus size={14} />
            New Request
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Active Requests</p>
            <p className="text-2xl font-serif">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Pending Approval</p>
            <p className="text-2xl font-serif">5</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Completed Today</p>
            <p className="text-2xl font-serif">8</p>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-serif">Maintenance Task List</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={14} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="pl-9 pr-4 py-1.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-xs focus:outline-none w-48"
              />
            </div>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
              <Filter size={14} className="text-[#1a1a1a]/60" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Task ID</th>
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {maintenanceTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-medium text-[#1a1a1a]/60">{task.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">Room {task.room}</td>
                  <td className="px-6 py-4 text-xs text-[#1a1a1a]/60">{task.type}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        task.status === 'Completed' ? 'bg-emerald-500' : 
                        task.status === 'In Progress' ? 'bg-blue-500' : 
                        'bg-amber-500'
                      }`}></div>
                      <span className="text-xs font-medium">{task.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#1a1a1a]/60">{task.assignedTo}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/40">
                      <MoreVertical size={16} />
                    </button>
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
