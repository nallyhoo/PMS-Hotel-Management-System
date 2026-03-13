import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Wrench, 
  MapPin, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar, 
  CheckCircle2, 
  Play,
  DollarSign,
  History,
  UserPlus
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';
import { toastSuccess, toastError } from '../../lib/toast';

export default function MaintenanceTaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const requestId = id ? parseInt(id, 10) : null;

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [actualCost, setActualCost] = useState('');

  const { data: requestData, isLoading, refetch } = useQuery({
    queryKey: ['maintenance', 'request', requestId],
    queryFn: () => maintenanceService.getRequest(requestId!),
    enabled: !!requestId,
  });

  const { data: staffData } = useQuery({
    queryKey: ['maintenance', 'staff'],
    queryFn: () => maintenanceService.getStaff(),
  });

  const updateRequestMutation = useMutation({
    mutationFn: (data: { status?: string; notes?: string; actualCost?: number }) => 
      maintenanceService.updateRequest(requestId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toastSuccess('Request updated successfully');
      refetch();
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to update request');
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { requestId: number; assignedStaffId: number }) => 
      maintenanceService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      toastSuccess('Task assigned successfully');
      setShowAssignModal(false);
      setSelectedStaffId('');
      refetch();
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to assign task');
    },
  });

  const request = requestData;
  const tasks = requestData?.tasks || [];
  const history = requestData?.history || [];
  const currentTask = tasks.find((t: any) => t.status === 'In Progress');

  const formatStatus = (status: string) => status || 'Open';
  const formatPriority = (priority: string) => priority || 'Normal';

  const isOpen = formatStatus(request?.status).toLowerCase() === 'open';
  const isInProgress = formatStatus(request?.status).toLowerCase() === 'in progress';
  const isCompleted = formatStatus(request?.status).toLowerCase() === 'completed';

  const handleStartWork = () => {
    if (!selectedStaffId) {
      setShowAssignModal(true);
      return;
    }
    createTaskMutation.mutate({
      requestId: requestId!,
      assignedStaffId: selectedStaffId as number,
    });
  };

  const handleComplete = () => {
    updateRequestMutation.mutate({
      status: 'Completed',
      notes: notes || undefined,
      actualCost: actualCost ? parseFloat(actualCost) : undefined,
    });
  };

  const handleAssign = () => {
    if (!selectedStaffId) {
      toastError('Please select a staff member');
      return;
    }
    createTaskMutation.mutate({
      requestId: requestId!,
      assignedStaffId: selectedStaffId as number,
    });
  };

  const getPriorityColor = (priority: string) => {
    const p = formatPriority(priority).toLowerCase();
    if (p === 'emergency' || p === 'high') return 'bg-red-50 text-red-600 border-red-100';
    if (p === 'normal') return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const getStatusColor = (status: string) => {
    const s = formatStatus(status).toLowerCase();
    if (s === 'completed') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s === 'in progress') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    return 'bg-slate-50 text-slate-600 border-slate-100';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a] mx-auto"></div>
        <p className="mt-4 text-[#1a1a1a]/40">Loading...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#1a1a1a]/40">Request not found</p>
        <button 
          onClick={() => navigate('/maintenance/tasks')}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/maintenance/tasks')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">MNT-{requestId}</h1>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(request?.status)}`}>
                {formatStatus(request?.status)}
              </span>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getPriorityColor(request?.priority)}`}>
                {formatPriority(request?.priority)}
              </span>
            </div>
            <p className="text-sm text-[#1a1a1a]/60 mt-1">
              Room {request?.roomNumber} • {request?.requestType}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {isOpen && (
            <button 
              onClick={handleStartWork}
              disabled={createTaskMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              <Play size={16} /> {createTaskMutation.isPending ? 'Processing...' : 'Start Work'}
            </button>
          )}
          {isInProgress && (
            <button 
              onClick={handleComplete}
              disabled={updateRequestMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle2 size={16} /> {updateRequestMutation.isPending ? 'Processing...' : 'Mark Complete'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <h3 className="text-lg font-serif mb-4">Description</h3>
            <p className="text-sm text-[#1a1a1a]/60">
              {request?.description || 'No description provided'}
            </p>
          </div>

          {/* Cost Details */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <h3 className="text-lg font-serif mb-4">Cost Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Estimated Cost</p>
                <p className="text-xl font-serif">
                  ${request?.estimatedCost || 0}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Actual Cost</p>
                <p className="text-xl font-serif text-emerald-600">
                  ${request?.actualCost || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <h3 className="text-lg font-serif mb-4">Activity History</h3>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center">
                      <History size={14} className="text-[#1a1a1a]/40" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.notes || 'Status updated'}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40 mt-1">
                        {item.status} • {item.updateDate ? new Date(item.updateDate).toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#1a1a1a]/40">No activity yet</p>
            )}
          </div>

          {/* Assigned Tasks */}
          {tasks.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
              <h3 className="text-lg font-serif mb-4">Maintenance Tasks</h3>
              <div className="space-y-3">
                {tasks.map((task: any) => (
                  <div key={task.taskId} className="flex items-center justify-between p-4 bg-[#f8f9fa] rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm">
                        {task.assignedStaffName?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {task.assignedStaffName || 'Assigned Staff'}
                        </p>
                        <p className="text-xs text-[#1a1a1a]/40">
                          {task.startDate ? `Started: ${new Date(task.startDate).toLocaleDateString()}` : ''}
                          {task.completionDate ? ` • Completed: ${new Date(task.completionDate).toLocaleDateString()}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
            <h3 className="text-lg font-serif">Details</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} /> Location
                </span>
                <span className="text-sm font-medium">Room {request?.roomNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <Wrench size={12} /> Type
                </span>
                <span className="text-sm">{request?.requestType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <AlertCircle size={12} /> Priority
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getPriorityColor(request?.priority)}`}>
                  {formatPriority(request?.priority)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <User size={12} /> Reported By
                </span>
                <span className="text-sm">
                  {request?.reportedByName || 'System'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> Reported
                </span>
                <span className="text-sm">
                  {request?.reportedDate ? new Date(request.reportedDate).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                  <Calendar size={12} /> Scheduled
                </span>
                <span className="text-sm">
                  {request?.scheduledDate ? new Date(request.scheduledDate).toLocaleDateString() : '-'}
                </span>
              </div>
              {request?.completedDate && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest flex items-center gap-1">
                    <CheckCircle2 size={12} /> Completed
                  </span>
                  <span className="text-sm text-emerald-600">
                    {new Date(request.completedDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Staff */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Assigned To</h3>
              {isOpen && (
                <button 
                  onClick={() => setShowAssignModal(true)}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <UserPlus size={12} /> Assign
                </button>
              )}
            </div>
            {currentTask?.assignedStaffId ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-bold">
                  {currentTask.assignedStaffName?.[0] || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {currentTask.assignedStaffName || 'Staff Member'}
                  </p>
                  <p className="text-[10px] text-[#1a1a1a]/40">Assigned</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#1a1a1a]/40">Not assigned yet</p>
            )}
          </div>

          {/* Complete Form */}
          {isInProgress && (
            <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-4">
              <h3 className="text-lg font-serif">Complete Task</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Actual Cost</label>
                  <input 
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Completion notes..."
                    rows={3}
                    className="w-full px-4 py-2 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {request?.notes && (
            <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-3">
              <h3 className="text-lg font-serif">Notes</h3>
              <p className="text-sm text-[#1a1a1a]/60">{request.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-serif">Assign Staff</h3>
            <p className="text-sm text-[#1a1a1a]/60">Select a staff member to assign this task.</p>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {(staffData || []).map((staff: any) => (
                <button
                  key={staff.employeeId}
                  onClick={() => setSelectedStaffId(staff.employeeId)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    selectedStaffId === staff.employeeId
                      ? 'border-[#1a1a1a] bg-[#f8f9fa]'
                      : 'border-[#1a1a1a]/10 hover:border-[#1a1a1a]/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-sm font-bold">
                      {staff.firstName?.[0]}{staff.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{staff.firstName} {staff.lastName}</p>
                      <p className="text-[10px] text-[#1a1a1a]/40">
                        {staff.position} ({staff.departmentName}) • {staff.activeTasks || 0} active
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button 
                onClick={isInProgress ? handleAssign : handleStartWork}
                disabled={!selectedStaffId || createTaskMutation.isPending}
                className="px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {createTaskMutation.isPending ? 'Processing...' : 'Assign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
