import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Edit2,
  Trash2,
  Lock,
  UserCheck,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Alexander Wright',
    email: 'alex.wright@grandview.com',
    role: 'General Manager',
    department: 'Administration',
    status: 'Active',
    lastLogin: '2026-03-10 08:45 AM',
  },
  {
    id: 'USR-002',
    name: 'Sarah Jenkins',
    email: 's.jenkins@grandview.com',
    role: 'Front Desk Manager',
    department: 'Front Office',
    status: 'Active',
    lastLogin: '2026-03-10 09:12 AM',
  },
  {
    id: 'USR-003',
    name: 'Michael Chen',
    email: 'm.chen@grandview.com',
    role: 'IT Administrator',
    department: 'IT',
    status: 'Active',
    lastLogin: '2026-03-09 11:30 PM',
  },
  {
    id: 'USR-004',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@grandview.com',
    role: 'Housekeeping Supervisor',
    department: 'Housekeeping',
    status: 'Inactive',
    lastLogin: '2026-03-05 04:20 PM',
  },
  {
    id: 'USR-005',
    name: 'David Miller',
    email: 'd.miller@grandview.com',
    role: 'Security Lead',
    department: 'Security',
    status: 'Suspended',
    lastLogin: '2026-02-28 10:15 AM',
  }
];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Inactive': return 'bg-slate-50 text-slate-700 border-slate-100';
      case 'Suspended': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">User Management</h1>
          <p className="text-sm text-[#1a1a1a]/60 mt-1">Manage system users, their access levels, and account status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors">
            <Plus size={16} />
            Add New User
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '48', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Now', value: '12', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Admin Roles', value: '5', icon: Shield, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Pending Invites', value: '3', icon: Mail, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-xl border border-[#1a1a1a]/5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#1a1a1a]/40 uppercase tracking-wider">{stat.label}</p>
              <p className="text-xl font-semibold text-[#1a1a1a]">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#1a1a1a]/40 font-medium uppercase tracking-wider">Sort by:</span>
            <select className="text-sm font-medium bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Last Login</option>
              <option>Name (A-Z)</option>
              <option>Status</option>
              <option>Role</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[#1a1a1a]/40 text-[10px] uppercase tracking-[0.15em] font-bold">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role & Dept</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8f9fa]/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center text-white font-serif italic border-2 border-white shadow-sm shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1a1a1a]">{user.name}</p>
                        <p className="text-xs text-[#1a1a1a]/40">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{user.role}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase tracking-wider font-bold">{user.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-[#1a1a1a]/60">
                      <Clock size={14} className="text-[#1a1a1a]/30" />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Edit User">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Change Password">
                        <Lock size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors" title="Delete User">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-[#1a1a1a]/5 text-[#1a1a1a]/60 rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-xs text-[#1a1a1a]/40">Showing 5 of 48 users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-xs font-medium border border-[#1a1a1a]/10 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 text-xs font-medium bg-[#1a1a1a] text-white rounded">1</button>
            <button className="px-3 py-1 text-xs font-medium border border-[#1a1a1a]/10 rounded hover:bg-gray-50">2</button>
            <button className="px-3 py-1 text-xs font-medium border border-[#1a1a1a]/10 rounded hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
