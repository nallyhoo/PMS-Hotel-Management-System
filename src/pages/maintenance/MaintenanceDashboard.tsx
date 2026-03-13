import React from 'react';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Plus,
  Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import maintenanceService from '../../api/maintenance';

const COLORS = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'];

export default function MaintenanceDashboard() {
  const navigate = useNavigate();

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['maintenance', 'dashboard'],
    queryFn: () => maintenanceService.getDashboard(),
    refetchInterval: 30000,
  });

  const stats = dashboardData?.stats || {};
  const taskDistribution = dashboardData?.taskDistribution || [];
  const weeklyPerformance = dashboardData?.weeklyPerformance || [];
  const recentRequests = dashboardData?.recentRequests || [];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData = dayNames.map((day, idx) => {
    const dayData = weeklyPerformance.find((w: any) => parseInt(w.day) === idx);
    return {
      day,
      reported: dayData?.reported || 0,
      completed: dayData?.completed || 0,
    };
  });

  const formatStatus = (status: string) => {
    if (!status) return 'Pending';
    return status;
  };

  const formatPriority = (priority: string) => {
    if (!priority) return 'Normal';
    return priority;
  };

  const getPriorityColor = (priority: string) => {
    const p = formatPriority(priority).toLowerCase();
    if (p === 'urgent' || p === 'high') return 'text-red-600 bg-red-50';
    if (p === 'medium') return 'text-amber-600 bg-amber-50';
    return 'text-blue-600 bg-blue-50';
  };

  const getStatusColor = (status: string) => {
    const s = formatStatus(status).toLowerCase();
    if (s === 'completed') return 'text-emerald-600 bg-emerald-50';
    if (s === 'in progress') return 'text-indigo-600 bg-indigo-50';
    if (s === 'pending') return 'text-slate-600 bg-slate-50';
    return 'text-slate-600 bg-slate-50';
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a] mx-auto"></div>
        <p className="mt-4 text-[#1a1a1a]/40">Loading dashboard...</p>
      </div>
    );
  }

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
          <button 
            onClick={() => navigate('/maintenance/request')}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm"
          >
            <Plus size={16} />
            New Request
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Wrench size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Total Requests</p>
          <p className="text-2xl font-serif">{stats.totalRequests || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Urgent Tasks</p>
          <p className="text-2xl font-serif">{stats.urgentRequests || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Clock size={18} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">In Progress</p>
          <p className="text-2xl font-serif">{stats.inProgressRequests || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <CheckCircle2 size={18} className="text-emerald-600" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">Completed Today</p>
          <p className="text-2xl font-serif">{stats.completedToday || 0}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Performance */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
          <h3 className="text-lg font-serif">Weekly Performance</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1a1a1a66' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#1a1a1a66' }} />
                <Tooltip />
                <Bar dataKey="reported" fill="#1a1a1a" radius={[4, 4, 0, 0]} name="Reported" />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
          <h3 className="text-lg font-serif">Task Distribution</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                >
                  {taskDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {taskDistribution.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-xs font-medium">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#1a1a1a]/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-serif">Recent Requests</h3>
            <button 
              onClick={() => navigate('/maintenance/tasks')}
              className="text-xs font-medium text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
            >
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f9fa]">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">ID</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Location</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Issue</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Priority</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Assigned To</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {recentRequests.length > 0 ? recentRequests.map((request: any) => (
                <tr 
                  key={request.requestId} 
                  className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                  onClick={() => navigate(`/maintenance/tasks/${request.requestId}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">MNT-{request.requestId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">Room {request.roomNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{request.requestType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getPriorityColor(request.priority)}`}>
                      {formatPriority(request.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${getStatusColor(request.status)}`}>
                      {formatStatus(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">
                      {request.assignedToFirstName ? `${request.assignedToFirstName} ${request.assignedToLastName || ''}` : 'Unassigned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={16} className="text-[#1a1a1a]/30" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#1a1a1a]/40">
                    No maintenance requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
