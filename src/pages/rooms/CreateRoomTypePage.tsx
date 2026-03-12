import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  DollarSign,
  Users,
  AlertCircle,
  Layers,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import { useToastMutation } from '../../lib/useToastMutation';

export default function CreateRoomTypePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    typeName: '',
    description: '',
    capacity: 2,
    basePrice: 99,
    maxOccupancy: 2,
    bedType: 'Queen',
    sizeSqFt: 300,
  });

  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  const { data: existingRoomType, isLoading: loadingRoomType } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => roomService.getRoomType(Number(id)),
    enabled: isEdit && !!id,
  });

  useEffect(() => {
    if (existingRoomType) {
      const rt: any = existingRoomType;
      setFormData({
        typeName: rt.typeName || rt.TypeName || '',
        description: rt.description || rt.Description || '',
        capacity: rt.capacity || rt.Capacity || 2,
        basePrice: rt.basePrice || rt.BasePrice || 99,
        maxOccupancy: rt.maxOccupancy || rt.MaxOccupancy || 2,
        bedType: rt.bedType || rt.BedType || 'Queen',
        sizeSqFt: rt.sizeSqFt || rt.SizeSqFt || 300,
      });
    }
  }, [existingRoomType]);

  const createMutation = useToastMutation({
    mutationFn: async (data: typeof formData) => {
      const result = await roomService.createRoomType({
        typeName: data.typeName,
        description: data.description,
        capacity: data.capacity,
        basePrice: data.basePrice,
        maxOccupancy: data.maxOccupancy,
        bedType: data.bedType,
        sizeSqFt: data.sizeSqFt,
      });
      
      // Save images after creating room type
      if (images.length > 0 && result.roomTypeId) {
        for (let i = 0; i < images.length; i++) {
          await roomService.addRoomTypeImage(result.roomTypeId, {
            imageUrl: images[i],
            isPrimary: i === 0,
            sortOrder: i,
          });
        }
      }
      
      return result;
    },
    successMessage: 'Room type created successfully',
    errorMessage: 'Failed to create room type',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
      navigate('/rooms/types');
    },
  });

  const updateMutation = useToastMutation({
    mutationFn: async (data: typeof formData) => {
      await roomService.updateRoomType(Number(id), {
        typeName: data.typeName,
        description: data.description,
        capacity: data.capacity,
        basePrice: data.basePrice,
        maxOccupancy: data.maxOccupancy,
        bedType: data.bedType,
        sizeSqFt: data.sizeSqFt,
      });
      
      // Save new images
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await roomService.addRoomTypeImage(Number(id), {
            imageUrl: images[i],
            isPrimary: i === 0,
            sortOrder: i,
          });
        }
      }
    },
    successMessage: 'Room type updated successfully',
    errorMessage: 'Failed to update room type',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypes'] });
      queryClient.invalidateQueries({ queryKey: ['roomType', id] });
      navigate('/rooms/types');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.typeName.trim()) {
      setError('Room type name is required');
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
    setFormData(prev => ({ 
      ...prev, 
      [name]: ['capacity', 'basePrice', 'maxOccupancy', 'sizeSqFt'].includes(name) 
        ? Number(value) 
        : value 
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImages(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (isEdit && loadingRoomType) {
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
          onClick={() => navigate('/rooms/types')}
          className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-serif font-light">
            {isEdit ? 'Edit Room Type' : 'Add New Room Type'}
          </h1>
          <p className="text-sm text-[#1a1a1a]/60 font-light">
            {isEdit ? 'Update room type details' : 'Create a new room type category'}
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
          {/* Type Name */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Room Type Name *
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="text"
                name="typeName"
                value={formData.typeName}
                onChange={handleInputChange}
                placeholder="e.g., Standard, Deluxe, Suite"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              />
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe this room type..."
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium resize-none"
            />
          </div>

          {/* Images */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Room Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Upload Button */}
              <label className="aspect-video bg-[#f8f9fa] border-2 border-dashed border-[#1a1a1a]/10 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1a1a1a]/30 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Upload size={24} className="text-[#1a1a1a]/30 mb-2" />
                <span className="text-xs text-[#1a1a1a]/40">Upload</span>
              </label>

              {/* Image Previews */}
              {images.map((img, index) => (
                <div key={index} className="relative aspect-video bg-[#f8f9fa] rounded-xl overflow-hidden group">
                  <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Base Price */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Base Price (per night)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="number"
                name="basePrice"
                value={formData.basePrice}
                onChange={handleInputChange}
                min="0"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              />
            </div>
          </div>

          {/* Bed Type */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Bed Type
            </label>
            <select
              name="bedType"
              value={formData.bedType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
            >
              <option value="Single">Single</option>
              <option value="Queen">Queen</option>
              <option value="King">King</option>
              <option value="Twin">Twin</option>
              <option value="Double">Double</option>
              <option value="King+Queen">King + Queen</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Capacity (Adults)
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              />
            </div>
          </div>

          {/* Max Occupancy */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Max Occupancy (Including Children)
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/30" size={18} />
              <input
                type="number"
                name="maxOccupancy"
                value={formData.maxOccupancy}
                onChange={handleInputChange}
                min="1"
                max="20"
                className="w-full pl-10 pr-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
              />
            </div>
          </div>

          {/* Size */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-1">
              Room Size (sq ft)
            </label>
            <input
              type="number"
              name="sizeSqFt"
              value={formData.sizeSqFt}
              onChange={handleInputChange}
              min="0"
              className="w-full px-4 py-3 bg-[#f8f9fa] border border-[#1a1a1a]/5 rounded-xl focus:outline-none focus:border-[#1a1a1a]/20 text-sm font-medium"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#1a1a1a]/5">
          <button
            type="button"
            onClick={() => navigate('/rooms/types')}
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
                {isEdit ? 'Update Room Type' : 'Create Room Type'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
