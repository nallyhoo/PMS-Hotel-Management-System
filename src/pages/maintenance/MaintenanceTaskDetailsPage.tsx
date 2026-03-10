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
  MessageSquare, 
  Camera, 
  Download,
  MoreVertical,
  History,
  Info
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function MaintenanceTaskDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('In Progress');

  const timeline = [
    { time: '09:30 AM', event: 'Task assigned to David K.', user: 'Alexander Wright', icon: User },
    { time: '10:15 AM', event: 'Work started on site', user: 'David K.', icon: Wrench },
    { time: '10:45 AM', event: 'Parts ordered: AC Filter (Model X-200)', user: 'David K.', icon: Clock },
  ];

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
              <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Task {id || 'MNT-2041'}</h1>
              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-[#1a1a1a]/40 text-sm mt-1">Reported on March 9, 2024 at 09:30 AM</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10">
            <Download size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors border border-[#1a1a1a]/10">
            <MoreVertical size={18} className="text-[#1a1a1a]/60" />
          </button>
          <button 
            onClick={() => setStatus('Completed')}
            className="flex items-center gap-2 px-6 py-2 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <CheckCircle2 size={16} />
            Mark as Completed
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                    <MapPin size={18} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Location</span>
                  </div>
                  <p className="text-lg font-medium">Room 402 (Standard King)</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                    <AlertCircle size={18} />
                    <span className="text-xs font-semibold uppercase tracking-widest">Priority</span>
                  </div>
                  <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold uppercase tracking-widest">High Priority</span>
                </div>
              </div>

              <div className="space-y-4 pt-8 border-t border-[#1a1a1a]/5">
                <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                  <MessageSquare size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Issue Description</span>
                </div>
                <p className="text-sm leading-relaxed text-[#1a1a1a]/80">
                  Guest reported that the air conditioning unit is leaking water onto the carpet. The unit is making a loud rattling noise when running. Water damage to the carpet is minimal but needs immediate attention to prevent mold.
                </p>
              </div>

              <div className="space-y-4 pt-8 border-t border-[#1a1a1a]/5">
                <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                  <Camera size={18} />
                  <span className="text-xs font-semibold uppercase tracking-widest">Attached Photos</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="aspect-video bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 overflow-hidden group cursor-pointer relative">
                      <img 
                        src={`https://picsum.photos/seed/maintenance-${i}/400/300`} 
                        alt="Maintenance" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold uppercase tracking-widest">View Full Size</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8">
            <h3 className="font-serif text-lg font-medium mb-8 flex items-center gap-2">
              <History size={20} className="text-[#1a1a1a]/40" />
              Activity History
            </h3>
            <div className="space-y-8 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-px before:bg-[#1a1a1a]/5">
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-12">
                  <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-white border border-[#1a1a1a]/5 flex items-center justify-center z-10">
                    <item.icon size={14} className="text-[#1a1a1a]/40" />
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#1a1a1a]">{item.event}</p>
                    <span className="text-[10px] font-bold text-[#1a1a1a]/30 uppercase tracking-widest">{item.time}</span>
                  </div>
                  <p className="text-xs text-[#1a1a1a]/40 mt-1">By {item.user}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Assignment & Actions */}
        <div className="space-y-8">
          {/* Assigned Staff */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6">
            <h3 className="text-[10px] font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-6">Assigned Staff</h3>
            <div className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-2xl border border-[#1a1a1a]/5">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center text-lg font-serif italic border-2 border-white shadow-sm text-white">
                DK
              </div>
              <div>
                <p className="text-sm font-medium">David K.</p>
                <p className="text-xs text-[#1a1a1a]/40">Senior Technician</p>
              </div>
            </div>
            <button className="w-full mt-4 text-xs font-semibold text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors py-2">Reassign Task</button>
          </div>

          {/* Task Info */}
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1a1a1a]/40 font-medium">Category</span>
              <span className="text-sm font-medium">HVAC</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1a1a1a]/40 font-medium">Estimated Time</span>
              <span className="text-sm font-medium">2.5 Hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#1a1a1a]/40 font-medium">Parts Required</span>
              <span className="text-sm font-medium">Yes</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#1a1a1a] rounded-2xl p-6 text-white space-y-4">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Quick Actions</h3>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium">
              <MessageSquare size={18} className="text-white/60" />
              Message Technician
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all text-sm font-medium">
              <Calendar size={18} className="text-white/60" />
              Reschedule Work
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 text-amber-800">
            <Info size={18} className="shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed opacity-80">
              This task is currently blocking Room 402 from being sold. Priority is set to High to ensure room availability for tonight's arrivals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
