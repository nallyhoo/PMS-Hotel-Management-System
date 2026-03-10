import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Save, CheckCircle2 } from 'lucide-react';
import { mockStaff } from '../../data/mockStaff';

export default function StaffRoleAssignmentPage() {
  const navigate = useNavigate();
  const [selectedStaff, setSelectedStaff] = useState(mockStaff[0].id);
  const [selectedRole, setSelectedRole] = useState(mockStaff[0].role);

  const roles = [
    { title: 'Administrator', description: 'Full access to all system modules and settings.' },
    { title: 'Manager', description: 'Access to department dashboards, reports, and staff management.' },
    { title: 'Receptionist', description: 'Manage reservations, check-ins, check-outs, and guest profiles.' },
    { title: 'Housekeeper', description: 'View and update room cleaning tasks and status.' },
    { title: 'Maintenance', description: 'Manage maintenance requests and task status.' },
    { title: 'Staff', description: 'Basic access to own schedule and attendance.' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Assigning role:', { selectedStaff, selectedRole });
    // In a real app, this would update the user's role in the DB
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/staff/list')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Role Assignment</h1>
          <p className="text-sm text-[#1a1a1a]/60">Manage system permissions and access levels</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40 block mb-4">Select Staff Member</label>
            <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {mockStaff.map((staff) => (
                <button
                  key={staff.id}
                  onClick={() => {
                    setSelectedStaff(staff.id);
                    setSelectedRole(staff.role);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedStaff === staff.id 
                      ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white' 
                      : 'bg-white border-[#1a1a1a]/5 text-[#1a1a1a] hover:bg-[#f8f9fa]'
                  }`}
                >
                  <p className="text-sm font-medium">{staff.name}</p>
                  <p className={`text-[10px] uppercase tracking-widest font-bold ${selectedStaff === staff.id ? 'text-white/60' : 'text-[#1a1a1a]/40'}`}>
                    {staff.role}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
            <div className="p-6 border-b border-[#1a1a1a]/5">
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-1">Assign System Role</h3>
              <p className="text-xs text-[#1a1a1a]/40">Choose the appropriate access level for {mockStaff.find(s => s.id === selectedStaff)?.name}</p>
            </div>
            
            <div className="p-6 grid grid-cols-1 gap-4">
              {roles.map((role) => (
                <label 
                  key={role.title}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedRole === role.title 
                      ? 'border-[#1a1a1a] bg-[#1a1a1a]/5' 
                      : 'border-transparent bg-[#f8f9fa] hover:border-[#1a1a1a]/10'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="role" 
                    className="mt-1"
                    checked={selectedRole === role.title}
                    onChange={() => setSelectedRole(role.title)}
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a1a]">{role.title}</p>
                    <p className="text-xs text-[#1a1a1a]/60 leading-relaxed mt-1">{role.description}</p>
                  </div>
                  {selectedRole === role.title && (
                    <CheckCircle2 size={20} className="ml-auto text-[#1a1a1a]" />
                  )}
                </label>
              ))}
            </div>

            <div className="p-6 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                <span>Confirm Assignment</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
