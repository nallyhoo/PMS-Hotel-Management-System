import React from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const stats = [
  { label: 'Total Requests', value: '42', change: '+5%', trend: 'up', icon: Wrench, color: 'blue' },
  { label: 'Urgent Tasks', value: '8', change: '-2', trend: 'down', icon: AlertTriangle, color: 'red' },
  { label: 'In Progress', value: '15', change: '+3', trend: 'up', icon: Clock, color: 'amber' },
  { label: 'Completed Today', value: '12', change: '+4', trend: 'up', icon: CheckCircle2, color: 'emerald' },
];

const taskDistribution = [
  { name: 'Plumbing', value: 35, color: '#3b82f6' },
  { name: 'Electrical', value: 25, color: '#ef4444' },
  { name: 'HVAC', value: 20, color: '#f59e0b' },
  { name: 'General', value: 20, color: '#10b981' },
];

const weeklyPerformance = [
  { day: 'Mon', completed: 8, reported: 10 },
  { day: 'Tue', completed: 12, reported: 15 },
  { day: 'Wed', completed: 10, reported: 12 },
  { day: 'Thu', completed: 15, reported: 14 },
  { day: 'Fri', completed: 14, reported: 18 },
  { day: 'Sat', completed: 9, reported: 8 },
  { day: 'Sun', completed: 6, reported: 5 },
];

const recentTasks = [
  { id: 'MNT-2041', location: 'Room 402', issue: 'AC Leaking', priority: 'High', status: 'In Progress', assignedTo: 'David K.' },
  { id: 'MNT-2042', location: 'Lobby', issue: 'Light Bulb Out', priority: 'Low', status: 'Pending', assignedTo: 'Unassigned' },
  { id: 'MNT-2043', location: 'Pool Area', issue: 'Filter Cleaning', priority: 'Medium', status: 'Completed', assignedTo: 'Sarah M.' },
  { id: 'MNT-2044', location: 'Room 105', issue: 'Door Lock Jammed', priority: 'High', status: 'In Progress', assignedTo: 'David K.' },
];

export default function MaintenanceDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Maintenance Dashboard</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Monitor and manage facility maintenance operations</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
            <Plus size={16} />
            New Request
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change}
                {stat.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </div>
            </div>
            <p className="text-2xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            <p className="text-sm text-[#1a1a1a]/40 font-medium uppercase tracking-wider mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Performance */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-serif text-lg font-medium">Weekly Performance</h3>
            <select className="text-xs font-medium bg-[#f8f9fa] border-none rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip 
                  cursor={{ fill: '#f8f9fa' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="reported" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Reported" />
                <Bar dataKey="completed" fill="#1a1a1a" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <h3 className="font-serif text-lg font-medium mb-8">Task Distribution</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-4">
            {taskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-[#1a1a1a]/60">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5 flex items-center justify-between">
          <h3 className="font-serif text-lg font-medium">Recent Tasks</h3>
          <button className="text-sm font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Task ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Location</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Issue</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Priority</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {recentTasks.map((task) => (
                <tr key={task.id} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{task.id}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{task.location}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{task.issue}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                      task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{task.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
