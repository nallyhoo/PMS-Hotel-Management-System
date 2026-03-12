import api from './client';

export interface KeyCard {
  keyCardId: number;
  cardNumber: string;
  roomId: number;
  roomNumber?: string;
  roomTypeName?: string;
  guestName?: string;
  reservationId?: number;
  status: 'Active' | 'Inactive' | 'Lost' | 'Returned';
  issueDate: string;
  expiryDate?: string;
  returnDate?: string;
  notes?: string;
}

export interface CreateKeyCardRequest {
  cardNumber: string;
  roomId: number;
  guestName?: string;
  reservationId?: number;
  expiryDate?: string;
  notes?: string;
}

class KeyCardService {
  async getKeyCards(params?: { status?: string; roomId?: number }): Promise<KeyCard[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    const url = queryParams.toString() ? `/keycards?${queryParams}` : '/keycards';
    return api.get<KeyCard[]>(url);
  }

  async getActiveKeyCards(): Promise<KeyCard[]> {
    return api.get<KeyCard[]>('/keycards/active');
  }

  async getKeyCard(id: number): Promise<KeyCard> {
    return api.get<KeyCard>(`/keycards/${id}`);
  }

  async createKeyCard(data: CreateKeyCardRequest): Promise<{ keyCardId: number }> {
    return api.post<{ keyCardId: number }>('/keycards', data);
  }

  async updateKeyCard(id: number, data: Partial<CreateKeyCardRequest & { status: string }>): Promise<void> {
    return api.put<void>(`/keycards/${id}`, data);
  }

  async returnKeyCard(id: number): Promise<void> {
    return api.post<void>(`/keycards/${id}/return`, {});
  }

  async deactivateKeyCard(id: number): Promise<void> {
    return api.post<void>(`/keycards/${id}/deactivate`, {});
  }

  async markAsLost(id: number): Promise<void> {
    return api.post<void>(`/keycards/${id}/lost`, {});
  }

  async deleteKeyCard(id: number): Promise<void> {
    return api.delete<void>(`/keycards/${id}`);
  }

  async getKeyCardsByRoom(roomId: number): Promise<KeyCard[]> {
    return api.get<KeyCard[]>(`/keycards/room/${roomId}`);
  }

  generateCardNumber(): string {
    return String(Math.floor(100000 + Math.random() * 900000));
  }
}

export default new KeyCardService();
