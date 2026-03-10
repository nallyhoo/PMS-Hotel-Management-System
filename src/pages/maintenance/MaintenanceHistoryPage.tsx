import React from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Wrench,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const history = [
  { id: 'MNT-2030', location: 'Room 215', issue: 'Leaky Faucet', category: 'Plumbing', completedAt: '2024-03-07', technician: 'Sarah M.', duration: '45 min', cost: '$15.00' },
  { id: 'MNT-2028', location: 'Elevator B', issue: 'Floor Indicator Out', category: 'Electrical', completedAt: '2024-03-06', technician: 'David K.', duration: '1.5 hrs', cost: '$45.00' },
  { id: 'MNT-2025', location: 'Suite 1', issue: 'TV Remote Missing', category: 'General', completedAt: '2024-03-05', technician: 'Marcus L.', duration: '10 min', cost: '$25.00' },
  { id: 'MNT-2022', location: 'Restaurant', issue: 'Dishwasher Repair', category: 'Plumbing', completedAt: '2024-03-04', technician: 'Sarah M.', duration: '3 hrs', cost: '$120.00' },
  { id: 'MNT-2019', location: 'Room 501', issue: 'AC Filter Change', category: 'HVAC', completedAt: '2024-03-03', technician: 'David K.', duration: '30 min', cost: '$12.00' },
  { id: 'MNT-2015', location: 'Parking Lot', issue: 'Gate Sensor Fix', category: 'Electrical', completedAt: '2024-03-02', technician: 'Elena R.', duration: '2 hrs', cost: '$85.00' },
];

export default function MaintenanceHistoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">Maintenance History</h1>
          <p className="text-[#1a1a1a]/60 mt-1 text-sm">Review completed maintenance tasks and performance</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-sm font-medium hover:bg-[#f8f9fa] transition-colors">
            <Download size={16} />
            Download Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm font-medium hover:bg-[#1a1a1a]/90 transition-all shadow-sm">
            <Calendar size={16} />
            Select Date Range
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 gap-3">
          <Search size={18} className="text-[#1a1a1a]/30" />
          <input 
            type="text" 
            placeholder="Search history by ID, location, or technician..." 
            className="bg-transparent border-none focus:ring-0 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl px-4 py-2 text-sm font-medium focus:ring-0">
            <option>All Categories</option>
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>HVAC</option>
          </select>
          <button className="p-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl hover:bg-[#1a1a1a]/5 transition-colors">
            <Filter size={18} className="text-[#1a1a1a]/60" />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Task ID</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Location & Issue</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Completed Date</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Technician</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40">Duration</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest font-semibold text-[#1a1a1a]/40 text-right">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/5">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-[#f8f9fa] transition-colors group cursor-pointer">
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a]">{item.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#1a1a1a]">{item.issue}</span>
                      <div className="flex items-center gap-1 text-xs text-[#1a1a1a]/40 mt-1">
                        <MapPin size={12} />
                        {item.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                      <Wrench size={14} className="text-[#1a1a1a]/30" />
                      {item.category}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/60">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      {item.completedAt}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{item.technician}</td>
                  <td className="px-6 py-4 text-sm text-[#1a1a1a]/60">{item.duration}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#1a1a1a] text-right">{item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-[#1a1a1a]/5 flex items-center justify-between">
          <p className="text-sm text-[#1a1a1a]/40">Showing 1 to 6 of 124 completed tasks</p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa] disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-[#1a1a1a] text-white rounded-lg text-sm font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center hover:bg-[#f8f9fa] rounded-lg text-sm font-medium">2</button>
            <button className="p-2 border border-[#1a1a1a]/10 rounded-lg hover:bg-[#f8f9fa]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
