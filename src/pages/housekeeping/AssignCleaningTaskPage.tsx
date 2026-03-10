import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Save, 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Calendar,
  Layers,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AssignCleaningTaskPage() {
  const navigate = useNavigate();
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [assignedStaff, setAssignedStaff] = useState('');
  const [taskType, setTaskType] = useState('Full Clean');
  const [priority, setPriority] = useState('Medium');

  const rooms = [
    { id: '101', type: 'Standard', status: 'Dirty', lastCleaned: '24h ago' },
    { id: '102', type: 'Standard', status: 'Dirty', lastCleaned: '12h ago' },
    { id: '103', type: 'Deluxe', status: 'Clean', lastCleaned: '2h ago' },
    { id: '104', type: 'Deluxe', status: 'Dirty', lastCleaned: '18h ago' },
    { id: '201', type: 'Suite', status: 'Dirty', lastCleaned: '6h ago' },
    { id: '202', type: 'Suite', status: 'Clean', lastCleaned: '1h ago' },
  ];

  const staff = [
    { id: 'S1', name: 'Maria Garcia', role: 'Supervisor', currentTasks: 4 },
    { id: 'S2', name: 'John Doe', role: 'Housekeeper', currentTasks: 2 },
    { id: 'S3', name: 'Elena Rodriguez', role: 'Housekeeper', currentTasks: 0 },
    { id: 'S4', name: 'Marcus Chen', role: 'Housekeeper', currentTasks: 3 },
  ];

  const toggleRoom = (id: string) => {
    setSelectedRooms(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleAssign = () => {
    if (selectedRooms.length === 0 || !assignedStaff) return;
    // Simulate assignment
    console.log('Assigning tasks:', { selectedRooms, assignedStaff, taskType, priority });
    navigate('/housekeeping/tasks');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light">Assign Cleaning Tasks</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Bulk assign rooms to housekeeping staff.</p>
          </div>
        </div>
        <button 
          onClick={handleAssign}
          disabled={selectedRooms.length === 0 || !assignedStaff}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={16} /> Confirm Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Room Selection */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Select Rooms</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedRooms(rooms.filter(r => r.status === 'Dirty').map(r => r.id))}
                  className="text-[10px] uppercase tracking-widest font-bold text-amber-600 hover:text-amber-700"
                >
                  Select All Dirty
                </button>
                <span className="text-[#1a1a1a]/10">|</span>
                <button 
                  onClick={() => setSelectedRooms([])}
                  className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 hover:text-[#1a1a1a]"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => toggleRoom(room.id)}
                  className={`p-4 rounded-xl border transition-all text-left relative ${
                    selectedRooms.includes(room.id) 
                      ? 'border-[#1a1a1a] bg-[#1a1a1a]/5 shadow-inner' 
                      : 'border-[#1a1a1a]/5 bg-white hover:border-[#1a1a1a]/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg font-serif">Room {room.id}</span>
                    {selectedRooms.includes(room.id) && (
                      <CheckCircle2 size={16} className="text-[#1a1a1a]" />
                    )}
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{room.type}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      room.status === 'Dirty' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                      {room.status}
                    </span>
                    <span className="text-[10px] text-[#1a1a1a]/40">{room.lastCleaned}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Details */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-serif">Assignment Details</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Assign To Staff</label>
                <select 
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="">Select Housekeeper</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.currentTasks} tasks)</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Cleaning Type</label>
                <select 
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
                >
                  <option value="Full Clean">Full Clean (Checkout)</option>
                  <option value="Stay-over">Stay-over Clean</option>
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Touch-up">Touch-up</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Priority Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Medium', 'High'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        priority === p 
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' 
                          : 'bg-white text-[#1a1a1a]/40 border-[#1a1a1a]/10 hover:border-[#1a1a1a]/40'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1a1a1a]/5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Rooms Selected</span>
                <span className="font-medium">{selectedRooms.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#1a1a1a]/40">Est. Total Time</span>
                <span className="font-medium">{selectedRooms.length * 30} mins</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <Info className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-800 leading-relaxed">
              Assigning multiple rooms to a single staff member will automatically queue them in their task list based on the priority level selected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
