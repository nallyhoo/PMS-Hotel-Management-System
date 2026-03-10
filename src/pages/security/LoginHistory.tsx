import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Monitor, 
  Smartphone, 
  Globe, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Clock,
  MapPin,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LoginRecord {
  id: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  timestamp: string;
  status: 'Success' | 'Failed' | 'MFA Pending';
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  failureReason?: string;
}

const mockLoginHistory: LoginRecord[] = [
  {
    id: 'LOG-001',
    user: { name: 'Alexander Wright', email: 'alex.wright@grandview.com' },
    timestamp: '2026-03-10 08:45:12 AM',
    status: 'Success',
    device: 'MacBook Pro',
    browser: 'Chrome 122.0',
    location: 'London, UK',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'LOG-002',
    user: { name: 'Sarah Jenkins', email: 's.jenkins@grandview.com' },
    timestamp: '2026-03-10 08:30:05 AM',
    status: 'Success',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    location: 'London, UK',
    ipAddress: '192.168.1.12'
  },
  {
    id: 'LOG-003',
    user: { name: 'Unknown User', email: 'admin@grandview.com' },
    timestamp: '2026-03-10 04:15:33 AM',
    status: 'Failed',
    device: 'Windows PC',
    browser: 'Firefox 123.0',
    location: 'Moscow, RU',
    ipAddress: '45.12.88.102',
    failureReason: 'Invalid Password'
  },
  {
    id: 'LOG-004',
    user: { name: 'Michael Chen', email: 'm.chen@grandview.com' },
    timestamp: '2026-03-09 11:30:00 PM',
    status: 'MFA Pending',
    device: 'Windows PC',
    browser: 'Edge 121.0',
    location: 'London, UK',
    ipAddress: '10.0.0.5'
  },
  {
    id: 'LOG-005',
    user: { name: 'Elena Rodriguez', email: 'e.rodriguez@grandview.com' },
    timestamp: '2026-03-09 09:12:45 AM',
    status: 'Success',
    device: 'iPad Air',
    browser: 'Safari Mobile',
    location: 'London, UK',
    ipAddress: '192.168.1.28'
  }
];

export default function LoginHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Success':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <CheckCircle2 size={12} />
            Success
          </span>
        );
      case 'Failed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-700 border border-red-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <XCircle size={12} />
            Failed
          </span>
        );
      case 'MFA Pending':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck size={12} />
            MFA Pending
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Login History</h1>
          <p className="text-sm text-[#1a1a1a]/60 mt-1">Monitor user access attempts and identify potential security threats.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <AlertTriangle size={16} className="text-red-500" />
            View Failed Attempts
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors">
            <Download size={16} />
            Download CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-xs font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Total Logins (24h)</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-[#1a1a1a]">142</h3>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">+12% vs yesterday</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-xs font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Failed Attempts</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-red-600">8</h3>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">High Alert</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm">
          <p className="text-xs font-bold text-[#1a1a1a]/40 uppercase tracking-widest mb-2">Unique Devices</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-[#1a1a1a]">34</h3>
            <span className="text-xs font-bold text-[#1a1a1a]/40 bg-[#f8f9fa] px-2 py-1 rounded">Normal</span>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input
              type="text"
              placeholder="Search by user or IP..."
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-[#f8f9fa] rounded-lg text-[#1a1a1a]/60 transition-colors">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[#1a1a1a]/40 text-[10px] uppercase tracking-[0.15em] font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Device & Browser</th>
                <th className="px-6 py-4">Location & IP</th>
                <th className="px-6 py-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {mockLoginHistory.map((record) => (
                <tr key={record.id} className="hover:bg-[#f8f9fa]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white text-[10px] font-serif italic shrink-0">
                        {record.user.name === 'Unknown User' ? '?' : record.user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${record.user.name === 'Unknown User' ? 'text-red-600' : 'text-[#1a1a1a]'}`}>
                          {record.user.name}
                        </p>
                        <p className="text-[10px] text-[#1a1a1a]/40 font-medium">{record.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(record.status)}
                      {record.failureReason && (
                        <span className="text-[10px] text-red-500 font-medium ml-1">
                          Reason: {record.failureReason}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a]">
                        {record.device.includes('iPhone') || record.device.includes('iPad') ? <Smartphone size={14} /> : <Monitor size={14} />}
                        {record.device}
                      </div>
                      <span className="text-[10px] text-[#1a1a1a]/40 font-bold uppercase tracking-wider">{record.browser}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a]">
                        <MapPin size={14} className="text-[#1a1a1a]/30" />
                        {record.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-[#1a1a1a]/40 font-mono">
                        <Globe size={12} />
                        {record.ipAddress}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-xs font-bold text-[#1a1a1a]">{record.timestamp.split(' ')[1]} {record.timestamp.split(' ')[2]}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 font-medium uppercase tracking-wider">{record.timestamp.split(' ')[0]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1a1a1a]/5 flex items-center justify-center bg-[#f8f9fa]/30">
          <button className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
            View Full Login History
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
