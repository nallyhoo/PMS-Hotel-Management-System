import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Wrench, 
  MapPin, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const tasks = [
  { id: 'MNT-2041', location: 'Room 402', issue: 'AC Leaking', category: 'HVAC', priority: 'High', status: 'In Progress', assignedTo: 'David K.', reportedAt: '2024-03-09 09:30 AM' },
  { id: 'MNT-2042', location: 'Lobby', issue: 'Light Bulb Out', category: 'General', priority: 'Low', status: 'Pending', assignedTo: 'Unassigned', reportedAt: '2024-03-09 10:30 AM' },
  { id: 'MNT-2043', location: 'Pool Area', issue: 'Filter Cleaning', category: 'General', priority: 'Medium', status: 'Completed', assignedTo: 'Sarah M.', reportedAt: '2024-03-08 02:00 PM' },
  { id: 'MNT-2044', location: 'Room 105', issue: 'Door Lock Jammed', category: 'General', priority: 'High', status: 'In Progress', assignedTo: 'David K.', reportedAt: '2024-03-09 11:00 AM' },
  { id: 'MNT-2045', location: 'Room 305', issue: 'Shower Drain Clogged', category: 'Plumbing', priority: 'High', status: 'Pending', assignedTo: 'Unassigned', reportedAt: '2024-03-09 11:15 AM' },
  { id: 'MNT-2046', location: 'Kitchen', issue: 'Oven Not Heating', category: 'Electrical', priority: 'High', status: 'Pending', assignedTo: 'Unassigned', reportedAt: '2024-03-09 11:45 AM' },
  { id: 'MNT-2047', location: 'Gym', issue: 'Treadmill Squeaking', category: 'General', priority: 'Medium', status: 'Pending', assignedTo: 'Unassigned', reportedAt: '2024-03-09 12:00 PM' },
];

export default function MaintenanceTaskListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Maintenance Tasks</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">View and manage all maintenance work orders</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Export
          </button>
          <button 
            onClick={() => navigate('/maintenance/request')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search by task ID, location, or issue..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Categories</option>
            <option>HVAC</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>General</option>
          </select>
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Task ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Issue & Location</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Priority</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Assigned To</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {tasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer"
                  onClick={() => navigate(`/maintenance/tasks/${task.id}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#1a1a1a]">{task.id}</span>
                    <p className="text-[10px] text-[#1a1a1a]/40 mt-0.5">{task.reportedAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{task.issue}</span>
                      <div className="flex items-center gap-1 text-xs text-[#1a1a1a]/40 mt-1">
                        <MapPin size={12} />
                        {task.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                      <Wrench size={14} className="text-[#1a1a1a]/30" />
                      {task.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
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
                        'bg-gray-400'
                      }`}></div>
                      <span className="text-sm font-medium text-[#1a1a1a]/80">{task.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#f8f9fa] border border-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-serif italic">
                        {task.assignedTo === 'Unassigned' ? '?' : task.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm text-[#1a1a1a]/60">{task.assignedTo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors">
                      <MoreHorizontal size={18} className="text-[#1a1a1a]/40" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-sm text-[#1a1a1a]/40">Showing 1 to 7 of 42 tasks</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] text-white rounded-lg text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f8f9fa] rounded-lg text-sm font-medium">2</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f8f9fa] rounded-lg text-sm font-medium">3</button>
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
