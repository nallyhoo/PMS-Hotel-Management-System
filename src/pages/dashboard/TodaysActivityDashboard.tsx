import React from 'react';
import { 
  Activity, 
  LogIn, 
  LogOut, 
  Coffee, 
  Utensils, 
  Sparkles,
  Clock,
  ChevronRight
} from 'lucide-react';

const activities = [
  { time: '08:30 AM', type: 'Breakfast', guest: 'Room 204 - Smith Family', status: 'In Progress', icon: Coffee, color: 'text-amber-600', bg: 'bg-amber-50' },
  { time: '09:15 AM', type: 'Check-out', guest: 'Room 105 - Robert De Niro', status: 'Completed', icon: LogOut, color: 'text-red-600', bg: 'bg-red-50' },
  { time: '10:00 AM', type: 'Housekeeping', guest: 'Room 302, 305, 308', status: 'Scheduled', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { time: '11:45 AM', type: 'Lunch Service', guest: 'Grand Ballroom - Corporate Event', status: 'Preparing', icon: Utensils, color: 'text-blue-600', bg: 'bg-blue-50' },
  { time: '02:00 PM', type: 'Check-in', guest: 'Room 402 - Julianne Moore', status: 'Expected', icon: LogIn, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export default function TodaysActivityDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Today's Activity</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time operational log for March 10, 2026.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
          Live Updates Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-6 group hover:border-[#1a1a1a]/20 transition-all">
              <div className="text-center w-20 shrink-0">
                <p className="text-sm font-serif font-medium">{activity.time.split(' ')[0]}</p>
                <p className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/40">{activity.time.split(' ')[1]}</p>
              </div>
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${activity.bg} ${activity.color}`}>
                <activity.icon size={24} />
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium">{activity.type}</h4>
                  <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded ${activity.bg} ${activity.color}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-xs text-[#1a1a1a]/60 font-light">{activity.guest}</p>
              </div>

              <button className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                <ChevronRight size={18} className="text-[#1a1a1a]/40" />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-[#1a1a1a] text-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-lg font-serif mb-6">Operational Pulse</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <LogIn size={18} className="text-white/40" />
                  <span className="text-sm font-light">Arrivals</span>
                </div>
                <span className="text-sm font-serif">12 / 24</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '50%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-white/40" />
                  <span className="text-sm font-light">Departures</span>
                </div>
                <span className="text-sm font-serif">18 / 20</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '90%' }}></div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Sparkles size={18} className="text-white/40" />
                  <span className="text-sm font-light">Rooms Cleaned</span>
                </div>
                <span className="text-sm font-serif">45 / 62</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '72%' }}></div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <h3 className="text-lg font-serif mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[#f8f9fa] rounded-xl border-l-4 border-[#1a1a1a]">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/40 mb-1">04:00 PM</p>
                <p className="text-sm font-medium">VIP Arrival: Penthouse 01</p>
              </div>
              <div className="p-4 bg-[#f8f9fa] rounded-xl border-l-4 border-emerald-500">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#1a1a1a]/40 mb-1">07:00 PM</p>
                <p className="text-sm font-medium">Wine Tasting Event</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
