import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Edit2, 
  Wrench, 
  CheckCircle2, 
  DoorOpen,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import roomService from '../../api/rooms';
import type { RoomStatus } from '../../types/database';

export default function RoomDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  
  const { data: room, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoom(Number(id)),
    enabled: !!id,
  });

  const { data: roomType } = useQuery({
    queryKey: ['roomType', room?.roomTypeId],
    queryFn: () => roomService.getRoomType(room?.roomTypeId || 0),
    enabled: !!room?.roomTypeId,
  });

  const { data: roomImages } = useQuery({
    queryKey: ['roomTypeImages', room?.roomTypeId],
    queryFn: () => roomService.getRoomTypeImages(room?.roomTypeId || 0),
    enabled: !!room?.roomTypeId,
  });

  const tabs = ['Overview', 'Amenities', 'Housekeeping', 'Maintenance', 'History'];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Occupied': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Dirty': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Maintenance': return 'bg-red-50 text-red-600 border-red-100';
      case 'Reserved': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a1a1a]"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Room not found</p>
        <button 
          onClick={() => navigate('/rooms/list')}
          className="mt-4 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg"
        >
          Back to Rooms
        </button>
      </div>
    );
  }

  const rt: any = roomType;
  const roomTypeName = rt?.typeName || rt?.TypeName || `Type ${room?.roomTypeId}`;
  const roomPrice = rt?.basePrice || rt?.BasePrice || 0;
  const roomDescription = rt?.description || rt?.Description || '';
  const roomImagesList = roomImages?.map((img: any) => img.imageUrl || img.ImageURL) || [];
  const floorNumber = (room as any).floorNumber || `Floor ${room?.floorId}`;

  const mainImage = roomImagesList.length > 0 ? roomImagesList[0] : null;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/rooms/list')}
            className="p-2 hover:bg-[#1a1a1a]/5 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-serif font-light">Room {room.roomNumber}</h1>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border ${getStatusStyles(room.status)}`}>
                {room.status}
              </span>
            </div>
            <p className="text-sm text-[#1a1a1a]/60 font-light">{roomTypeName} • {floorNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(`/rooms/edit/${room.roomId}`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1a1a1a]/10 rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#f8f9fa] transition-colors"
          >
            <Edit2 size={14} />
            Edit Room
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-xs font-medium uppercase tracking-widest hover:bg-[#333] transition-colors">
            <Wrench size={14} />
            Schedule Maintenance
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex border-b border-[#1a1a1a]/10">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-xs font-medium uppercase tracking-widest transition-all relative ${
                  activeTab === tab ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/40 hover:text-[#1a1a1a]/60'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1a1a1a]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white p-8 rounded-2xl border border-[#1a1a1a]/5 shadow-sm min-h-[400px]">
            {activeTab === 'Overview' && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Room Image */}
                <div className="aspect-video rounded-2xl overflow-hidden bg-[#f8f9fa]">
                  {mainImage ? (
                    <img src={mainImage} alt={roomTypeName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#1a1a1a]/20">
                      <DoorOpen size={64} />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <DoorOpen size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Room Info</span>
                    </div>
                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Room Type</span>
                        <span className="text-xs font-medium">{roomTypeName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Floor</span>
                        <span className="text-xs font-medium">{floorNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Base Price</span>
                        <span className="text-xs font-medium font-serif">${roomPrice} / night</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Cleaning Status</span>
                        <span className="text-xs font-medium">{room?.cleaningStatus || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[#1a1a1a]/40">
                      <Clock size={18} />
                      <span className="text-[10px] uppercase tracking-widest font-semibold">Last Activity</span>
                    </div>
                    <div className="p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Last Cleaned</span>
                        <span className="text-xs font-medium">{room?.lastCleaned ? new Date(room.lastCleaned).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#1a1a1a]/40">Last Checkout</span>
                        <span className="text-xs font-medium">Yesterday, 11:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-serif">Quick Description</h3>
                  <p className="text-sm text-[#1a1a1a]/60 font-light leading-relaxed">
                    {roomDescription || `This ${roomTypeName?.toLowerCase() || 'room'} on the ${floorNumber ? String(floorNumber) + ' floor' : 'floor'} offers a premium experience with modern amenities.`}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'Amenities' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in duration-500">
                <div className="flex items-center gap-3 p-4 bg-[#f8f9fa] rounded-xl border border-[#1a1a1a]/5">
                  <span className="text-xs font-medium">No amenities data available</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Status & Actions */}
        <div className="space-y-8">
          {/* Status Control Card */}
          <div className="bg-white p-6 rounded-2xl border border-[#1a1a1a]/5 shadow-sm space-y-6">
            <h3 className="text-lg font-serif">Status Control</h3>
            <div className="space-y-3">
              {['Available', 'Occupied', 'Dirty', 'Maintenance', 'Reserved'].map(status => (
                <button 
                  key={status}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    room.status === status 
                      ? 'border-[#1a1a1a] bg-[#1a1a1a]/5 font-medium' 
                      : 'border-[#1a1a1a]/5 hover:bg-[#f8f9fa] text-[#1a1a1a]/40'
                  }`}
                >
                  <span className="text-xs">{status}</span>
                  {room.status === status && <CheckCircle2 size={14} className="text-[#1a1a1a]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <p className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a]/40 px-2">Housekeeping Actions</p>
            <button className="w-full p-4 bg-white border border-[#1a1a1a]/5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-[#1a1a1a]/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Mark as Clean</p>
                <p className="text-[10px] text-[#1a1a1a]/40 font-light">Update status to available</p>
              </div>
            </button>
            <button className="w-full p-4 bg-white border border-[#1a1a1a]/5 rounded-2xl shadow-sm flex items-center gap-4 hover:border-[#1a1a1a]/20 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Mark as Dirty</p>
                <p className="text-[10px] text-[#1a1a1a]/40 font-light">Request immediate cleaning</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
