import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  ChevronRight, 
  Check, 
  X, 
  Save, 
  RotateCcw,
  Lock,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Users,
  CreditCard,
  Settings,
  Bell
} from 'lucide-react';

interface PermissionGroup {
  id: string;
  name: string;
  icon: any;
  permissions: {
    id: string;
    name: string;
    description: string;
    actions: ('view' | 'create' | 'edit' | 'delete' | 'export')[];
  }[];
}

const permissionGroups: PermissionGroup[] = [
  {
    id: 'grp-1',
    name: 'Reservations',
    icon: FileText,
    permissions: [
      { id: 'p1', name: 'Bookings', description: 'Manage guest reservations and bookings', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { id: 'p2', name: 'Calendar', description: 'View and manage reservation calendar', actions: ['view', 'edit'] },
      { id: 'p3', name: 'Booking Sources', description: 'Manage and view booking source analytics', actions: ['view', 'export'] }
    ]
  },
  {
    id: 'grp-2',
    name: 'Guest Management',
    icon: Users,
    permissions: [
      { id: 'p4', name: 'Guest Profiles', description: 'Manage guest personal information and history', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { id: 'p5', name: 'Guest Loyalty', description: 'Manage guest loyalty points and status', actions: ['view', 'edit'] }
    ]
  },
  {
    id: 'grp-3',
    name: 'Billing & Finance',
    icon: CreditCard,
    permissions: [
      { id: 'p6', name: 'Invoices', description: 'Manage invoices and billing documents', actions: ['view', 'create', 'edit', 'delete', 'export'] },
      { id: 'p7', name: 'Payments', description: 'Process and record guest payments', actions: ['view', 'create', 'edit', 'export'] },
      { id: 'p8', name: 'Financial Reports', description: 'Access detailed revenue and financial reports', actions: ['view', 'export'] }
    ]
  },
  {
    id: 'grp-4',
    name: 'System Administration',
    icon: Settings,
    permissions: [
      { id: 'p9', name: 'User Management', description: 'Manage system users and accounts', actions: ['view', 'create', 'edit', 'delete'] },
      { id: 'p10', name: 'Security Settings', description: 'Manage roles, permissions, and security logs', actions: ['view', 'edit'] },
      { id: 'p11', name: 'Hotel Config', description: 'Manage hotel information and system settings', actions: ['view', 'edit'] }
    ]
  }
];

export default function PermissionSettings() {
  const [selectedRole, setSelectedRole] = useState('Front Desk Agent');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Permission Settings</h1>
          <p className="text-sm text-[#1a1a1a]/60 mt-1">Configure granular access controls for each system role.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            <RotateCcw size={16} />
            Reset to Default
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-colors">
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Role Selector */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1a1a1a]/40 mb-4">Select Role</h3>
            <div className="space-y-1">
              {['Super Admin', 'General Manager', 'Front Desk Agent', 'Housekeeping Supervisor', 'Maintenance Staff'].map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedRole === role 
                      ? 'bg-[#1a1a1a] text-white' 
                      : 'text-[#1a1a1a]/60 hover:bg-[#f8f9fa] hover:text-[#1a1a1a]'
                  }`}
                >
                  {role}
                  {selectedRole === role && <ChevronRight size={14} />}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <Shield size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Security Tip</span>
            </div>
            <p className="text-xs text-amber-800/70 leading-relaxed">
              Always follow the principle of least privilege. Only grant permissions that are absolutely necessary for the role's responsibilities.
            </p>
          </div>
        </div>

        {/* Permissions Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[#1a1a1a]/5 bg-[#f8f9fa]/50">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-[#1a1a1a]/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/5 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-[#1a1a1a]/5">
              {permissionGroups.map((group) => (
                <div key={group.id} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-[#1a1a1a]/5 rounded-lg flex items-center justify-center text-[#1a1a1a]/60">
                      <group.icon size={18} />
                    </div>
                    <h3 className="font-semibold text-[#1a1a1a]">{group.name}</h3>
                  </div>

                  <div className="space-y-6">
                    {group.permissions.map((permission) => (
                      <div key={permission.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#1a1a1a]/5 hover:bg-[#f8f9fa] transition-colors">
                        <div className="max-w-md">
                          <p className="text-sm font-bold text-[#1a1a1a]">{permission.name}</p>
                          <p className="text-xs text-[#1a1a1a]/40 mt-0.5">{permission.description}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          {['view', 'create', 'edit', 'delete', 'export'].map((action) => {
                            const isAvailable = permission.actions.includes(action as any);
                            const isChecked = Math.random() > 0.3; // Mock state

                            return (
                              <button
                                key={action}
                                disabled={!isAvailable}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                  !isAvailable 
                                    ? 'bg-gray-50 text-gray-300 cursor-not-allowed border border-transparent' 
                                    : isChecked
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                      : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                {isChecked && isAvailable ? <Check size={12} /> : <X size={12} className={!isAvailable ? 'opacity-0' : ''} />}
                                {action}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
