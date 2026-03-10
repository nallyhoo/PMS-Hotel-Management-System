import api from './client';
import type { Guest, GuestDocument, GuestPreference, GuestLoyalty } from '../types/database';

export interface GetGuestsParams {
  page?: number;
  limit?: number;
  search?: string;
  vipStatus?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateGuestRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  vipStatus?: string;
  notes?: string;
}

export interface CreateDocumentRequest {
  documentType: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  imageUrl?: string;
}

export interface CreatePreferenceRequest {
  preferenceType: string;
  preferenceValue?: string;
  notes?: string;
}

export interface UpdateLoyaltyRequest {
  points: number;
  tierLevel: string;
}

class GuestService {
  async getGuests(params?: GetGuestsParams): Promise<PaginatedResponse<Guest>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.vipStatus) queryParams.append('vipStatus', params.vipStatus);
    
    return api.get<PaginatedResponse<Guest>>(`/guests?${queryParams}`);
  }

  async getGuest(id: number): Promise<Guest> {
    return api.get<Guest>(`/guests/${id}`);
  }

  async createGuest(data: CreateGuestRequest): Promise<{ guestId: number }> {
    return api.post<{ guestId: number }>('/guests', data);
  }

  async updateGuest(id: number, data: Partial<CreateGuestRequest>): Promise<void> {
    return api.put<void>(`/guests/${id}`, data);
  }

  async deleteGuest(id: number): Promise<void> {
    return api.delete<void>(`/guests/${id}`);
  }

  async getGuestDocuments(guestId: number): Promise<GuestDocument[]> {
    return api.get<GuestDocument[]>(`/guests/${guestId}/documents`);
  }

  async addGuestDocument(guestId: number, data: CreateDocumentRequest): Promise<{ documentId: number }> {
    return api.post<{ documentId: number }>(`/guests/${guestId}/documents`, data);
  }

  async getGuestPreferences(guestId: number): Promise<GuestPreference[]> {
    return api.get<GuestPreference[]>(`/guests/${guestId}/preferences`);
  }

  async addGuestPreference(guestId: number, data: CreatePreferenceRequest): Promise<{ preferenceId: number }> {
    return api.post<{ preferenceId: number }>(`/guests/${guestId}/preferences`, data);
  }

  async getGuestLoyalty(guestId: number): Promise<GuestLoyalty> {
    return api.get<GuestLoyalty>(`/guests/${guestId}/loyalty`);
  }

  async updateGuestLoyalty(guestId: number, data: UpdateLoyaltyRequest): Promise<void> {
    return api.put<void>(`/guests/${guestId}/loyalty`, data);
  }

  async getGuestReservations(guestId: number): Promise<Guest[]> {
    return api.get<Guest[]>(`/guests/${guestId}/reservations`);
  }
}

export const guestService = new GuestService();
export default guestService;
