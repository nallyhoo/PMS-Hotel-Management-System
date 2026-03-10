import React, { useState } from 'react';
import { 
  User, 
  Wrench, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  ChevronRight,
  UserPlus,
  ClipboardList
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const unassignedTasks = [
  { id: 'MNT-2042', location: 'Lobby', issue: 'Light Bulb Out', category: 'General', priority: 'Low', reportedAt: '10:30 AM', reportedBy: 'Reception' },
  { id: 'MNT-2045', location: 'Room 305', issue: 'Shower Drain Clogged', category: 'Plumbing', priority: 'High', reportedAt: '11:15 AM', reportedBy: 'Housekeeping' },
  { id: 'MNT-2046', location: 'Kitchen', issue: 'Oven Not Heating', category: 'Electrical', priority: 'High', reportedAt: '11:45 AM', reportedBy: 'Chef Marco' },
  { id: 'MNT-2047', location: 'Gym', issue: 'Treadmill Squeaking', category: 'General', priority: 'Medium', reportedAt: '12:00 PM', reportedBy: 'Guest' },
];

const staff = [
  { id: 'STF-01', name: 'David K.', role: 'Senior Technician', status: 'Available', activeTasks: 2, specialty: 'HVAC/Electrical' },
  { id: 'STF-02', name: 'Sarah M.', role: 'Maintenance Specialist', status: 'In Progress', activeTasks: 1, specialty: 'Plumbing' },
  { id: 'STF-03', name: 'Marcus L.', role: 'General Maintenance', status: 'Available', activeTasks: 0, specialty: 'General' },
  { id: 'STF-04', name: 'Elena R.', role: 'Technician', status: 'Break', activeTasks: 0, specialty: 'Electrical' },
];

export default function MaintenanceTaskAssignmentPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [isAssigned, setIsAssigned] = useState(false);

  const handleAssign = () => {
    if (selectedTask && selectedStaff) {
      setIsAssigned(true);
      setTimeout(() => {
        setIsAssigned(false);
        setSelectedTask(null);
        setSelectedStaff(null);
      }, 3000);
    }
  };

  return (
    <div className="space-y-8">
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
              {unassignedTasks.length} Pending
            </span>
          </div>
          <div className="space-y-3">
            {unassignedTasks.map((task) => (
              <div 
                key={task.id}
                onClick={() => setSelectedTask(task.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                  selectedTask === task.id 
                    ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                    : 'bg-white border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      selectedTask === task.id ? 'bg-white/20 text-white' : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/40'
                    }`}>
                      {task.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      task.priority === 'High' 
                        ? (selectedTask === task.id ? 'bg-red-500/30 text-white' : 'bg-red-50 text-red-600')
                        : (selectedTask === task.id ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600')
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <span className={`text-xs ${selectedTask === task.id ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                    {task.reportedAt}
                  </span>
                </div>
                <h4 className="font-medium text-sm mb-1">{task.issue}</h4>
                <div className={`flex items-center gap-4 text-xs ${selectedTask === task.id ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    {task.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Wrench size={12} />
                    {task.category}
                  </div>
                </div>
              </div>
            ))}
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
              <input type="text" placeholder="Search staff..." className="bg-transparent border-none focus:ring-0 text-xs w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {staff.map((person) => (
              <div 
                key={person.id}
                onClick={() => setSelectedStaff(person.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-center gap-4 ${
                  selectedStaff === person.id 
                    ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                    : 'bg-white border-[#1a1a1a]/5 hover:border-[#1a1a1a]/20'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-serif italic border-2 ${
                  selectedStaff === person.id ? 'bg-white/10 border-white/20' : 'bg-[#f8f9fa] border-white shadow-sm'
                }`}>
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{person.name}</h4>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      person.status === 'Available' 
                        ? (selectedStaff === person.id ? 'bg-emerald-500/30 text-white' : 'bg-emerald-50 text-emerald-600')
                        : (selectedStaff === person.id ? 'bg-amber-500/30 text-white' : 'bg-amber-50 text-amber-600')
                    }`}>
                      {person.status}
                    </span>
                  </div>
                  <div className={`flex items-center gap-4 text-xs ${selectedStaff === person.id ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                    <span>{person.role}</span>
                    <span className="flex items-center gap-1">
                      <ClipboardList size={12} />
                      {person.activeTasks} active
                    </span>
                  </div>
                </div>
                <ChevronRight size={16} className={selectedStaff === person.id ? 'text-white/40' : 'text-[#1a1a1a]/20'} />
              </div>
            ))}
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
                Assign <span className="text-blue-400">{selectedTask}</span> to <span className="text-emerald-400">{staff.find(s => s.id === selectedStaff)?.name}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleAssign}
            className="bg-white text-[#1a1a1a] px-6 py-2.5 rounded-xl font-medium hover:bg-[#f5f2ed] transition-all whitespace-nowrap"
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </div>
  );
}
