import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  User, 
  MapPin, 
  ClipboardList,
  Camera,
  MessageSquare,
  Save,
  Play,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CleaningTaskDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [status, setStatus] = useState<'Pending' | 'In Progress' | 'Completed'>('In Progress');

  const task = {
    id: id || 'TSK-101',
    room: '402',
    type: 'Full Clean (Checkout)',
    priority: 'High',
    assignedTo: 'Maria Garcia',
    startTime: '09:30 AM',
    estimatedTime: '45 mins',
    checkpoints: [
      { id: 1, label: 'Strip bed linens and towels', completed: true },
      { id: 2, label: 'Dust all surfaces and furniture', completed: true },
      { id: 3, label: 'Clean bathroom (toilet, shower, sink)', completed: false },
      { id: 4, label: 'Vacuum and mop floors', completed: false },
      { id: 5, label: 'Restock amenities (soap, shampoo, coffee)', completed: false },
      { id: 6, label: 'Final inspection and spray fragrance', completed: false },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
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
            <p className="text-sm text-[#1a1a1a]/60 font-light">Room {task.room} • {task.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {status === 'Pending' && (
            <button 
              onClick={() => setStatus('In Progress')}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors shadow-lg"
            >
              <Play size={16} /> Start Cleaning
            </button>
          )}
          {status === 'In Progress' && (
            <button 
              onClick={() => setStatus('Completed')}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg"
            >
              <Check size={16} /> Mark as Complete
            </button>
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
                2 of 6 Completed
              </span>
            </div>
            <div className="space-y-4">
              {task.checkpoints.map((cp) => (
                <div 
                  key={cp.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    cp.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-[#f8f9fa] border-transparent'
                  }`}
                >
                  <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    cp.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-[#1a1a1a]/10'
                  }`}>
                    {cp.completed && <Check size={14} />}
                  </button>
                  <span className={`text-sm ${cp.completed ? 'text-emerald-700 font-medium line-through opacity-60' : 'text-[#1a1a1a]'}`}>
                    {cp.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-serif">Photos & Evidence</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 rounded-xl flex flex-col items-center justify-center gap-2 text-[#1a1a1a]/20 hover:border-[#1a1a1a]/40 hover:text-[#1a1a1a]/40 transition-all cursor-pointer">
                <Camera size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
              </div>
            </div>
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
                  <p className="text-sm font-medium">{task.assignedTo}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Est. Duration</p>
                  <p className="text-sm font-medium">{task.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-2 bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/40">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Priority</p>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-widest">{task.priority}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#1a1a1a] text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/40">Room Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Current Status</span>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">Dirty</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-white/60">Next Guest Arrival</span>
                <span className="text-xs font-medium">Today, 3:00 PM</span>
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
