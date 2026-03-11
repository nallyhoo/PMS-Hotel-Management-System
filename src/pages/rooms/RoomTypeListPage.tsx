import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Users, 
  DollarSign, 
  Image as ImageIcon,
  Settings,
  Edit2,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/Pagination';

interface RoomTypeWithImages {
  roomTypeId: number;
  typeName: string;
  description: string;
  capacity: number;
  basePrice: number;
  maxOccupancy: number;
  bedType: string;
  sizeSqFt: number;
  isActive: boolean;
  images?: string[];
}

export default function RoomTypeListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);

  const { data: roomTypes, isLoading } = useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => roomService.getRoomTypes(),
  });

  // Fetch images for all room types
  const { data: allImages } = useQuery({
    queryKey: ['roomTypeImages'],
    queryFn: async () => {
      if (!roomTypes || roomTypes.length === 0) return {};
      const imagesMap: Record<number, string[]> = {};
      for (const rt of roomTypes as any[]) {
        const rtId = rt.roomTypeId || rt.RoomTypeID;
        try {
          const images = await roomService.getRoomTypeImages(rtId);
          imagesMap[rtId] = images.map((img: any) => img.imageUrl || img.ImageURL);
        } catch {
          imagesMap[rtId] = [];
        }
      }
      return imagesMap;
    },
    enabled: !!roomTypes && roomTypes.length > 0,
  });

  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roomService.deleteRoomType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
      setDeleteConfirm(null);
    },
  });

  // Handle both PascalCase (from DB) and camelCase (transformed)
  const normalizedTypes: RoomTypeWithImages[] = useMemo(() => {
    if (!roomTypes || !Array.isArray(roomTypes)) return [];
    return roomTypes.map((rt: any) => {
      const rtId = rt.roomTypeId || rt.RoomTypeID;
      return {
        roomTypeId: rtId,
        typeName: rt.typeName || rt.TypeName,
        description: rt.description || rt.Description,
        capacity: rt.capacity || rt.Capacity,
        basePrice: rt.basePrice || rt.BasePrice,
        maxOccupancy: rt.maxOccupancy || rt.MaxOccupancy,
        bedType: rt.bedType || rt.BedType,
        sizeSqFt: rt.sizeSqFt || rt.SizeSqFt,
        isActive: rt.isActive ?? rt.IsActive,
        images: allImages?.[rtId] || [],
      };
    });
  }, [roomTypes, allImages]);

  const paginatedTypes = useMemo(() => {
    if (!normalizedTypes || !Array.isArray(normalizedTypes)) return [];
    const start = (currentPage - 1) * pageSize;
    return normalizedTypes.slice(start, start + pageSize);
  }, [normalizedTypes, currentPage, pageSize]);

  const totalPages = roomTypes ? Math.ceil(roomTypes.length / pageSize) : 1;

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
        {paginatedTypes.map((type, index) => (
          <div key={type.roomTypeId || `type-${index}`} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all flex flex-col">
            <div className="relative h-48 overflow-hidden bg-[#f8f9fa]">
              {type.images && type.images.length > 0 ? (
                <img 
                  src={type.images[0]} 
                  alt={type.typeName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/20">
                  <Users size={48} />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button 
                  onClick={() => navigate(`/rooms/types/edit/${type.roomTypeId}`)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors shadow-sm"
                >
                  <Edit2 size={14} />
                </button>
              </div>
              <div className="absolute bottom-4 left-4">
                <span className="px-2 py-1 bg-[#1a1a1a]/80 backdrop-blur-sm text-white text-[10px] uppercase tracking-widest font-bold rounded">
                  {(type.typeName || 'RT').substring(0, 3).toUpperCase()}
                </span>
              </div>
            </div>

              <div className="p-6 flex-1 flex flex-col space-y-4">
              <div>
                <h3 className="text-xl font-serif mb-1">{type.typeName || 'Unknown Type'}</h3>
                <p className="text-xs text-[#1a1a1a]/60 font-light line-clamp-2">{type.description || 'No description available'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1a1a1a]/5">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Base Price</p>
                  <p className="text-lg font-serif">${type.basePrice || 0}<span className="text-[10px] font-sans text-[#1a1a1a]/40 ml-1">/ night</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Capacity</p>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Users size={14} className="text-[#1a1a1a]/40" />
                    <span>{type.capacity || 0} Guests</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Max Occupancy</span>
                    <span className="text-sm font-medium">{type.maxOccupancy || 0} Guests</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => navigate(`/rooms/types/pricing/${type.roomTypeId}`)}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60" 
                    title="Pricing Rules"
                  >
                    <DollarSign size={16} />
                  </button>
                  <button 
                    onClick={() => navigate(`/rooms/types/gallery/${type.roomTypeId}`)}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60" 
                    title="Image Gallery"
                  >
                    <ImageIcon size={16} />
                  </button>
                  {deleteConfirm === type.roomTypeId ? (
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => deleteMutation.mutate(type.roomTypeId)}
                        className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors text-red-600"
                        title="Confirm Delete"
                      >
                        <AlertTriangle size={16} />
                      </button>
                      <button 
                        onClick={() => setDeleteConfirm(null)}
                        className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/60"
                        title="Cancel"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setDeleteConfirm(type.roomTypeId)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400 hover:text-red-600" 
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
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

      {roomTypes && roomTypes.length > pageSize && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-[#1a1a1a]/60">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, roomTypes.length)} of {roomTypes.length} room types
            </span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-white border border-[#1a1a1a]/10 rounded-lg text-xs"
            >
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
              <option value={roomTypes.length}>All</option>
            </select>
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={roomTypes.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            showPageSize={false}
          />
        </div>
      )}
    </div>
  );
}
