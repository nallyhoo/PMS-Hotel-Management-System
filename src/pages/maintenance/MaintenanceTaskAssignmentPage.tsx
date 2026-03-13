import React, { useState } from 'react';
import { 
  User, 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Search,
  ChevronRight,
  UserPlus,
  ClipboardList,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';
import { toastSuccess, toastError } from '../../lib/toast';

export default function MaintenanceTaskAssignmentPage() {
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [isAssigned, setIsAssigned] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch unassigned requests (status = 'Open')
  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['maintenance', 'requests', 'Open'],
    queryFn: () => maintenanceService.getRequests({ status: 'Open', limit: 50 }),
  });

  // Fetch all staff
  const { data: staffData, isLoading: isLoadingStaff, refetch: refetchStaff } = useQuery({
    queryKey: ['maintenance', 'staff'],
    queryFn: () => maintenanceService.getStaff(),
  });

  // Seed maintenance staff (for first time)
  const seedMutation = useMutation({
    mutationFn: () => maintenanceService.getStaff(),
    onSuccess: (data) => {
      if (!data || data.length === 0) {
        // Call seed endpoint directly
        fetch('http://localhost:3001/api/maintenance/seed-staff', { method: 'POST' })
          .then(() => {
            refetchStaff();
            toastSuccess('3 maintenance staff added!');
          })
          .catch(() => {});
      }
    },
  });

  // Create task mutation
  const createTaskMutation = useMutation({
    mutationFn: (data: { requestId: number; assignedStaffId: number }) => 
      maintenanceService.createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      setIsAssigned(true);
      toastSuccess('Task assigned successfully!');
      setTimeout(() => {
        setIsAssigned(false);
        setSelectedTask(null);
        setSelectedStaff(null);
      }, 3000);
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to assign task');
    },
  });

  // Auto-check for staff on load
  React.useEffect(() => {
    if (!isLoadingStaff && staffData?.length === 0) {
      seedMutation.mutate();
    }
  }, [isLoadingStaff]);

  const requests = requestsData?.data || [];
  const staff = staffData || [];

  const filteredStaff = staff.filter((s: any) => 
    !searchTerm || 
    s.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.departmentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedRequest = requests.find((r: any) => r.requestId === selectedTask);
  const selectedStaffMember = staff.find((s: any) => s.employeeId === selectedStaff);

  const handleAssign = () => {
    if (selectedTask && selectedStaff) {
      createTaskMutation.mutate({
        requestId: selectedTask,
        assignedStaffId: selectedStaff,
      });
    }
  };

  const getPriorityColor = (priority: string, isSelected: boolean) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high' || p === 'emergency') {
      return isSelected ? 'bg-red-500/30 text-white' : 'bg-red-50 text-red-600';
    }
    return isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600';
  };

  if (isLoadingRequests || isLoadingStaff) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a1a1a]/40" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Task Assignment</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Assign pending maintenance requests to available staff</p>
        </div>
        <AnimatePresence>
          {isAssigned && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg flex items-center gap-2 text-emerald-800 text-sm font-medium"
            >
              <CheckCircle2 size={16} className="text-emerald-600" />
              Task assigned successfully!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              Pending Requests
            </h3>
            <span className="text-xs font-semibold bg-[#1a1a1a]/5 px-2 py-1 rounded-full text-[#1a1a1a]/40 uppercase tracking-widest">
              {requests.length} Pending
            </span>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {requests.length > 0 ? requests.map((task: any) => (
              <div 
                key={task.requestId}
                onClick={() => setSelectedTask(task.requestId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  selectedTask === task.requestId 
                    ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                    : 'bg-white border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      selectedTask === task.requestId ? 'bg-white/20 text-white' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/40'
                    }`}>
                      MNT-{task.requestId}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      getPriorityColor(task.priority, selectedTask === task.requestId)
                    }`}>
                      {task.priority || 'Normal'}
                    </span>
                  </div>
                  <span className={`text-xs ${selectedTask === task.requestId ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                    {task.reportedDate ? new Date(task.reportedDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1">{task.description?.slice(0, 50)}{task.description?.length > 50 ? '...' : ''}</h4>
                <div className={`flex items-center gap-4 text-xs ${selectedTask === task.requestId ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    Room {task.roomNumber || task.roomId}
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench size={12} />
                    {task.requestType || 'General'}
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-[#1a1a1a]/40">
                <Wrench size={32} className="mx-auto mb-2 opacity-20" />
                <p>No pending requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Staff Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg font-medium flex items-center gap-2">
              <User size={18} className="text-blue-500" />
              Available Staff
            </h3>
            <div className="flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-full px-3 py-1 gap-2">
              <Search size={14} className="text-[#1a1a1a]/30" />
              <input 
                type="text" 
                placeholder="Search staff..." 
                className="bg-transparent border-none focus:ring-0 text-xs w-24"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {filteredStaff.length > 0 ? filteredStaff.map((person: any) => (
              <div 
                key={person.employeeId}
                onClick={() => setSelectedStaff(person.employeeId)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4 ${
                  selectedStaff === person.employeeId 
                    ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                    : 'bg-white border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif italic border-2 shrink-0 ${
                  selectedStaff === person.employeeId ? 'bg-white/10 border-white/20' : 'bg-[#f8f9fa] border-white shadow-sm'
                }`}>
                  {person.firstName?.[0]}{person.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm truncate">
                      {person.firstName} {person.lastName}
                    </h4>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${
                      person.activeTasks === 0
                        ? (selectedStaff === person.employeeId ? 'bg-emerald-500/30 text-white' : 'bg-emerald-50 text-emerald-600')
                        : (selectedStaff === person.employeeId ? 'bg-amber-500/30 text-white' : 'bg-amber-50 text-amber-600')
                    }`}>
                      {person.activeTasks === 0 ? 'Available' : `${person.activeTasks} Active`}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-xs truncate ${selectedStaff === person.employeeId ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                    <span className="truncate">{person.position || 'Staff'}</span>
                    <span className="shrink-0">({person.departmentName || 'General'})</span>
                  </div>
                </div>
                <ChevronRight size={16} className={`shrink-0 ${selectedStaff === person.employeeId ? 'text-white/40' : 'text-[#1a1a1a]/20'}`} />
              </div>
            )) : (
              <div className="text-center py-8 text-[#1a1a1a]/40">
                <User size={32} className="mx-auto mb-2 opacity-20" />
                <p>No staff available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assignment Footer */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 transition-all duration-500 ${
        selectedTask && selectedStaff ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}>
        <div className="bg-[#1a1a1a] text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="shrink-0 w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <UserPlus size={20} />
            </div>
            <div className="truncate">
              <p className="text-xs text-white/50 uppercase tracking-widest font-semibold">Ready to Assign</p>
              <p className="text-sm font-medium truncate">
                Assign <span className="text-blue-400">MNT-{selectedTask}</span> to <span className="text-emerald-400">{selectedStaffMember?.firstName} {selectedStaffMember?.lastName}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleAssign}
            disabled={createTaskMutation.isPending}
            className="bg-white text-[#1a1a1a] px-6 py-2.5 rounded-xl font-medium hover:bg-[#f5f2ed] transition-all whitespace-nowrap disabled:opacity-50"
          >
            {createTaskMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Assigning...
              </span>
            ) : 'Confirm Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
}
