import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  Filter,
  Download
} from 'lucide-react';
import { mockStaff, mockSchedules } from '../../data/mockStaff';

export default function StaffSchedulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const staff = id ? mockStaff.find(s => s.id === id) : null;
  const schedules = id ? mockSchedules.filter(s => s.staffId === id) : mockSchedules;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/staff/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Staff Schedule</h1>
            <p className="text-sm text-[#1a1a1a]/60">
              {staff ? `Weekly schedule for ${staff.name}` : 'Overall hotel staff scheduling'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors">
            <Plus size={18} />
            <span>Add Shift</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors border border-[#1a1a1a]/5">
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-[#1a1a1a]/40" />
              <span className="text-sm font-medium">March 10 - March 16, 2024</span>
            </div>
            <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors border border-[#1a1a1a]/5">
              <ChevronRight size={18} />
            </button>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-xs font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]">Today</button>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-8 border-b border-[#1a1a1a]/5 bg-[#f8f9fa]">
              <div className="p-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 border-r border-[#1a1a1a]/5">Staff Member</div>
              {days.map(day => (
                <div key={day} className="p-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-center">{day}</div>
              ))}
            </div>

            <div className="divide-y divide-[#1a1a1a]/5">
              {(staff ? [staff] : mockStaff).map((member) => (
                <div key={member.id} className="grid grid-cols-8 hover:bg-[#f8f9fa]/50 transition-colors">
                  <div className="p-4 border-r border-[#1a1a1a]/5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[10px] font-serif italic border border-[#1a1a1a]/10">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-medium text-[#1a1a1a] truncate">{member.name}</span>
                        <span className="text-[9px] text-[#1a1a1a]/40 uppercase font-bold truncate">{member.role}</span>
                      </div>
                    </div>
                  </div>
                  {days.map(day => {
                    const shift = schedules.find(s => s.staffId === member.id && s.day === day);
                    return (
                      <div key={day} className="p-2 min-h-[80px] flex flex-col justify-center">
                        {shift ? (
                          <div className="bg-[#1a1a1a] text-white p-2 rounded-lg space-y-1 shadow-sm">
                            <p className="text-[10px] font-bold uppercase tracking-wider">{shift.shift}</p>
                            <div className="flex items-center gap-1 text-[9px] text-white/70">
                              <Clock size={10} />
                              <span>{shift.startTime} - {shift.endTime}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border-2 border-dashed border-[#1a1a1a]/5 rounded-lg flex items-center justify-center group cursor-pointer hover:bg-white hover:border-[#1a1a1a]/20 transition-all">
                            <Plus size={14} className="text-[#1a1a1a]/10 group-hover:text-[#1a1a1a]/40" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
