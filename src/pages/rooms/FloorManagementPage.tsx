import React from 'react';
import { 
  Layers, 
  Plus, 
  MoreVertical, 
  DoorOpen, 
  Users, 
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { mockRooms } from '../../data/mockRooms';

const floors = [
  { id: 'F1', name: '1st Floor', rooms: 12, occupied: 8, dirty: 2, maintenance: 0 },
  { id: 'F2', name: '2nd Floor', rooms: 12, occupied: 5, dirty: 4, maintenance: 1 },
  { id: 'F3', name: '3rd Floor', rooms: 10, occupied: 6, dirty: 1, maintenance: 2 },
  { id: 'F4', name: '4th Floor', rooms: 8, occupied: 7, dirty: 0, maintenance: 0 },
  { id: 'FP', name: 'Penthouse', rooms: 2, occupied: 1, dirty: 0, maintenance: 0 },
];

export default function FloorManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Floor Management</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Overview and configuration of hotel floors and zones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Plus size={14} />
            Add New Floor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {floors.map((floor) => (
          <div key={floor.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all">
            <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/60">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-serif">{floor.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{floor.rooms} Total Rooms</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Occupied</p>
                    <p className="text-sm font-medium">{floor.occupied}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Dirty</p>
                    <p className="text-sm font-medium">{floor.dirty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="text-left">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Maintenance</p>
                    <p className="text-sm font-medium">{floor.maintenance}</p>
                  </div>
                </div>
                
                <div className="w-px h-8 bg-[#1a1a1a]/5 hidden md:block"></div>

                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-[#f8f9fa] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1a1a1a]" 
                      style={{ width: `${(floor.occupied / floor.rooms) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{Math.round((floor.occupied / floor.rooms) * 100)}% Occ.</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/40">
                  <MoreVertical size={18} />
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-xs font-medium hover:bg-[#1a1a1a]/5 transition-colors">
                  View Rooms
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
