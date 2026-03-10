import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ArrowUpDown
} from 'lucide-react';
import { mockStaff, mockAttendance } from '../../data/mockStaff';

export default function StaffAttendancePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const attendanceData = mockAttendance.map(record => {
    const staff = mockStaff.find(s => s.id === record.staffId);
    return { ...record, staffName: staff?.name || 'Unknown', role: staff?.role || 'N/A' };
  });

  const filteredAttendance = attendanceData.filter(record => 
    record.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Staff Attendance</h1>
          <p className="text-sm text-[#1a1a1a]/60">Track employee clock-in/out and punctuality</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-[#1a1a1a]/10 text-sm font-medium hover:bg-white transition-colors flex items-center gap-2">
            <Download size={18} />
            <span>Export Logs</span>
          </button>
          <button className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors">
            <Clock size={18} />
            <span>Manual Entry</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 size={20} className="text-emerald-500" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Present Today</p>
          </div>
          <p className="text-3xl font-serif font-medium">42/45</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle size={20} className="text-amber-500" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Late Arrivals</p>
          </div>
          <p className="text-3xl font-serif font-medium">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={20} className="text-red-500" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Absent</p>
          </div>
          <p className="text-3xl font-serif font-medium">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#1a1a1a]/5">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-blue-500" />
            <p className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">Avg. Punctuality</p>
          </div>
          <p className="text-3xl font-serif font-medium">96%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by staff name..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-sm text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Calendar size={18} />
              <span>Select Date</span>
            </button>
            <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a]">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#1a1a1a]/5">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Staff Member</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Check In</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Check Out</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredAttendance.map((record) => (
                <tr key={record.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm text-[#1a1a1a]">{record.staffName}</span>
                      <span className="text-[10px] text-[#1a1a1a]/40 uppercase font-bold">{record.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{record.date}</td>
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
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => navigate(`/staff/profile/${record.staffId}`)}
                      className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                    >
                      <ArrowUpDown size={16} className="rotate-90" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
