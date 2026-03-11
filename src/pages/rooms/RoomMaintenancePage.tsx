import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2,
  MoreVertical,
  X,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';
import roomService from '../../api/rooms';
import staffService from '../../api/staff';
import { Select2 } from '../../components/Select2';

export default function RoomMaintenancePage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [assignRequest, setAssignRequest] = useState<any>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenanceRequests', statusFilter, priorityFilter],
    queryFn: () => maintenanceService.getRequests({
      status: statusFilter === 'All' ? undefined : statusFilter,
      priority: priorityFilter === 'All' ? undefined : priorityFilter,
    }),
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const activeCount = requests?.filter(r => r.Status === 'Pending' || r.Status === 'In Progress').length || 0;
  const pendingCount = requests?.filter(r => r.Status === 'Pending').length || 0;
  const completedCount = requests?.filter(r => r.Status === 'Completed').length || 0;

  const filteredRequests = requests?.filter((req: any) => {
    const roomNum = req.RoomNumber || '';
    const type = req.RequestType || '';
    return roomNum.includes(searchTerm) || type.toLowerCase().includes(searchTerm.toLowerCase());
  }) || [];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'In Progress': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Cancelled': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-amber-600 bg-amber-50';
      case 'Low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Room Maintenance</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Track and manage room repairs and maintenance tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
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
            <p className="text-2xl font-serif">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Pending Approval</p>
            <p className="text-2xl font-serif">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Completed</p>
            <p className="text-2xl font-serif">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl flex-1">
          <Search size={16} className="text-[#1a1a1a]/30" />
          <input
            type="text"
            placeholder="Search by room or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs flex-1"
          />
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
          <Filter size={16} className="text-[#1a1a1a]/30" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs font-medium"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl">
          <Wrench size={16} className="text-[#1a1a1a]/30" />
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs font-medium"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Room</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Reported</th>
                <th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">Loading...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No maintenance requests found</td>
                </tr>
              ) : (
                filteredRequests.map((request: any) => (
                  <tr key={request.RequestID} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">Room {request.RoomNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[#1a1a1a]/60">{request.RequestType}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${getPriorityStyles(request.Priority)}`}>
                        {request.Priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusStyles(request.Status)}`}>
                        {request.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[#1a1a1a]/60">{request.ReportedDate ? new Date(request.ReportedDate).toLocaleDateString() : '-'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-[#1a1a1a]/60">
                        {request.AssignedToFirstName 
                          ? `${request.AssignedToFirstName} ${request.AssignedToLastName || ''}`
                          : request.ReportedByName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {!request.AssignedToFirstName && (
                          <button 
                            onClick={() => setAssignRequest(request)}
                            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60"
                            title="Assign Staff"
                          >
                            <UserPlus size={16} />
                          </button>
                        )}
                        <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors text-[#1a1a1a]/60">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <CreateMaintenanceModal 
          rooms={rooms || []} 
          onClose={() => setShowCreateModal(false)} 
        />
      )}

      {/* Assign Staff Modal */}
      {assignRequest && (
        <AssignStaffModal 
          request={assignRequest}
          onClose={() => setAssignRequest(null)}
        />
      )}
    </div>
  );
}

function CreateMaintenanceModal({ rooms, onClose }: { rooms: any[]; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    roomId: '',
    requestType: 'Plumbing',
    priority: 'Normal',
    description: '',
    scheduledDate: '',
    estimatedCost: '',
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => maintenanceService.createRequest({
      roomId: Number(data.roomId),
      requestType: data.requestType,
      priority: data.priority,
      description: data.description,
      scheduledDate: data.scheduledDate || undefined,
      estimatedCost: data.estimatedCost ? Number(data.estimatedCost) : undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRequests'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId || !formData.description) return;
    createMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif">New Maintenance Request</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f9fa] rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Room *</label>
            <div className="mt-1">
              <Select2
                value={formData.roomId}
                onChange={(value) => setFormData({ ...formData, roomId: String(value || '') })}
                options={rooms.map((room: any) => ({
                  value: room.roomId,
                  label: `Room ${room.roomNumber} - ${room.roomTypeName || `Type ${room.roomTypeId}`}`
                }))}
                placeholder="Select Room"
                allowClear
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Type</label>
              <div className="mt-1">
                <Select2
                  value={formData.requestType}
                  onChange={(value) => setFormData({ ...formData, requestType: String(value || 'Plumbing') })}
                  options={[
                    { value: 'Plumbing', label: 'Plumbing' },
                    { value: 'Electrical', label: 'Electrical' },
                    { value: 'HVAC', label: 'HVAC' },
                    { value: 'Furniture', label: 'Furniture' },
                    { value: 'General', label: 'General' },
                    { value: 'Other', label: 'Other' },
                  ]}
                  allowClear={false}
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Priority</label>
              <div className="mt-1">
                <Select2
                  value={formData.priority}
                  onChange={(value) => setFormData({ ...formData, priority: String(value || 'Normal') })}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Normal', label: 'Normal' },
                    { value: 'High', label: 'High' },
                    { value: 'Urgent', label: 'Urgent' },
                  ]}
                  allowClear={false}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1 resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Scheduled Date</label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Est. Cost ($)</label>
              <input
                type="number"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AssignStaffModal({ request, onClose }: { request: any; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [selectedStaffId, setSelectedStaffId] = useState('');

  const { data: staff } = useQuery({
    queryKey: ['staff', 'maintenance'],
    queryFn: () => staffService.getEmployees(),
  });

  const assignMutation = useMutation({
    mutationFn: (staffId: number) => maintenanceService.createTask({
      requestId: request.RequestID,
      assignedStaffId: staffId,
      startDate: new Date().toISOString().split('T')[0],
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenanceRequests'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;
    assignMutation.mutate(Number(selectedStaffId));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif">Assign Staff</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f9fa] rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 p-4 bg-[#f8f9fa] rounded-xl">
          <p className="text-xs text-[#1a1a1a]/60">Room {request.RoomNumber}</p>
          <p className="text-sm font-medium">{request.RequestType}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Select Staff Member *</label>
            <div className="mt-1">
              <Select2
                value={selectedStaffId}
                onChange={(value) => setSelectedStaffId(String(value || ''))}
                options={staff?.map((s: any) => ({
                  value: s.EmployeeID,
                  label: `${s.FirstName} ${s.LastName} - ${s.Position || 'Staff'}`
                })) || []}
                placeholder="Select Staff"
                allowClear
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assignMutation.isPending || !selectedStaffId}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
            >
              {assignMutation.isPending ? 'Assigning...' : 'Assign Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
