import React from 'react';
import { 
  Plus, 
  MoreVertical, 
  Users, 
  DollarSign, 
  Layers,
  Image as ImageIcon,
  Settings,
  Edit2,
  Trash2
} from 'lucide-react';
import { mockRoomTypes } from '../../data/mockRoomTypes';
import { useNavigate } from 'react-router-dom';

export default function RoomTypeListPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-light mb-1">Room Types</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Define and manage categories of rooms and their base configurations.</p>
        </div>
        <button 
          onClick={() => navigate('/rooms/types/create')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
        >
          <Plus size={14} />
          Create Room Type
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockRoomTypes.map((type) => (
          <div key={type.id} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all flex flex-col">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={type.images[0]} 
                alt={type.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors shadow-sm">
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 bg-[#1a1a1a]/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-bold rounded">
                  {type.code}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col space-y-4">
              <div>
                <h3 className="text-xl font-serif mb-1">{type.name}</h3>
                <p className="text-xs text-[#1a1a1a]/60 font-light line-clamp-2">{type.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1a1a1a]/5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Base Price</p>
                  <p className="text-lg font-serif">${type.basePrice}<span className="text-[10px] font-sans text-[#1a1a1a]/40 ml-1">/ night</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Capacity</p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Users size={14} className="text-[#1a1a1a]/40" />
                    <span>{type.capacity.adults} Adults, {type.capacity.children} Child</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Inventory</span>
                    <span className="text-sm font-medium">{type.totalRooms} Rooms</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/rooms/types/pricing/${type.id}`)}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60" 
                    title="Pricing Rules"
                  >
                    <DollarSign size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/rooms/types/gallery/${type.id}`)}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60" 
                    title="Image Gallery"
                  >
                    <ImageIcon size={16} />
                  </button>
                  <button className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60" title="Settings">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button 
          onClick={() => navigate('/rooms/types/create')}
          className="bg-[#f8f9fa] rounded-2xl border-2 border-dashed border-[#1a1a1a]/10 flex flex-col items-center justify-center p-8 hover:border-[#1a1a1a]/30 transition-all group min-h-[400px]"
        >
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/40 transition-colors mb-4 shadow-sm">
            <Plus size={24} />
          </div>
          <p className="text-sm font-medium text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/60 transition-colors">Add New Room Type</p>
        </button>
      </div>
    </div>
  );
}
