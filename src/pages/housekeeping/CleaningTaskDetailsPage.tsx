import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  User, 
  MessageSquare,
  Play,
  Check,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import type { HousekeepingTask } from '../../types/database';

interface TaskWithDetails extends HousekeepingTask {
  roomNumber?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
}

export default function CleaningTaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const taskId = id ? parseInt(id, 10) : null;
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [completedCheckpoints, setCompletedCheckpoints] = useState<number[]>([]);

  const isPending = (status?: string) => !status || status === 'Pending' || status === 'PENDING';
  const isInProgress = (status?: string) => status === 'In Progress' || status === 'IN PROGRESS';
  const isCompleted = (status?: string) => status === 'Completed' || status === 'COMPLETED';
  const isVerified = (status?: string) => status === 'Verified' || status === 'VERIFIED';

  const toggleCheckpoint = (id: number) => {
    setCompletedCheckpoints(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['housekeeping', 'task', taskId],
    queryFn: () => housekeepingService.getTask(taskId!),
    enabled: taskId !== null && !isNaN(taskId),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { status?: string; startTime?: string; endTime?: string; notes?: string }) => 
      housekeepingService.updateTask(taskId!, data),
    onMutate: async (newData: { status?: string; startTime?: string; endTime?: string; notes?: string }) => {
      await queryClient.cancelQueries({ queryKey: ['housekeeping', 'task', taskId] });
      const previousTask = queryClient.getQueryData(['housekeeping', 'task', taskId]);
      
      if (previousTask && newData.status) {
        queryClient.setQueryData(['housekeeping', 'task', taskId], (old: unknown) => {
          const oldTask = old as any;
          return {
            ...oldTask,
            Status: newData.status,
            status: newData.status,
            ...(newData.startTime && { StartTime: newData.startTime, startTime: newData.startTime }),
            ...(newData.endTime && { EndTime: newData.endTime, endTime: newData.endTime }),
          };
        });
      }
      
      return { previousTask };
    },
    onError: (err: Error, newData, context: { previousTask?: unknown } | undefined) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['housekeeping', 'task', taskId], context.previousTask);
      }
      console.error('Update task error:', err);
      if (err.message && err.message !== 'Request failed') {
        alert('Failed to update task: ' + err.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      queryClient.invalidateQueries({ queryKey: ['housekeeping', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (data: { approved: boolean; notes?: string }) => 
      housekeepingService.approveTask(taskId!, data.approved, data.notes),
    onMutate: async (newData: { approved: boolean; notes?: string }) => {
      await queryClient.cancelQueries({ queryKey: ['housekeeping', 'task', taskId] });
      const previousTask = queryClient.getQueryData(['housekeeping', 'task', taskId]);
      
      if (previousTask) {
        const newStatus = newData.approved ? 'Verified' : 'Pending';
        queryClient.setQueryData(['housekeeping', 'task', taskId], (old: unknown) => {
          const oldTask = old as any;
          return {
            ...oldTask,
            Status: newStatus,
            status: newStatus,
          };
        });
      }
      
      return { previousTask };
    },
    onError: (err: Error, newData, context: { previousTask?: unknown } | undefined) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['housekeeping', 'task', taskId], context.previousTask);
      }
      console.error('Approve task error:', err);
      if (err.message && err.message !== 'Request failed') {
        alert('Failed to approve/reject task: ' + err.message);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
      queryClient.invalidateQueries({ queryKey: ['housekeeping', 'task', taskId] });
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      setShowApprovalModal(false);
      setApprovalNotes('');
    },
  });

  const handleStartTask = () => {
    const now = new Date().toISOString();
    updateTaskMutation.mutate({ status: 'In Progress', startTime: now });
  };

  const handleCompleteTask = () => {
    const now = new Date().toISOString();
    updateTaskMutation.mutate({ status: 'Completed', endTime: now });
  };

  const handleApproval = () => {
    if (approvalAction) {
      approveMutation.mutate({ approved: approvalAction === 'approve', notes: approvalNotes });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'high': return 'text-red-600';
      case 'normal': return 'text-amber-600';
      default: return 'text-blue-600';
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'completed':
      case 'verified': return 'bg-emerald-50 text-emerald-600';
      case 'in progress': return 'bg-indigo-50 text-indigo-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const defaultCheckpoints = [
    { id: 1, label: 'Strip bed linens and towels', completed: false },
    { id: 2, label: 'Dust all surfaces and furniture', completed: false },
    { id: 3, label: 'Clean bathroom (toilet, shower, sink)', completed: false },
    { id: 4, label: 'Vacuum and mop floors', completed: false },
    { id: 5, label: 'Restock amenities (soap, shampoo, coffee)', completed: false },
    { id: 6, label: 'Final inspection and spray fragrance', completed: false },
  ];

  if (taskId === null || isNaN(taskId)) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-red-600">Invalid task ID</p>
          <button onClick={() => navigate('/housekeeping/tasks')} className="mt-4 text-sm text-[#1a1a1a]/60 underline">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-[#1a1a1a]/40">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-red-600">Error loading task: {(error as Error).message}</p>
          <button onClick={() => navigate('/housekeeping/tasks')} className="mt-4 text-sm text-[#1a1a1a]/60 underline">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-[#1a1a1a]/60">Task not found</p>
          <button onClick={() => navigate('/housekeeping/tasks')} className="mt-4 text-sm text-[#1a1a1a]/60 underline">
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const taskAny = task as any;
  const taskData: TaskWithDetails = {
    ...task,
    roomNumber: taskAny?.RoomNumber || taskAny?.roomNumber || `ID: ${taskAny?.TaskID || taskAny?.taskId || 'Unknown'}`,
    typeName: taskAny?.TypeName || taskAny?.typeName,
    firstName: taskAny?.FirstName || taskAny?.firstName,
    lastName: taskAny?.LastName || taskAny?.lastName,
    taskType: taskAny?.TaskType || taskAny?.taskType,
    scheduledTime: taskAny?.ScheduledTime || taskAny?.scheduledTime,
    startTime: taskAny?.StartTime || taskAny?.startTime,
    endTime: taskAny?.EndTime || taskAny?.endTime,
    status: taskAny?.Status || taskAny?.status || 'Pending',
    priority: taskAny?.Priority || taskAny?.priority || 'Normal',
  };

  const canRequestInspection = isCompleted(taskData?.status);
  const canVerify = isCompleted(taskData?.status) && taskData?.taskType === 'Inspection';
  const isTaskCompletedOrVerified = isCompleted(taskData?.status) || isVerified(taskData?.status);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-serif">
              {approvalAction === 'approve' ? 'Approve Cleaning' : 'Reject & Request Re-clean'}
            </h3>
            <p className="text-sm text-[#1a1a1a]/60">
              {approvalAction === 'approve' 
                ? 'Approving will mark the room as inspected and ready for guest check-in.'
                : 'The room will be marked as dirty and returned to the cleaning queue.'}
            </p>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-[#1a1a1a]/40">Notes (optional)</label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full px-4 py-2 bg-[#f8f9fa] rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                rows={3}
                placeholder="Add any notes about the inspection..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setShowApprovalModal(false); setApprovalAction(null); }}
                className="flex-1 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa]"
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                disabled={approveMutation.isPending}
                className={`flex-1 py-2 rounded-xl text-xs font-medium uppercase tracking-widest transition-colors ${
                  approvalAction === 'approve' 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {approveMutation.isPending ? 'Processing...' : approvalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping/tasks')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Task Details</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Room {taskData?.roomNumber} • {taskData?.taskType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isPending(taskData?.status) && (
            <button 
              onClick={handleStartTask}
              disabled={updateTaskMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg disabled:opacity-50"
            >
              <Play size={16} /> Start Cleaning
            </button>
          )}
          {isInProgress(taskData?.status) && (
            <button 
              onClick={handleCompleteTask}
              disabled={updateTaskMutation.isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
            >
              <Check size={16} /> {updateTaskMutation.isPending ? 'Processing...' : 'Mark as Complete'}
            </button>
          )}
          {isCompleted(taskData?.status) && !isVerified(taskData?.status) && (
            <>
              <button 
                onClick={() => { setApprovalAction('approve'); setShowApprovalModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button 
                onClick={() => { setApprovalAction('reject'); setShowApprovalModal(true); }}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg"
              >
                <XCircle size={16} /> Reject
              </button>
            </>
          )}
          <button className="p-2.5 border border-[#1a1a1a]/10 rounded-xl hover:bg-[#f8f9fa] transition-colors">
            <MessageSquare size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Checkpoints */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Cleaning Checklist</h3>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                {isTaskCompletedOrVerified ? `${completedCheckpoints.length} of ${defaultCheckpoints.length} Completed` : `${completedCheckpoints.length} of ${defaultCheckpoints.length}`}
              </span>
            </div>
            <div className="space-y-4">
              {defaultCheckpoints.map((cp) => {
                const isCompleted = completedCheckpoints.includes(cp.id) || isTaskCompletedOrVerified;
                return (
                <div 
                  key={cp.id}
                  onClick={() => !isTaskCompletedOrVerified && toggleCheckpoint(cp.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    isCompleted ? 'bg-emerald-50 border-emerald-100' : 'bg-[#f8f9fa] border-transparent hover:border-[#1a1a1a]/10'
                  } ${!isTaskCompletedOrVerified ? 'cursor-pointer' : 'cursor-default'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-[#1a1a1a]/10'
                  }`}>
                    {isCompleted && <Check size={14} />}
                  </div>
                  <span className={`text-sm ${isCompleted ? 'text-emerald-700 font-medium line-through opacity-60' : 'text-[#1a1a1a]'}`}>
                    {cp.label}
                  </span>
                </div>
              );
              })}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-serif">Notes</h3>
            <p className="text-sm text-[#1a1a1a]/60">
              {taskData?.notes || 'No notes for this task.'}
            </p>
          </div>
        </div>

        {/* Sidebar: Task Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40">Task Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Assigned To</p>
                  <p className="text-sm font-medium">
                    {taskData?.firstName && taskData?.lastName 
                      ? `${taskData.firstName} ${taskData.lastName}` 
                      : 'Unassigned'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Scheduled</p>
                  <p className="text-sm font-medium">{taskData?.scheduledDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Priority</p>
                  <span className={`text-xs font-bold uppercase tracking-widest ${getPriorityColor(taskData?.priority || 'Normal')}`}>
                    {taskData?.priority}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Status</p>
                  <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${getStatusColor(taskData?.status || 'Pending')}`}>
                    {taskData?.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Room Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Room Number</span>
                <span className="text-xs font-bold uppercase tracking-widest">{taskData?.roomNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Room Type</span>
                <span className="text-xs font-medium">{taskData?.typeName || 'Standard'}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] text-white/40 leading-relaxed">
                Once completed, the room status will automatically update to "Clean" and notify the front desk for inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
