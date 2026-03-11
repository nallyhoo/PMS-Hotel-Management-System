import api from './client';
import type { Reservation, ReservationNote, ReservationRoom, ReservationHistory } from '../types/database';

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetReservationsParams {
  status?: string;
  checkIn?: string;
  checkOut?: string;
  source?: string;
  guestId?: number;
  page?: number;
  limit?: number;
}

export interface CreateReservationRequest {
  guestId: number;
  branchId: number;
  checkInDate: string;
  checkOutDate: string;
  bookingSource: string;
  adults?: number;
  children?: number;
  specialRequests?: string;
  totalAmount: number;
  depositAmount?: number;
  depositPaid?: boolean;
}

export interface UpdateReservationRequest {
  checkInDate?: string;
  checkOutDate?: string;
  adults?: number;
  children?: number;
  specialRequests?: string;
  totalAmount?: number;
  status?: string;
}

export interface CancelReservationRequest {
  reason: string;
}

export interface CheckInRequest {
  roomId: number;
  keyCardNumber?: string;
  notes?: string;
}

export interface CheckOutRequest {
  totalBill: number;
  paymentStatus?: string;
  roomInspected?: boolean;
  inspectionNotes?: string;
  notes?: string;
}

export interface CreateNoteRequest {
  noteText: string;
  noteType?: string;
}

class ReservationService {
  async getReservations(params?: GetReservationsParams): Promise<PaginatedResponse<Reservation>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.checkIn) queryParams.append('checkIn', params.checkIn);
    if (params?.checkOut) queryParams.append('checkOut', params.checkOut);
    if (params?.source) queryParams.append('source', params.source);
    if (params?.guestId) queryParams.append('guestId', String(params.guestId));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    return api.get<PaginatedResponse<Reservation>>(`/reservations?${queryParams}`);
  }

  async getReservation(id: number): Promise<Reservation> {
    return api.get<Reservation>(`/reservations/${id}`);
  }

  async createReservation(data: CreateReservationRequest): Promise<{ reservationId: number; reservationCode: string }> {
    return api.post<{ reservationId: number; reservationCode: string }>('/reservations', data);
  }

  async updateReservation(id: number, data: UpdateReservationRequest): Promise<void> {
    return api.put<void>(`/reservations/${id}`, data);
  }

  async deleteReservation(id: number): Promise<void> {
    return api.delete<void>(`/reservations/${id}`);
  }

  async cancelReservation(id: number, data: CancelReservationRequest): Promise<void> {
    return api.post<void>(`/reservations/${id}/cancel`, data);
  }

  async confirmReservation(id: number): Promise<void> {
    return api.post<void>(`/reservations/${id}/confirm`);
  }

  async checkIn(id: number, data: CheckInRequest): Promise<void> {
    return api.post<void>(`/reservations/${id}/checkin`, data);
  }

  async checkOut(id: number, data: CheckOutRequest): Promise<void> {
    return api.post<void>(`/reservations/${id}/checkout`, data);
  }

  async getReservationNotes(id: number): Promise<ReservationNote[]> {
    return api.get<ReservationNote[]>(`/reservations/${id}/notes`);
  }

  async addReservationNote(id: number, data: CreateNoteRequest): Promise<{ noteId: number }> {
    return api.post<{ noteId: number }>(`/reservations/${id}/notes`, data);
  }

  async getReservationCalendar(startDate: string, endDate: string): Promise<any> {
    const queryParams = new URLSearchParams({ startDate, endDate });
    return api.get<any>(`/reservations/calendar?${queryParams}`);
  }

  async getReservationRooms(id: number): Promise<ReservationRoom[]> {
    return api.get<ReservationRoom[]>(`/reservations/${id}/rooms`);
  }

  async getReservationHistory(id: number): Promise<ReservationHistory[]> {
    return api.get<ReservationHistory[]>(`/reservations/${id}/history`);
  }

  async getRoomTypes(): Promise<any[]> {
    return api.get<any[]>('/rooms/types/list');
  }
}

export const reservationService = new ReservationService();
export default reservationService;
