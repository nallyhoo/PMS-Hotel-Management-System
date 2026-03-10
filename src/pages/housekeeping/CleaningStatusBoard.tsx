import React from 'react';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  MoreVertical,
  User,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const floors = [
  { 
    number: 'Floor 1', 
    rooms: [
      { id: '101', status: 'Dirty', type: 'Standard', assigned: 'Maria G.' },
      { id: '102', status: 'Clean', type: 'Standard', assigned: '-' },
      { id: '103', status: 'In Progress', type: 'Deluxe', assigned: 'John D.' },
      { id: '104', status: 'Dirty', type: 'Deluxe', assigned: 'Elena R.' },
      { id: '105', status: 'Inspected', type: 'Standard', assigned: '-' },
    ]
  },
  { 
    number: 'Floor 2', 
    rooms: [
      { id: '201', status: 'Clean', type: 'Suite', assigned: '-' },
      { id: '202', status: 'Dirty', type: 'Suite', assigned: 'Marcus C.' },
      { id: '203', status: 'In Progress', type: 'Standard', assigned: 'Maria G.' },
      { id: '204', status: 'Dirty', type: 'Standard', assigned: 'John D.' },
      { id: '205', status: 'Clean', type: 'Standard', assigned: '-' },
    ]
  }
];

export default function CleaningStatusBoard() {
  const navigate = useNavigate();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Clean': return 'bg-emerald-50 border-emerald-100 text-emerald-700';
      case 'Inspected': return 'bg-blue-50 border-blue-100 text-blue-700';
      case 'In Progress': return 'bg-indigo-50 border-indigo-100 text-indigo-700';
      case 'Dirty': return 'bg-amber-50 border-amber-100 text-amber-700';
      default: return 'bg-slate-50 border-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Clean': return <CheckCircle2 size={14} />;
      case 'Inspected': return <Sparkles size={14} />;
      case 'In Progress': return <Clock size={14} />;
      case 'Dirty': return <AlertTriangle size={14} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/housekeeping')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Status Board</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">Real-time room cleaning and inspection status.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors">
            <RefreshCw size={14} /> Refresh
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Filter size={16} /> Filter Board
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-2xl border border-[#1a1a1a]/5 shadow-sm flex flex-wrap items-center gap-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Legend:</span>
        {[
          { label: 'Dirty', color: 'bg-amber-500' },
          { label: 'In Progress', color: 'bg-indigo-500' },
          { label: 'Clean', color: 'bg-emerald-500' },
          { label: 'Inspected', color: 'bg-blue-500' },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Floors Grid */}
      <div className="space-y-12">
        {floors.map((floor) => (
          <div key={floor.number} className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-serif">{floor.number}</h2>
              <div className="h-px flex-1 bg-[#1a1a1a]/5" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">
                {floor.rooms.length} Rooms
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {floor.rooms.map((room) => (
                <div 
                  key={room.id}
                  className={`p-4 rounded-2xl border-2 transition-all group relative ${getStatusStyle(room.status)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-lg font-serif">Room {room.id}</span>
                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical size={14} />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      {getStatusIcon(room.status)}
                      {room.status}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-medium opacity-60">
                      <User size={12} />
                      {room.assigned === '-' ? 'Unassigned' : room.assigned}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
