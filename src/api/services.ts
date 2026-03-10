import api from './client';
import type { Service, ServiceCategory, ServiceOrder } from '../types/database';

export interface CreateServiceRequest {
  serviceName: string;
  categoryId?: number;
  description?: string;
  price: number;
  priceType?: string;
  imageUrl?: string;
}

export interface CreateServiceCategoryRequest {
  categoryName: string;
  description?: string;
  sortOrder?: number;
}

export interface CreateServiceOrderRequest {
  reservationId?: number;
  roomId?: number;
  orderType: string;
  staffId?: number;
  deliveryRoom?: string;
  tableNumber?: string;
  numberOfGuests?: number;
  notes?: string;
  items: CreateServiceOrderItemRequest[];
}

export interface CreateServiceOrderItemRequest {
  serviceId: number;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface GetServiceOrdersParams {
  status?: string;
  orderType?: string;
  roomId?: number;
}

class ServicePOSService {
  async getServices(): Promise<Service[]> {
    return api.get<Service[]>('/services/services');
  }

  async getService(id: number): Promise<Service> {
    return api.get<Service>(`/services/services/${id}`);
  }

  async createService(data: CreateServiceRequest): Promise<{ serviceId: number }> {
    return api.post<{ serviceId: number }>('/services/services', data);
  }

  async updateService(id: number, data: Partial<CreateServiceRequest>): Promise<void> {
    return api.put<void>(`/services/services/${id}`, data);
  }

  async deleteService(id: number): Promise<void> {
    return api.delete<void>(`/services/services/${id}`);
  }

  async getCategories(): Promise<ServiceCategory[]> {
    return api.get<ServiceCategory[]>('/services/categories');
  }

  async createCategory(data: CreateServiceCategoryRequest): Promise<{ categoryId: number }> {
    return api.post<{ categoryId: number }>('/services/categories', data);
  }

  async getOrders(params?: GetServiceOrdersParams): Promise<ServiceOrder[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.orderType) queryParams.append('orderType', params.orderType);
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    
    return api.get<ServiceOrder[]>(`/services/orders?${queryParams}`);
  }

  async createOrder(data: CreateServiceOrderRequest): Promise<{ orderId: number }> {
    return api.post<{ orderId: number }>('/services/orders', data);
  }

  async updateOrder(id: number, status: string): Promise<void> {
    return api.put<void>(`/services/orders/${id}`, { status });
  }
}

export const servicePOSService = new ServicePOSService();
export default servicePOSService;
