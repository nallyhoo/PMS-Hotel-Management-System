import React from 'react';
import { 
  Shield, 
  Users, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Eye,
  Settings
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionsCount: number;
  isSystem?: boolean;
  status: 'Active' | 'Inactive';
}

const mockRoles: Role[] = [
  {
    id: 'ROL-001',
    name: 'Super Admin',
    description: 'Full system access with all permissions. Can manage other admins.',
    usersCount: 2,
    permissionsCount: 156,
    isSystem: true,
    status: 'Active'
  },
  {
    id: 'ROL-002',
    name: 'General Manager',
    description: 'Access to all operational modules and financial reports.',
    usersCount: 3,
    permissionsCount: 124,
    isSystem: true,
    status: 'Active'
  },
  {
    id: 'ROL-003',
    name: 'Front Desk Agent',
    description: 'Access to reservations, check-in/out, and guest profiles.',
    usersCount: 15,
    permissionsCount: 45,
    status: 'Active'
  },
  {
    id: 'ROL-004',
    name: 'Housekeeping Supervisor',
    description: 'Manage cleaning tasks, staff schedules, and room status.',
    usersCount: 5,
    permissionsCount: 32,
    status: 'Active'
  },
  {
    id: 'ROL-005',
    name: 'Maintenance Staff',
    description: 'View and update assigned maintenance requests.',
    usersCount: 8,
    permissionsCount: 12,
    status: 'Active'
  },
  {
    id: 'ROL-006',
    name: 'Auditor',
    description: 'Read-only access to financial reports and transaction history.',
    usersCount: 2,
    permissionsCount: 18,
    status: 'Inactive'
  }
];

export default function RoleManagement() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Role Management</h1>
          <p className="text-sm text-[#1a1a1a]/60 mt-1">Define and manage user roles and their associated access levels.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors">
          <Plus size={16} />
          Create New Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden flex flex-col group hover:border-[#1a1a1a]/20 transition-all">
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.isSystem ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                  <Shield size={24} />
                </div>
                <div className="flex items-center gap-2">
                  {role.isSystem && (
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">System</span>
                  )}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${role.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {role.status}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{role.name}</h3>
              <p className="text-sm text-[#1a1a1a]/60 line-clamp-2 mb-6 min-h-[40px]">
                {role.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f8f9fa] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-[#1a1a1a]/40 mb-1">
                    <Users size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Users</span>
                  </div>
                  <p className="text-lg font-bold text-[#1a1a1a]">{role.usersCount}</p>
                </div>
                <div className="bg-[#f8f9fa] p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-[#1a1a1a]/40 mb-1">
                    <Lock size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Permissions</span>
                  </div>
                  <p className="text-lg font-bold text-[#1a1a1a]">{role.permissionsCount}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex items-center justify-between">
              <button className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors flex items-center gap-2">
                <Settings size={14} />
                Edit Permissions
              </button>
              <div className="flex items-center gap-1">
                <button className="p-2 hover:bg-white rounded-lg text-[#1a1a1a]/40 hover:text-blue-600 transition-all" title="Edit Role">
                  <Edit2 size={16} />
                </button>
                {!role.isSystem && (
                  <button className="p-2 hover:bg-white rounded-lg text-[#1a1a1a]/40 hover:text-red-600 transition-all" title="Delete Role">
                    <Trash2 size={16} />
                  </button>
                )}
                <button className="p-2 hover:bg-white rounded-lg text-[#1a1a1a]/40 hover:text-[#1a1a1a] transition-all">
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Role Card */}
        <button className="bg-white rounded-2xl border-2 border-dashed border-[#1a1a1a]/10 p-6 flex flex-col items-center justify-center gap-4 hover:border-[#1a1a1a]/30 hover:bg-[#f8f9fa] transition-all group min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-[#f8f9fa] flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus size={32} className="text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/40" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-[#1a1a1a]">Create Custom Role</p>
            <p className="text-sm text-[#1a1a1a]/40">Define specific access rules</p>
          </div>
        </button>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4">
        <AlertCircle className="text-blue-600 shrink-0" size={20} />
        <div>
          <h4 className="text-sm font-semibold text-blue-900">Security Note</h4>
          <p className="text-xs text-blue-800/70 mt-1">
            System roles (Super Admin, General Manager) cannot be deleted and have predefined core permissions. 
            Changes to role permissions will take effect for all assigned users upon their next login.
          </p>
        </div>
      </div>
    </div>
  );
}
