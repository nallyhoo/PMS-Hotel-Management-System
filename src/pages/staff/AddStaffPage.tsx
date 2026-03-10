import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, UserPlus, Shield } from 'lucide-react';

export default function AddStaffPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Front Office',
    role: 'Receptionist',
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding staff:', formData);
    navigate('/staff/list');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/staff/list')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Add New Staff Member</h1>
          <p className="text-sm text-[#1a1a1a]/60">Register a new employee in the system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Full Name</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Email Address</label>
              <input 
                required
                type="email" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                placeholder="john.doe@grandview.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Phone Number</label>
              <input 
                required
                type="tel" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Join Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.joinDate}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Department</label>
              <select 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
              >
                <option>Management</option>
                <option>Front Office</option>
                <option>Housekeeping</option>
                <option>Maintenance</option>
                <option>Food & Beverage</option>
                <option>Security</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Initial Role</label>
              <select 
                className="w-full px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option>Receptionist</option>
                <option>Concierge</option>
                <option>Housekeeper</option>
                <option>Maintenance Tech</option>
                <option>Server</option>
                <option>Chef</option>
                <option>Manager</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-[#f8f9fa] border-t border-[#1a1a1a]/5 flex justify-end gap-3">
          <button 
            type="button"
            onClick={() => navigate('/staff/list')}
            className="px-6 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-6 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <UserPlus size={18} />
            <span>Register Staff</span>
          </button>
        </div>
      </form>
    </div>
  );
}
