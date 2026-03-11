import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  LayoutGrid, 
  Maximize2,
  CheckCircle2,
  X,
  MoreVertical
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import roomService from '../../api/rooms';

export default function RoomTypeGalleryPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  const { data: roomType, isLoading } = useQuery({
    queryKey: ['roomType', id],
    queryFn: () => roomService.getRoomType(Number(id)),
    enabled: !!id,
  });

  const { data: existingImages, isLoading: loadingImages } = useQuery({
    queryKey: ['roomTypeImages', id],
    queryFn: () => roomService.getRoomTypeImages(Number(id)),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId: number) => roomService.deleteRoomTypeImage(imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypeImages', id] });
      setSelectedImages([]);
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: { imageUrl: string }) => {
      return roomService.addRoomTypeImage(Number(id), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roomTypeImages', id] });
      setNewImages([]);
    },
  });

  const toggleSelect = (img: string) => {
    if (selectedImages.includes(img)) {
      setSelectedImages(selectedImages.filter(i => i !== img));
    } else {
      setSelectedImages([...selectedImages, img]);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setNewImages(prev => [...prev, result]);
        // Also add to API
        addMutation.mutate({ imageUrl: result });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteSelected = () => {
    selectedImages.forEach(img => {
      const imgObj = existingImages?.find((i: any) => i.imageUrl === img || i.ImageURL === img);
      if (imgObj) {
        const imgId = imgObj.imageId || imgObj.ImageID;
        deleteMutation.mutate(imgId);
      }
    });
  };

  if (isLoading || loadingImages) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (!roomType) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Room type not found</p>
      </div>
    );
  }

  const displayImages = existingImages?.map((img: any) => img.imageUrl || img.ImageURL) || [];
  const roomTypeName = (roomType as any).typeName || (roomType as any).TypeName || 'Room Type';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rooms/types')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-serif font-light mb-1">Image Gallery</h1>
            <p className="text-sm text-[#1a1a1a]/60 font-light">{roomTypeName} • {displayImages.length} Images</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedImages.length > 0 && (
            <button 
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-red-100 transition-colors"
            >
              <Trash2 size={14} />
              Delete Selected ({selectedImages.length})
            </button>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Upload Placeholder */}
        <label className="aspect-square bg-[#f8f9fa] rounded-2xl border-2 border-dashed border-[#1a1a1a]/10 flex flex-col items-center justify-center p-8 hover:border-[#1a1a1a]/30 transition-all cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#1a1a1a]/20 group-hover:text-[#1a1a1a]/40 transition-colors mb-4 shadow-sm">
            <Plus size={24} />
          </div>
          <p className="text-xs font-medium text-[#1a1a1a]/40 group-hover:text-[#1a1a1a]/60 transition-colors">Add Image</p>
        </label>

        {displayImages.map((img: string, idx: number) => (
          <div 
            key={idx} 
            className={`relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border-2 transition-all ${
              selectedImages.includes(img) ? 'border-[#1a1a1a]' : 'border-transparent'
            }`}
            onClick={() => toggleSelect(img)}
          >
            <img 
              src={img} 
              alt={`${roomTypeName} ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
              <div className="flex justify-between items-start">
                <div className={`w-5 h-5 rounded-full border border-white flex items-center justify-center ${
                  selectedImages.includes(img) ? 'bg-white text-[#1a1a1a]' : 'bg-transparent text-transparent'
                }`}>
                  <CheckCircle2 size={12} />
                </div>
                <button className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/40 transition-colors">
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="flex justify-center">
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/40 transition-colors">
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            {/* Selection Checkmark (Always visible if selected) */}
            {selectedImages.includes(img) && (
              <div className="absolute top-4 left-4 w-5 h-5 rounded-full bg-white text-[#1a1a1a] flex items-center justify-center shadow-lg">
                <CheckCircle2 size={12} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Gallery Settings */}
      <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
        <h3 className="text-lg font-serif">Gallery Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Display Settings</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#1a1a1a]/20" defaultChecked />
                <span className="text-sm font-light">Show in guest booking portal</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#1a1a1a]/20" defaultChecked />
                <span className="text-sm font-light">Enable full-screen lightbox</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-[#1a1a1a]/20" />
                <span className="text-sm font-light">Auto-rotate images in slider</span>
              </label>
            </div>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40">Image Optimization</p>
            <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#1a1a1a]/40">Storage Used</span>
                <span className="font-medium">4.2 MB / 50 MB</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a1a1a]/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a1a1a]" style={{ width: '8.4%' }}></div>
              </div>
              <p className="text-[10px] text-[#1a1a1a]/40 pt-1">Images are automatically optimized for web performance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
