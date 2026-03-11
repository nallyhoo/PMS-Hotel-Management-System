import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  DoorOpen,
  Layers,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import type { Room } from '../../types/database';

export default function CreateRoomPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    roomNumber: '',
    roomTypeId: 1,
    floorId: 1,
    status: 'Available',
    cleaningStatus: 'Clean',
    notes: '',
  });

  const [error, setError] = useState('');

  const { data: roomTypes } = useQuery({
    queryKey: ['roomTypes'],
    queryFn: () => roomService.getRoomTypes(),
  });

  const { data: floors } = useQuery({
    queryKey: ['floors'],
    queryFn: () => roomService.getFloors(),
  });

  const { data: existingRoom, isLoading: loadingRoom } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoom(Number(id)),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (existingRoom) {
      setFormData({
        roomNumber: existingRoom.roomNumber || '',
        roomTypeId: existingRoom.roomTypeId || 1,
        floorId: existingRoom.floorId || 1,
        status: existingRoom.status || 'Available',
        cleaningStatus: existingRoom.cleaningStatus || 'Clean',
        notes: existingRoom.notes || '',
      });
    }
  }, [existingRoom]);

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => roomService.createRoom({
      branchId: 1,
      roomNumber: data.roomNumber,
      roomTypeId: data.roomTypeId,
      floorId: data.floorId,
      status: data.status,
      notes: data.notes,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      navigate('/rooms/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to create room');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) => roomService.updateRoom(Number(id), {
      roomNumber: data.roomNumber,
      roomTypeId: data.roomTypeId,
      floorId: data.floorId,
      status: data.status,
      cleaningStatus: data.cleaningStatus,
      notes: data.notes,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
      navigate('/rooms/list');
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to update room');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.roomNumber.trim()) {
      setError('Room number is required');
      return;
    }

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isEdit && loadingRoom) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/rooms/list')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-light">
            {isEdit ? 'Edit Room' : 'Add New Room'}
          </h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">
            {isEdit ? 'Update room details' : 'Create a new room in the inventory'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#1a1a1a]/5 shadow-sm p-8 space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Room Number */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Room Number *
            </label>
            <div className="relative">
              <DoorOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g., 101, 205A"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              />
            </div>
          </div>

          {/* Room Type */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Room Type
            </label>
            <select
              name="roomTypeId"
              value={formData.roomTypeId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
            >
              {roomTypes?.map(rt => (
                <option key={rt.roomTypeId} value={rt.roomTypeId}>
                  {rt.typeName}
                </option>
              ))}
            </select>
          </div>

          {/* Floor */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Floor
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <select
                name="floorId"
                value={formData.floorId}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              >
                {floors?.map(f => (
                  <option key={f.floorId} value={f.floorId}>
                    {f.floorName || `Floor ${f.floorNumber}`}
                  </option>
                )) || (
                  <>
                    <option value={1}>Floor 1</option>
                    <option value={2}>Floor 2</option>
                    <option value={3}>Floor 3</option>
                    <option value={4}>Floor 4</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
            >
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Dirty">Dirty</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          {/* Cleaning Status (only for edit) */}
          {isEdit && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
                Cleaning Status
              </label>
              <select
                name="cleaningStatus"
                value={formData.cleaningStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              >
                <option value="Clean">Clean</option>
                <option value="Dirty">Dirty</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Inspected">Inspected</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              placeholder="Optional notes about this room..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1a1a1a]/5">
          <button
            type="button"
            onClick={() => navigate('/rooms/list')}
            className="px-6 py-3 bg-white border border-[#1a1a1a]/10 rounded-xl text-sm font-medium hover:bg-[#f8f9fa] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? 'Update Room' : 'Create Room'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
