import api from './client';
import type { Hotel, HotelBranch, Floor } from '../types/database';

export interface CreateHotelRequest {
  hotelName: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
}

export interface CreateBranchRequest {
  branchName: string;
  address?: string;
  phone?: string;
}

export interface CreateFloorRequest {
  floorNumber: number;
  floorName?: string;
  description?: string;
}

class HotelService {
  async getHotels(): Promise<Hotel[]> {
    return api.get<Hotel[]>('/hotels');
  }

  async getHotel(id: number): Promise<Hotel> {
    return api.get<Hotel>(`/hotels/${id}`);
  }

  async createHotel(data: CreateHotelRequest): Promise<{ hotelId: number }> {
    return api.post<{ hotelId: number }>('/hotels', data);
  }

  async updateHotel(id: number, data: CreateHotelRequest): Promise<void> {
    return api.put<void>(`/hotels/${id}`, data);
  }

  async deleteHotel(id: number): Promise<void> {
    return api.delete<void>(`/hotels/${id}`);
  }

  async getBranches(hotelId: number): Promise<HotelBranch[]> {
    return api.get<HotelBranch[]>(`/hotels/${hotelId}/branches`);
  }

  async createBranch(hotelId: number, data: CreateBranchRequest): Promise<{ branchId: number }> {
    return api.post<{ branchId: number }>(`/hotels/${hotelId}/branches`, data);
  }

  async getFloors(hotelId: number): Promise<Floor[]> {
    return api.get<Floor[]>(`/hotels/${hotelId}/floors`);
  }

  async createFloor(hotelId: number, data: CreateFloorRequest): Promise<{ floorId: number }> {
    return api.post<{ floorId: number }>(`/hotels/${hotelId}/floors`, data);
  }
}

export const hotelService = new HotelService();
export default hotelService;
