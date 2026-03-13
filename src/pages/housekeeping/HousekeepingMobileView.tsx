import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Check,
  Camera,
  ChevronRight,
  Image,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import type { HousekeepingTask } from '../../types/database';

interface TaskWithDetails extends HousekeepingTask {
  roomNumber?: string;
  typeName?: string;
  firstName?: string;
  lastName?: string;
}

export default function HousekeepingMobileView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['housekeeping', 'tasks'],
    queryFn: () => housekeepingService.getTasks(),
  });

  const allTasks: TaskWithDetails[] = tasksData || [];

  const pendingTasks = allTasks.filter(t => t.status === 'Pending');
  const inProgressTasks = allTasks.filter(t => t.status === 'In Progress');
  const completedTasks = allTasks.filter(t => t.status === 'Completed' || t.status === 'Verified');

  const displayTasks = activeTab === 'pending' ? pendingTasks 
    : activeTab === 'in_progress' ? inProgressTasks 
    : completedTasks;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-[#1a1a1a] text-white p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">My Tasks</h1>
            <p className="text-xs text-white/60">
              {pendingTasks.length} pending • {inProgressTasks.length} in progress
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-sm font-medium">HK</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-10">
        <div className="flex">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === 'pending' 
                ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' 
                : 'text-gray-400'
            }`}
          >
            Pending ({pendingTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === 'in_progress' 
                ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' 
                : 'text-gray-400'
            }`}
          >
            In Progress ({inProgressTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 text-sm font-medium text-center ${
              activeTab === 'completed' 
                ? 'text-[#1a1a1a] border-b-2 border-[#1a1a1a]' 
                : 'text-gray-400'
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="p-4 space-y-3">
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading tasks...</div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No {activeTab.replace('_', ' ')} tasks
          </div>
        ) : (
          displayTasks.map((task) => (
            <TaskCard 
              key={task.taskId} 
              task={task} 
              queryClient={queryClient}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, queryClient }: { task: TaskWithDetails; queryClient: any }) {
  const [showActions, setShowActions] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [photoType, setPhotoType] = useState<'before' | 'after' | 'issue'>('before');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateMutation = useMutation({
    mutationFn: (data: { status: string; startTime?: string; endTime?: string }) => 
      housekeepingService.updateTask(task.taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping'] });
    },
  });

  const photoMutation = useMutation({
    mutationFn: (data: { photoUrl: string; photoType: string }) => 
      housekeepingService.uploadPhoto(task.taskId, data.photoUrl, data.photoType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['housekeeping', 'task', task.taskId] });
      setShowCamera(false);
      alert('Photo uploaded successfully!');
    },
  });

  const handleStart = () => {
    const now = new Date().toISOString();
    updateMutation.mutate({ status: 'In Progress', startTime: now });
  };

  const handleComplete = () => {
    const now = new Date().toISOString();
    updateMutation.mutate({ status: 'Completed', endTime: now });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        photoMutation.mutate({ photoUrl: base64, photoType });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {showCamera && (
        <div className="p-4 bg-gray-900 text-white">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Take Photo - {photoType}</span>
            <button onClick={() => setShowCamera(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="flex gap-2 mb-4">
            {(['before', 'after', 'issue'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setPhotoType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  photoType === type 
                    ? 'bg-white text-gray-900' 
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={photoMutation.isPending}
            className="w-full py-3 bg-white text-gray-900 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            {photoMutation.isPending ? 'Uploading...' : 'Take Photo / Select'}
          </button>
        </div>
      )}

      <div 
        className="p-4"
        onClick={() => setShowActions(!showActions)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl font-semibold">Room {task.roomNumber}</span>
              {(task.priority === 'Urgent' || task.priority === 'High') && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded">
                  {task.priority}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{task.taskType}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {task.scheduledTime || 'ASAP'}
              </span>
              {task.scheduledDate && (
                <span>{task.scheduledDate}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {task.status === 'Pending' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleStart(); }}
                className="w-10 h-10 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center"
              >
                <Play size={16} fill="currentColor" />
              </button>
            )}
            {task.status === 'In Progress' && (
              <button
                onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center"
              >
                <Check size={16} fill="currentColor" />
              </button>
            )}
            <ChevronRight size={20} className={`text-gray-400 transition-transform ${showActions ? 'rotate-90' : ''}`} />
          </div>
        </div>
      </div>

      {showActions && (
        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-3">
          <div className="flex gap-2">
            {task.status === 'Pending' && (
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium"
              >
                <Play size={16} /> Start Cleaning
              </button>
            )}
            {task.status === 'In Progress' && (
              <>
                <button
                  onClick={() => setShowCamera(true)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Camera size={16} /> Photo
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white rounded-lg text-sm font-medium"
                >
                  <CheckCircle2 size={16} /> Mark Complete
                </button>
              </>
            )}
          </div>
          {task.notes && (
            <div className="p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-500 font-medium mb-1">Notes:</p>
              <p className="text-sm text-gray-700">{task.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
