import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  User, 
  Globe, 
  Monitor, 
  ChevronRight,
  Clock,
  Shield,
  FileText,
  Settings,
  CreditCard,
  DoorOpen,
  Info
} from 'lucide-react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    role: string;
    avatar?: string;
  };
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
}

const mockActivities: ActivityItem[] = [
  {
    id: 'ACT-001',
    user: { name: 'Alexander Wright', role: 'General Manager' },
    action: 'Modified Room Pricing',
    module: 'Room Management',
    details: 'Changed base price for Deluxe Suite from $250 to $275',
    timestamp: '2026-03-10 10:45:22 AM',
    ipAddress: '192.168.1.45',
    severity: 'Medium'
  },
  {
    id: 'ACT-002',
    user: { name: 'Sarah Jenkins', role: 'Front Desk Manager' },
    action: 'Processed Refund',
    module: 'Billing & Finance',
    details: 'Refunded $150.00 to Guest: John Doe (Booking #BK-8821)',
    timestamp: '2026-03-10 10:30:15 AM',
    ipAddress: '192.168.1.12',
    severity: 'High'
  },
  {
    id: 'ACT-003',
    user: { name: 'Michael Chen', role: 'IT Administrator' },
    action: 'Updated Permission Set',
    module: 'Security Management',
    details: 'Added "Export" permission to Front Desk Agent role',
    timestamp: '2026-03-10 09:15:00 AM',
    ipAddress: '10.0.0.5',
    severity: 'Critical'
  },
  {
    id: 'ACT-004',
    user: { name: 'Elena Rodriguez', role: 'Housekeeping Supervisor' },
    action: 'Assigned Cleaning Task',
    module: 'Housekeeping',
    details: 'Assigned Room 302 cleaning to Staff: Maria Garcia',
    timestamp: '2026-03-10 08:50:45 AM',
    ipAddress: '192.168.1.28',
    severity: 'Low'
  },
  {
    id: 'ACT-005',
    user: { name: 'David Miller', role: 'Security Lead' },
    action: 'Viewed Security Logs',
    module: 'Security Management',
    details: 'Accessed system activity logs for the period 2026-03-01 to 2026-03-09',
    timestamp: '2026-03-10 08:12:33 AM',
    ipAddress: '192.168.1.102',
    severity: 'Medium'
  }
];

export default function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState('');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Medium': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'High': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'Critical': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'Room Management': return <DoorOpen size={14} />;
      case 'Billing & Finance': return <CreditCard size={14} />;
      case 'Security Management': return <Shield size={14} />;
      case 'Housekeeping': return <Activity size={14} />;
      default: return <Settings size={14} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Activity Log</h1>
          <p className="text-sm text-[#1a1a1a]/60 mt-1">Track all system actions and administrative changes for audit purposes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Calendar size={16} />
            Last 24 Hours
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors">
            <Download size={16} />
            Export Log
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm font-medium focus:outline-none">
            <option>All Modules</option>
            <option>Reservations</option>
            <option>Billing</option>
            <option>Security</option>
            <option>Housekeeping</option>
          </select>
          <select className="px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm font-medium focus:outline-none">
            <option>All Severities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Critical</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[#1a1a1a]/40 text-[10px] uppercase tracking-[0.15em] font-bold">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action & Module</th>
                <th className="px-6 py-4">Details</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {mockActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-[#f8f9fa]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#1a1a1a]">{activity.timestamp.split(' ')[1]} {activity.timestamp.split(' ')[2]}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 font-medium">{activity.timestamp.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-[10px] font-serif italic shrink-0">
                        {activity.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#1a1a1a]">{activity.user.name}</p>
                        <p className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider font-bold">{activity.user.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold text-[#1a1a1a]">{activity.action}</span>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#1a1a1a]/40 font-bold uppercase tracking-wider">
                        {getModuleIcon(activity.module)}
                        {activity.module}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-[#1a1a1a]/60 max-w-xs leading-relaxed">
                      {activity.details}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(activity.severity)}`}>
                      {activity.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-[10px] font-mono text-[#1a1a1a]/40">
                      <Globe size={12} />
                      {activity.ipAddress}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1a1a1a]/5 flex items-center justify-between bg-[#f8f9fa]/30">
          <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/40 font-medium">
            <Info size={14} />
            Logs are retained for 90 days as per security policy.
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium border border-[#1a1a1a]/10 rounded hover:bg-white transition-colors">Load More Activities</button>
          </div>
        </div>
      </div>
    </div>
  );
}
