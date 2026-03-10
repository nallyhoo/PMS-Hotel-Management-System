import React from 'react';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Star,
  Search
} from 'lucide-react';

const staffMembers = [
  { name: 'Sarah Jenkins', role: 'Front Desk', status: 'On Duty', tasks: '12/15', rating: 4.9, avatar: 'SJ' },
  { name: 'Michael Chen', role: 'Housekeeping', status: 'On Break', tasks: '8/12', rating: 4.7, avatar: 'MC' },
  { name: 'Elena Rodriguez', role: 'Concierge', status: 'On Duty', tasks: '5/6', rating: 5.0, avatar: 'ER' },
  { name: 'David Wilson', role: 'Maintenance', status: 'Off Duty', tasks: '0/0', rating: 4.5, avatar: 'DW' },
];

export default function StaffActivityDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Staff Activity</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Monitor team performance and shift management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-[#1a1a1a]/5 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            Manage Roster
          </button>
          <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            Assign Tasks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Staff On Duty</p>
            <h3 className="text-xl font-serif">24 Members</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Tasks Completed</p>
            <h3 className="text-xl font-serif">142 / 180</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Avg. Response Time</p>
            <h3 className="text-xl font-serif">4.2 Minutes</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <h3 className="text-lg font-serif">Team Performance</h3>
          <div className="flex items-center bg-[#f8f9fa] rounded-lg px-3 py-1.5 gap-2 border border-[#1a1a1a]/5">
            <Search size={14} className="text-[#1a1a1a]/30" />
            <input type="text" placeholder="Search staff..." className="bg-transparent border-none focus:outline-none text-xs" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#f8f9fa] text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tasks</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {staffMembers.map((staff, idx) => (
                <tr key={idx} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-white flex items-center justify-center text-[10px] font-bold">
                        {staff.avatar}
                      </div>
                      <span className="text-sm font-medium">{staff.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{staff.role}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
                      staff.status === 'On Duty' ? 'bg-emerald-50 text-emerald-600' :
                      staff.status === 'On Break' ? 'bg-amber-50 text-amber-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-24 space-y-1">
                      <div className="flex justify-between text-[10px] font-medium">
                        <span>{staff.tasks}</span>
                        <span>{Math.round((parseInt(staff.tasks.split('/')[0]) / parseInt(staff.tasks.split('/')[1] || '1')) * 100)}%</span>
                      </div>
                      <div className="w-full h-1 bg-[#f8f9fa] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1a1a1a] rounded-full" 
                          style={{ width: `${(parseInt(staff.tasks.split('/')[0]) / parseInt(staff.tasks.split('/')[1] || '1')) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Star size={14} className="text-amber-400 fill-amber-400" />
                      {staff.rating}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-xs font-medium text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
