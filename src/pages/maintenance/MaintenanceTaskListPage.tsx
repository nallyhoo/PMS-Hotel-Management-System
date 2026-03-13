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
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';

export default function MaintenanceTaskListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const { data: requestsData, isLoading } = useQuery({
    queryKey: ['maintenance', 'requests', statusFilter, priorityFilter, categoryFilter],
    queryFn: () => maintenanceService.getRequests({
      status: statusFilter || undefined,
      priority: priorityFilter || undefined,
    }),
  });

  const requests = requestsData || [];

  const filteredRequests = requests.filter((r: any) => {
    const searchLower = searchTerm.toLowerCase();
    const requestId = String(r.RequestID || r.requestId || '');
    const roomNum = String(r.RoomNumber || r.roomNumber || '');
    const issue = String(r.RequestType || r.requestType || '');
    
    return !searchTerm || 
      requestId.toLowerCase().includes(searchLower) ||
      roomNum.toLowerCase().includes(searchLower) ||
      issue.toLowerCase().includes(searchLower);
  });

  const formatStatus = (status: string) => status || 'Pending';
  const formatPriority = (priority: string) => priority || 'Normal';

  const getPriorityColor = (priority: string) => {
    const p = formatPriority(priority).toLowerCase();
    if (p === 'urgent' || p === 'high') return 'bg-red-50 text-red-600';
    if (p === 'medium') return 'bg-amber-50 text-amber-600';
    return 'bg-blue-50 text-blue-600';
  };

  const getStatusColor = (status: string) => {
    const s = formatStatus(status).toLowerCase();
    if (s === 'completed') return 'bg-emerald-50 text-emerald-600';
    if (s === 'in progress') return 'bg-indigo-50 text-indigo-600';
    if (s === 'pending') return 'bg-slate-50 text-slate-600';
    return 'bg-slate-50 text-slate-600';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a] mx-auto"></div>
        <p className="mt-4 text-[#1a1a1a]/40">Loading tasks...</p>
      </div>
    );
  }

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
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0"
          >
            <option value="">All Types</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="HVAC">HVAC</option>
            <option value="General">General</option>
          </select>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0"
          >
            <option value="">All Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f9fa]">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">ID</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Location</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Issue</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Category</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Priority</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Assigned To</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Reported</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredRequests.length > 0 ? filteredRequests.map((request: any) => (
                <tr 
                  key={request.RequestID || request.requestId}
                  className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                  onClick={() => navigate(`/maintenance/tasks/${request.RequestID || request.requestId}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">MNT-{request.RequestID || request.requestId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#1a1a1a]/30" />
                      <span className="text-sm">Room {request.RoomNumber || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{request.RequestType || request.requestType || '-'}</span>
                    {request.Description && (
                      <p className="text-xs text-[#1a1a1a]/40 truncate max-w-[200px]">{request.Description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{request.RequestType || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(request.Priority || request.priority)}`}>
                      {formatPriority(request.Priority || request.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(request.Status || request.status)}`}>
                      {formatStatus(request.Status || request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">
                      {request.AssignedToFirstName ? `${request.AssignedToFirstName} ${request.AssignedToLastName || ''}` : 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/40">
                      {request.ReportedDate ? new Date(request.ReportedDate).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={16} className="text-[#1a1a1a]/30" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Wrench size={32} className="text-[#1a1a1a]/20" />
                      <p className="text-[#1a1a1a]/40">No maintenance tasks found</p>
                      <button 
                        onClick={() => navigate('/maintenance/request')}
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        Create new request
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
