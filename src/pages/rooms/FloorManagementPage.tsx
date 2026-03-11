import React, { useMemo, useState } from 'react';
import { 
  Layers, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  X,
  Pencil,
  Trash2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import { useNavigate } from 'react-router-dom';

interface FloorData {
  floorId: number;
  floorNumber: number;
  floorName: string;
  description?: string;
  totalRooms: number;
  occupied: number;
  dirty: number;
  maintenance: number;
  reserved: number;
  available: number;
}

export default function FloorManagementPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editFloor, setEditFloor] = useState<FloorData | null>(null);
  const [deleteFloor, setDeleteFloor] = useState<FloorData | null>(null);

  const { data: floors, isLoading } = useQuery({
    queryKey: ['floors'],
    queryFn: () => roomService.getFloors(),
  });

  const { data: rooms } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const floorsWithStats: FloorData[] = useMemo(() => {
    if (!floors || !rooms) return [];
    
    const floorMap = new Map<number, FloorData>();
    
    floors.forEach((floor: any) => {
      floorMap.set(floor.FloorID, {
        floorId: floor.FloorID,
        floorNumber: floor.FloorNumber,
        floorName: floor.FloorName || `Floor ${floor.FloorNumber}`,
        description: floor.Description,
        totalRooms: 0,
        occupied: 0,
        dirty: 0,
        maintenance: 0,
        reserved: 0,
        available: 0,
      });
    });
    
    rooms.forEach((room: any) => {
      const floorId = room.floorId;
      if (!floorMap.has(floorId)) return;
      
      const floor = floorMap.get(floorId)!;
      floor.totalRooms++;
      
      switch (room.status) {
        case 'Occupied': floor.occupied++; break;
        case 'Dirty': floor.dirty++; break;
        case 'Maintenance': floor.maintenance++; break;
        case 'Reserved': floor.reserved++; break;
        case 'Available': floor.available++; break;
      }
    });
    
    return Array.from(floorMap.values()).sort((a, b) => a.floorNumber - b.floorNumber);
  }, [floors, rooms]);

  const deleteMutation = useMutation({
    mutationFn: (id: number) => roomService.deleteFloor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      setDeleteFloor(null);
    },
  });

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
          <h1 className="text-3xl font-serif font-light mb-1">Floor Management</h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">Overview and configuration of hotel floors and zones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors"
          >
            <Plus size={14} />
            Add New Floor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {floorsWithStats.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-12 text-center">
            <Layers size={48} className="mx-auto text-[#1a1a1a]/20 mb-4" />
            <p className="text-[#1a1a1a]/60">No floors configured. Add your first floor to get started.</p>
          </div>
        ) : (
          floorsWithStats.map((floor) => (
            <div key={floor.floorId} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm overflow-hidden group hover:border-[#1a1a1a]/20 transition-all">
              <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#f8f9fa] flex items-center justify-center text-[#1a1a1a]/60">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif">{floor.floorName}</h3>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">{floor.totalRooms} Total Rooms</p>
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
                        style={{ width: `${floor.totalRooms > 0 ? (floor.occupied / floor.totalRooms) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{floor.totalRooms > 0 ? Math.round((floor.occupied / floor.totalRooms) * 100) : 0}% Occ.</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditFloor(floor)}
                    className="p-2 hover:bg-[#f8f9fa] rounded-lg transition-colors text-[#1a1a1a]/40"
                    title="Edit Floor"
                  >
                    <Pencil size={18} />
                  </button>
                  <button 
                    onClick={() => setDeleteFloor(floor)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-400"
                    title="Delete Floor"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button 
                    onClick={() => navigate(`/rooms/list?floorId=${floor.floorId}`)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-xs font-medium hover:bg-[#1a1a1a]/5 transition-colors"
                  >
                    View Rooms
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <FloorModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Edit Modal */}
      {editFloor && (
        <FloorModal floor={editFloor} onClose={() => setEditFloor(null)} />
      )}

      {/* Delete Confirmation */}
      {deleteFloor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif">Delete Floor</h2>
              <button onClick={() => setDeleteFloor(null)} className="p-2 hover:bg-[#f8f9fa] rounded-lg">
                <X size={20} />
              </button>
            </div>
            <p className="text-[#1a1a1a]/60 mb-6">
              Are you sure you want to delete <strong>{deleteFloor.floorName}</strong>? 
              This will not delete rooms on this floor.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteFloor(null)}
                className="flex-1 px-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteFloor.floorId)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FloorModal({ floor, onClose }: { floor?: FloorData; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    floorNumber: floor?.floorNumber || '',
    floorName: floor?.floorName || '',
    description: floor?.description || '',
  });

  const isEdit = !!floor;

  const mutation = useMutation({
    mutationFn: async (data: { floorNumber: number; floorName: string; description?: string }) => {
      if (isEdit) {
        await roomService.updateFloor(floor.floorId, data);
      } else {
        await roomService.createFloor(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['floors'] });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.floorNumber || !formData.floorName) return;
    mutation.mutate({
      floorNumber: Number(formData.floorNumber),
      floorName: formData.floorName,
      description: formData.description || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif">{isEdit ? 'Edit Floor' : 'New Floor'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[#f8f9fa] rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Floor Number *</label>
              <input
                type="number"
                value={formData.floorNumber}
                onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1"
                required
                min="1"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Floor Name *</label>
              <input
                type="text"
                value={formData.floorName}
                onChange={(e) => setFormData({ ...formData, floorName: e.target.value })}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1"
                required
                placeholder="e.g., Ground Floor"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl text-sm mt-1 resize-none"
              placeholder="Optional description..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] disabled:opacity-50"
            >
              {mutation.isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
