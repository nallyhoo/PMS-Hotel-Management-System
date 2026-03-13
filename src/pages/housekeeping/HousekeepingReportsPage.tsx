import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  FileSpreadsheet,
  Users,
  ClipboardList
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import housekeepingService from '../../api/housekeeping';
import { API_BASE_URL } from '../../api/client';

const COLORS = ['#1a1a1a', '#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

export default function HousekeepingReportsPage() {
  const navigate = useNavigate();
  const [days, setDays] = useState(7);
  const [exporting, setExporting] = useState(false);

  const { data: reportsData, isLoading, refetch } = useQuery({
    queryKey: ['housekeeping', 'reports', days],
    queryFn: () => housekeepingService.getReports(days),
  });

  const { data: dailySummary } = useQuery({
    queryKey: ['housekeeping', 'daily-summary'],
    queryFn: () => housekeepingService.getDailySummary(),
  });

  const formatMinutes = (minutes: number | null | undefined) => {
    if (!minutes || isNaN(minutes)) return '0m';
    return `${Math.round(minutes)}m`;
  };

  const getStatValue = (val: number | undefined | null) => {
    if (val === undefined || val === null || isNaN(val)) return 0;
    return val;
  };

  const handleExportTasks = async () => {
    setExporting(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date().toISOString().split('T')[0];
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const response = await fetch(`${API_BASE_URL}/housekeeping/export/tasks?startDate=${startDateStr}&endDate=${endDate}&format=csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `housekeeping_tasks_${startDateStr}_${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleExportStaff = async () => {
    setExporting(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const endDate = new Date().toISOString().split('T')[0];
      const startDateStr = startDate.toISOString().split('T')[0];
      
      const response = await fetch(`${API_BASE_URL}/housekeeping/export/staff-performance?startDate=${startDateStr}&endDate=${endDate}&format=csv`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `staff_performance_${startDateStr}_${endDate}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const stats = [
    { label: 'Avg. Cleaning Time', value: formatMinutes(reportsData?.avgCleaningTime), icon: Clock, trend: reportsData?.avgCleaningTime ? `${Math.round(getStatValue(reportsData.avgCleaningTime))}m avg` : 'N/A', color: 'text-blue-600' },
    { label: 'Tasks Completed', value: (reportsData?.staffProductivity || []).reduce((sum: number, s: any) => sum + getStatValue(s.completedTasks ?? s.CompletedTasks), 0), icon: CheckCircle2, trend: 'View details', color: 'text-emerald-600' },
    { label: 'Inspection Pass Rate', value: `${Math.round(getStatValue(reportsData?.passRate))}%`, icon: TrendingUp, trend: `${Math.round(getStatValue(reportsData?.passRate))}% pass rate`, color: 'text-indigo-600' },
    { label: 'Delayed Tasks', value: getStatValue(reportsData?.delayedTasks), icon: AlertTriangle, trend: `${getStatValue(reportsData?.delayedTasks)} overdue`, color: 'text-amber-600' },
  ];

  const chartData = (reportsData?.staffProductivity || []).map((s: any) => ({
    name: (s.firstName || s.FirstName) && (s.lastName || s.LastName) ? `${(s.firstName || s.FirstName)[0]}. ${s.lastName || s.LastName}` : 'Unknown',
    completed: s.completedTasks ?? s.CompletedTasks ?? 0,
    target: Math.ceil((s.completedTasks ?? s.CompletedTasks ?? 0) * 1.2),
  }));

  const cleaningTypeData = (reportsData?.tasksByType || []).map((t: any) => ({
    name: t.taskType || t.TaskType || 'Unknown',
    value: t.count || t.Count || 0,
  }));

  const statusData = (reportsData?.tasksByStatus || []).map((t: any) => ({
    name: t.status || t.Status || 'Unknown',
    value: t.count || t.Count || 0,
  }));

  const totalTasks = cleaningTypeData.reduce((sum, t) => sum + t.value, 0);

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
            <h1 className="text-3xl font-serif font-light mb-1">Housekeeping Reports</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Analyze cleaning performance and operational efficiency.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors bg-white"
          >
            <option value={7}>Last 7 Days</option>
            <option value={14}>Last 14 Days</option>
            <option value={30}>Last 30 Days</option>
          </select>
          <div className="relative group">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
              <Download size={16} /> Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#1a1a1a]/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button 
                onClick={handleExportTasks}
                disabled={exporting}
                className="w-full px-4 py-3 text-left text-xs font-medium hover:bg-[#f8f9fa] flex items-center gap-2 first:rounded-t-xl"
              >
                <FileSpreadsheet size={14} /> Export Tasks (CSV)
              </button>
              <button 
                onClick={handleExportStaff}
                disabled={exporting}
                className="w-full px-4 py-3 text-left text-xs font-medium hover:bg-[#f8f9fa] flex items-center gap-2 last:rounded-b-xl"
              >
                <Users size={14} /> Export Staff Performance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-[#f8f9fa] rounded-lg ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">{stat.trend}</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 mb-1">{stat.label}</p>
            <p className="text-2xl font-serif">{stat.value}</p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm text-center">
          <p className="text-[#1a1a1a]/40">Loading reports...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Chart */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Staff Productivity</h3>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                <Calendar size={12} /> Last {days} Days
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#1a1a1a66', fontWeight: 600 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#1a1a1a66', fontWeight: 600 }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8f9fa' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="completed" fill="#1a1a1a" radius={[4, 4, 0, 0]} name="Completed" />
                  <Bar dataKey="target" fill="#e5e5e5" radius={[4, 4, 0, 0]} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task Status Pie Chart */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Task Status Distribution</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {statusData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-xs font-medium">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning Type Breakdown */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <h3 className="text-lg font-serif">Cleaning Type Distribution</h3>
            <div className="space-y-6">
              {cleaningTypeData.length > 0 ? cleaningTypeData.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#1a1a1a]/60">{item.name}</span>
                    <span className="font-medium">{item.value} tasks</span>
                  </div>
                  <div className="h-1.5 bg-[#f8f9fa] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1a1a1a]" 
                      style={{ width: `${totalTasks > 0 ? (item.value / totalTasks) * 100 : 0}%` }} 
                    />
                  </div>
                </div>
              )) : (
                <p className="text-sm text-[#1a1a1a]/40 text-center py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Daily Summary */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif">Today's Summary</h3>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                <Calendar size={12} /> {dailySummary?.date || new Date().toISOString().split('T')[0]}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#f8f9fa] rounded-xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Total Tasks</p>
                <p className="text-2xl font-serif mt-1">{dailySummary?.summary?.totalTasks ?? dailySummary?.summary?.TotalTasks ?? 0}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600">Completed</p>
                <p className="text-2xl font-serif mt-1 text-emerald-600">{(dailySummary?.summary?.completed ?? dailySummary?.summary?.Completed ?? 0) + (dailySummary?.summary?.verified ?? dailySummary?.summary?.Verified ?? 0)}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600">Pending</p>
                <p className="text-2xl font-serif mt-1 text-amber-600">{dailySummary?.summary?.pending ?? dailySummary?.summary?.Pending ?? 0}</p>
              </div>
              <div className="p-4 bg-indigo-50 rounded-xl">
                <p className="text-[10px] uppercase tracking-widest font-bold text-indigo-600">In Progress</p>
                <p className="text-2xl font-serif mt-1 text-indigo-600">{dailySummary?.summary?.inProgress ?? dailySummary?.summary?.InProgress ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
