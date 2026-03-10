import api from './client';
import type { Room, RoomType, RoomAmenity, RoomStatusBoard } from '../types/database';

export interface GetRoomsParams {
  status?: string;
  floorId?: number;
  roomTypeId?: number;
  branchId?: number;
}

export interface CreateRoomRequest {
  branchId: number;
  roomNumber: string;
  roomTypeId: number;
  floorId: number;
  status?: string;
  notes?: string;
}

export interface CreateRoomTypeRequest {
  typeName: string;
  description?: string;
  capacity?: number;
  basePrice: number;
  maxOccupancy?: number;
  bedType?: string;
  sizeSqFt?: number;
}

export interface CreateAmenityRequest {
  amenityName: string;
  amenityType?: string;
  description?: string;
  icon?: string;
}

export interface CheckAvailabilityParams {
  checkIn: string;
  checkOut: string;
  roomTypeId?: number;
  guests?: number;
}

class RoomService {
  async getRooms(params?: GetRoomsParams): Promise<Room[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.floorId) queryParams.append('floorId', String(params.floorId));
    if (params?.roomTypeId) queryParams.append('roomTypeId', String(params.roomTypeId));
    if (params?.branchId) queryParams.append('branchId', String(params.branchId));
    
    const query = queryParams.toString();
    return api.get<Room[]>(`/rooms${query ? `?${query}` : ''}`);
  }

  async getRoom(id: number): Promise<Room> {
    return api.get<Room>(`/rooms/${id}`);
  }

  async createRoom(data: CreateRoomRequest): Promise<{ roomId: number }> {
    return api.post<{ roomId: number }>('/rooms', data);
  }

  async updateRoom(id: number, data: Partial<CreateRoomRequest>): Promise<void> {
    return api.put<void>(`/rooms/${id}`, data);
  }

  async deleteRoom(id: number): Promise<void> {
    return api.delete<void>(`/rooms/${id}`);
  }

  async checkAvailability(params: CheckAvailabilityParams): Promise<Room[]> {
    const queryParams = new URLSearchParams({
      checkIn: params.checkIn,
      checkOut: params.checkOut,
    });
    if (params.roomTypeId) queryParams.append('roomTypeId', String(params.roomTypeId));
    if (params.guests) queryParams.append('guests', String(params.guests));
    
    return api.get<Room[]>(`/rooms/availability/check?${queryParams}`);
  }

  async getRoomTypes(): Promise<RoomType[]> {
    return api.get<RoomType[]>('/rooms/types/list');
  }

  async getRoomType(id: number): Promise<RoomType> {
    return api.get<RoomType>(`/rooms/types/${id}`);
  }

  async createRoomType(data: CreateRoomTypeRequest): Promise<{ roomTypeId: number }> {
    return api.post<{ roomTypeId: number }>('/rooms/types', data);
  }

  async updateRoomType(id: number, data: Partial<CreateRoomTypeRequest>): Promise<void> {
    return api.put<void>(`/rooms/types/${id}`, data);
  }

  async deleteRoomType(id: number): Promise<void> {
    return api.delete<void>(`/rooms/types/${id}`);
  }

  async getAmenities(): Promise<RoomAmenity[]> {
    return api.get<RoomAmenity[]>('/rooms/amenities');
  }

  async createAmenity(data: CreateAmenityRequest): Promise<{ amenityId: number }> {
    return api.post<{ amenityId: number }>('/rooms/amenities', data);
  }

  async deleteAmenity(id: number): Promise<void> {
    return api.delete<void>(`/rooms/amenities/${id}`);
  }

  async getStatusBoard(): Promise<RoomStatusBoard[]> {
    return api.get<RoomStatusBoard[]>('/rooms/status-board');
  }
}

export const roomService = new RoomService();
export default roomService;
