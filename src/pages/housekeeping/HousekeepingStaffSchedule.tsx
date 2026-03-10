import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Users, 
  Plus, 
  MoreHorizontal,
  ArrowLeft,
  Filter,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const staff = [
  { id: 'S1', name: 'Maria Garcia', role: 'Supervisor', shifts: ['08:00 - 16:00', '08:00 - 16:00', 'OFF', '08:00 - 16:00', '08:00 - 16:00', '08:00 - 16:00', 'OFF'] },
  { id: 'S2', name: 'John Doe', role: 'Housekeeper', shifts: ['09:00 - 17:00', '09:00 - 17:00', '09:00 - 17:00', 'OFF', '09:00 - 17:00', '09:00 - 17:00', '09:00 - 17:00'] },
  { id: 'S3', name: 'Elena Rodriguez', role: 'Housekeeper', shifts: ['OFF', '14:00 - 22:00', '14:00 - 22:00', '14:00 - 22:00', '14:00 - 22:00', 'OFF', '14:00 - 22:00'] },
  { id: 'S4', name: 'Marcus Chen', role: 'Housekeeper', shifts: ['08:00 - 16:00', 'OFF', '08:00 - 16:00', '08:00 - 16:00', '08:00 - 16:00', '08:00 - 16:00', '08:00 - 16:00'] },
  { id: 'S5', name: 'Sarah Jenkins', role: 'Housekeeper', shifts: ['14:00 - 22:00', '14:00 - 22:00', 'OFF', '14:00 - 22:00', '14:00 - 22:00', '14:00 - 22:00', '14:00 - 22:00'] },
];

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function HousekeepingStaffSchedule() {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState('Mar 09 - Mar 15, 2026');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Staff Schedule</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Manage housekeeping shifts and availability.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Plus size={16} /> Add Shift
          </button>
        </div>
      </div>

      {/* Week Selector */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"><ChevronLeft size={20} /></button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Calendar size={18} className="text-[#1a1a1a]/40" />
            {currentWeek}
          </div>
          <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors"><ChevronRight size={20} /></button>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-1.5 bg-[#1a1a1a] text-white rounded-lg text-[10px] uppercase tracking-widest font-bold">Week</button>
          <button className="px-4 py-1.5 hover:bg-[#f8f9fa] rounded-lg text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Month</button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4 min-w-[200px]">Staff Member</th>
                {days.map((day, idx) => (
                  <th key={idx} className="px-6 py-4 min-w-[140px] text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/40 font-serif">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-widest font-bold">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  {member.shifts.map((shift, idx) => (
                    <td key={idx} className="px-4 py-4">
                      {shift === 'OFF' ? (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">OFF</span>
                        </div>
                      ) : (
                        <div className="bg-white border border-[#1a1a1a]/5 rounded-xl p-3 text-center shadow-sm group-hover:border-[#1a1a1a]/20 transition-all">
                          <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#1a1a1a]/60">
                            <Clock size={12} /> {shift}
                          </div>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
