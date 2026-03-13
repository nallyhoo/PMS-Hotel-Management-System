import React, { useState } from 'react';
import { 
  Wrench, 
  MapPin, 
  AlertCircle, 
  Send,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import maintenanceService from '../../api/maintenance';
import roomService from '../../api/rooms';
import { toastSuccess, toastError } from '../../lib/toast';

export default function MaintenanceRequestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);

  const { data: roomsData } = useQuery({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const [formData, setFormData] = useState({
    roomId: '' as string,
    requestType: 'Other',
    priority: 'Normal',
    description: '',
    scheduledDate: '',
    estimatedCost: '',
  });

  const createRequestMutation = useMutation({
    mutationFn: (data: {
      roomId: number;
      requestType: string;
      priority: string;
      description: string;
      scheduledDate?: string;
      estimatedCost?: number;
    }) => maintenanceService.createRequest(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['maintenance'] });
      setRequestId(data.requestId);
      setIsSubmitted(true);
      toastSuccess('Maintenance request created successfully');
    },
    onError: (error: any) => {
      toastError(error.message || 'Failed to create request');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roomId) {
      toastError('Please select a room');
      return;
    }
    if (!formData.description) {
      toastError('Please enter a description');
      return;
    }
    
    createRequestMutation.mutate({
      roomId: parseInt(formData.roomId, 10),
      requestType: formData.requestType,
      priority: formData.priority,
      description: formData.description,
      scheduledDate: formData.scheduledDate || undefined,
      estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
    });
  };

  const rooms = roomsData || [];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/maintenance')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-serif font-medium text-[#1a1a1a]">New Maintenance Request</h1>
          <p className="text-[#1a1a1a]/60 text-sm">Report a maintenance issue or request service</p>
        </div>
      </div>

      {isSubmitted && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3 text-emerald-800">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">Request submitted successfully!</p>
            <p className="text-xs opacity-80">Maintenance team has been notified. Request ID: MNT-{requestId}</p>
          </div>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setRequestId(null);
              setFormData({
                roomId: '',
                requestType: 'Other',
                priority: 'Normal',
                description: '',
                scheduledDate: '',
                estimatedCost: '',
              });
            }}
            className="text-xs text-emerald-600 hover:underline"
          >
            Create another
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        {/* Location */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Location *</label>
          <select 
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            required
          >
            <option value="">Select a room...</option>
            {rooms.map((room: any) => (
              <option key={room.roomId || room.RoomID} value={room.roomId || room.RoomID}>
                Room {room.roomNumber || room.RoomNumber} - {room.roomTypeName || room.RoomTypeName || 'Standard'}
              </option>
            ))}
          </select>
        </div>

        {/* Category & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Category</label>
            <select 
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            >
              <option value="Other">General</option>
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="HVAC">HVAC</option>
              <option value="Furniture">Furniture</option>
              <option value="Appliance">Appliances</option>
              <option value="Structural">Structural</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Priority</label>
            <select 
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
              <option value="Emergency">Emergency</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the maintenance issue in detail..."
            rows={4}
            className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10 resize-none"
            required
          />
        </div>

        {/* Scheduled Date & Cost */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Scheduled Date (Optional)</label>
            <input 
              type="date"
              value={formData.scheduledDate}
              onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/60">Estimated Cost (Optional)</label>
            <input 
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-[#f8f9fa] border-none rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1a1a1a]/10"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-4">
          <button 
            type="button"
            onClick={() => navigate('/maintenance')}
            className="px-6 py-2.5 border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={createRequestMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {createRequestMutation.isPending ? (
              'Submitting...'
            ) : (
              <><Send size={16} /> Submit Request</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
