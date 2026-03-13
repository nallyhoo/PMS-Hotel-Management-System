import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Download, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Wrench,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';

export default function MaintenanceHistoryPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: historyData, isLoading } = useQuery({
    queryKey: ['maintenance', 'history', startDate, endDate],
    queryFn: () => maintenanceService.getHistory({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
  });

  const history = historyData?.data || [];

  const filteredHistory = history.filter((h: any) => {
    const searchLower = searchTerm.toLowerCase();
    const requestId = String(h.RequestID || h.requestId || '');
    const roomNum = String(h.RoomNumber || h.roomNumber || '');
    const requestType = String(h.RequestType || h.requestType || '');
    
    return !searchTerm || 
      requestId.toLowerCase().includes(searchLower) ||
      roomNum.toLowerCase().includes(searchLower) ||
      requestType.toLowerCase().includes(searchLower);
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a] mx-auto"></div>
        <p className="mt-4 text-[#1a1a1a]/40">Loading history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Maintenance History</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Review completed maintenance tasks and performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
          <Download size={16} />
          Download Report
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search history by ID, location, or issue..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
          />
          <span className="text-[#1a1a1a]/40">to</span>
          <input 
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm"
          />
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8f9fa]">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">ID</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Location</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Issue</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Category</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Completed</th>
                <th className="px-6 py-4 text-left text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Cost</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {filteredHistory.length > 0 ? filteredHistory.map((item: any) => (
                <tr 
                  key={item.requestId}
                  className="hover:bg-[#f8f9fa] transition-colors cursor-pointer"
                  onClick={() => navigate(`/maintenance/tasks/${item.requestId}`)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">MNT-{item.requestId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-[#1a1a1a]/30" />
                      <span className="text-sm">Room {item.roomNumber || '-'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{item.description?.slice(0, 40)}{item.description?.length > 40 ? '...' : ''}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/60">{item.requestType || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#1a1a1a]/40">
                      {item.completedDate ? new Date(item.completedDate).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-emerald-600">
                      ${item.actualCost || '0.00'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ArrowRight size={16} className="text-[#1a1a1a]/30" />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <History size={32} className="text-[#1a1a1a]/20" />
                      <p className="text-[#1a1a1a]/40">No maintenance history found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
