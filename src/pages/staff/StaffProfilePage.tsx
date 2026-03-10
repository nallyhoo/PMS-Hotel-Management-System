import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Clock, 
  Award,
  Briefcase,
  MapPin,
  CheckCircle2,
  History
} from 'lucide-react';
import { mockStaff, mockAttendance } from '../../data/mockStaff';

export default function StaffProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const staff = mockStaff.find(s => s.id === id);
  const attendance = mockAttendance.filter(a => a.staffId === id);

  if (!staff) {
    return (
      <div className="p-12 text-center">
        <p className="text-[#1a1a1a]/40 italic">Staff member not found.</p>
        <button onClick={() => navigate('/staff/list')} className="mt-4 text-[#1a1a1a] underline">Back to list</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/staff/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">{staff.name}</h1>
            <p className="text-sm text-[#1a1a1a]/60">{staff.role} • {staff.department}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate(`/staff/schedule/${staff.id}`)}
            className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2"
          >
            <Calendar size={18} />
            <span>View Schedule</span>
          </button>
          <button 
            onClick={() => navigate(`/staff/edit/${staff.id}`)}
            className="px-4 py-2 rounded-lg bg-[#1a1a1a] text-white text-sm font-medium hover:bg-[#333] transition-colors flex items-center gap-2"
          >
            <Edit size={18} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#1a1a1a] mx-auto mb-4 flex items-center justify-center text-white text-3xl font-serif italic border-4 border-[#f8f9fa]">
              {staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-lg font-medium text-[#1a1a1a]">{staff.name}</h2>
            <p className="text-xs text-[#1a1a1a]/40 uppercase tracking-widest font-bold mb-4">{staff.id}</p>
            <span className={`text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full ${
              staff.status === 'active' 
                ? 'bg-emerald-100 text-emerald-700' 
                : staff.status === 'on-leave'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {staff.status}
            </span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-[#1a1a1a]/30" />
                <span className="text-[#1a1a1a]">{staff.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-[#1a1a1a]/30" />
                <span className="text-[#1a1a1a]">{staff.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-[#1a1a1a]/30" />
                <span className="text-[#1a1a1a]">123 Staff Housing, GrandView Resort</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 p-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Employment Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Briefcase size={16} className="text-[#1a1a1a]/30" />
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">Department</p>
                  <p className="text-[#1a1a1a]">{staff.department}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-[#1a1a1a]/30" />
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">Role & Permissions</p>
                  <p className="text-[#1a1a1a]">{staff.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-[#1a1a1a]/30" />
                <div>
                  <p className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">Joined Date</p>
                  <p className="text-[#1a1a1a]">{staff.joinDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Performance & Attendance */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 size={20} className="text-emerald-500" />
                <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Attendance</p>
              </div>
              <p className="text-2xl font-serif font-medium">98.5%</p>
              <p className="text-xs text-emerald-600 mt-1">+2.1% from last month</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
              <div className="flex items-center gap-3 mb-2">
                <Award size={20} className="text-amber-500" />
                <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Performance</p>
              </div>
              <p className="text-2xl font-serif font-medium">4.8/5.0</p>
              <p className="text-xs text-[#1a1a1a]/40 mt-1">Based on peer reviews</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-blue-500" />
                <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Overtime</p>
              </div>
              <p className="text-2xl font-serif font-medium">12.5h</p>
              <p className="text-xs text-[#1a1a1a]/40 mt-1">Current month</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
            <div className="p-4 border-b border-[#1a1a1a]/5 flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#1a1a1a]/40">Recent Attendance</h3>
              <button 
                onClick={() => navigate(`/staff/attendance`)}
                className="text-xs text-[#1a1a1a] hover:underline flex items-center gap-1"
              >
                View Full Logs <History size={12} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Check In</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Check Out</th>
                    <th className="px-6 py-3 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/5">
                  {attendance.map((record) => (
                    <tr key={record.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#1a1a1a]">{record.date}</td>
                      <td className="px-6 py-4 text-sm text-[#1a1a1a]/60 font-mono">{record.checkIn}</td>
                      <td className="px-6 py-4 text-sm text-[#1a1a1a]/60 font-mono">{record.checkOut}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                          record.status === 'present' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : record.status === 'late'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-[#1a1a1a]/40 italic">No recent attendance records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
