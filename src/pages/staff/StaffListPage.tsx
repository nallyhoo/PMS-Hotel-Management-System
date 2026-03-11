import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Shield,
  ExternalLink,
  Edit,
  Calendar,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useEmployees } from '../../api/hooks';
import type { Employee } from '../../types/database';
import Pagination from '../../components/Pagination';

interface StaffUI {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: string;
  joinDate: string;
}

export default function StaffListPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { data: employees, isLoading, error, refetch } = useEmployees();

  const staffUI: StaffUI[] = useMemo(() => {
    if (!employees) return [];
    return employees.map(emp => ({
      id: String(emp.employeeId),
      name: `${emp.firstName} ${emp.lastName}`,
      role: emp.position || 'Staff',
      department: 'General',
      email: emp.email || '',
      phone: emp.phone || '',
      status: emp.employmentStatus || 'Active',
      joinDate: emp.hireDate
    }));
  }, [employees]);

  const departments = ['All', ...new Set(staffUI.map(s => s.department))];

  const filteredStaff = staffUI.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'All' || staff.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const totalPages = pageSize === 999999 ? 1 : Math.ceil(filteredStaff.length / pageSize);
  const paginatedStaff = pageSize === 999999 
    ? filteredStaff 
    : filteredStaff.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load staff</h3>
        <p className="text-sm text-gray-500 mb-4">{error?.message || 'An error occurred'}</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-[#333]"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-[#1a1a1a]">Staff Directory</h1>
          <p className="text-sm text-[#1a1a1a]/60">Manage your hotel's human resources</p>
        </div>
        <button 
          onClick={() => navigate('/staff/add')}
          className="bg-[#1a1a1a] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#333] transition-colors w-fit"
        >
          <Plus size={18} />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-[#1a1a1a]/5 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a1a]/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-10 pr-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1a1a1a]/20 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg px-3 py-2 text-sm focus:outline-none"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-lg">
              <span className="text-xs text-[#1a1a1a]/60">Show</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none focus:outline-none text-xs font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={999999}>All</option>
              </select>
            </div>
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
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Department & Role</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Contact</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Join Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {paginatedStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-[#f8f9fa] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center text-[#1a1a1a] font-serif italic border border-[#1a1a1a]/10">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-[#1a1a1a]">{staff.name}</span>
                        <span className="text-[10px] text-[#1a1a1a]/40 font-mono">{staff.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-[#1a1a1a]">{staff.role}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#1a1a1a]/40 font-bold">{staff.department}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs gap-1">
                      <div className="flex items-center gap-1.5 text-[#1a1a1a]/60">
                        <Mail size={12} />
                        <span>{staff.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#1a1a1a]/60">
                        <Phone size={12} />
                        <span>{staff.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${
                      staff.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : staff.status === 'on-leave'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">
                    {staff.joinDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => navigate(`/staff/profile/${staff.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="View Profile"
                      >
                        <User size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/staff/schedule/${staff.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="Schedule"
                      >
                        <Calendar size={16} />
                      </button>
                      <button 
                        onClick={() => navigate(`/staff/edit/${staff.id}`)}
                        className="p-1.5 hover:bg-[#1a1a1a]/5 rounded text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredStaff.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-[#1a1a1a]/40 italic">No staff members found matching your criteria.</p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={filteredStaff.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          showPageSize={false}
        />
      </div>
    </div>
  );
}
