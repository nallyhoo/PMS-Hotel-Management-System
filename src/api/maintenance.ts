import api from './client';
import type { MaintenanceRequest, MaintenanceTask, MaintenanceHistory } from '../types/database';

export interface GetMaintenanceRequestsParams {
  status?: string;
  priority?: string;
  roomId?: number;
}

export interface CreateMaintenanceRequestRequest {
  roomId: number;
  requestType: string;
  priority?: string;
  description: string;
  reportedBy?: number;
  scheduledDate?: string;
  estimatedCost?: number;
}

export interface UpdateMaintenanceRequestRequest {
  status?: string;
  scheduledDate?: string;
  estimatedCost?: number;
  actualCost?: number;
  notes?: string;
}

export interface CreateMaintenanceTaskRequest {
  requestId: number;
  assignedStaffId?: number;
  startDate?: string;
}

export interface UpdateMaintenanceTaskRequest {
  status?: string;
  completionDate?: string;
  notes?: string;
}

export interface GetMaintenanceHistoryParams {
  roomId?: number;
  startDate?: string;
  endDate?: string;
}

class MaintenanceService {
  async getRequests(params?: GetMaintenanceRequestsParams): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    
    const query = queryParams.toString();
    return api.get<any[]>(`/maintenance/requests${query ? `?${query}` : ''}`);
  }

  async getRequest(id: number): Promise<any> {
    return api.get<any>(`/maintenance/requests/${id}`);
  }

  async createRequest(data: CreateMaintenanceRequestRequest): Promise<{ requestId: number }> {
    return api.post<{ requestId: number }>('/maintenance/requests', data);
  }

  async updateRequest(id: number, data: UpdateMaintenanceRequestRequest): Promise<void> {
    return api.put<void>(`/maintenance/requests/${id}`, data);
  }

  async createTask(data: CreateMaintenanceTaskRequest): Promise<{ taskId: number }> {
    return api.post<{ taskId: number }>('/maintenance/tasks', data);
  }

  async updateTask(id: number, data: UpdateMaintenanceTaskRequest): Promise<void> {
    return api.put<void>(`/maintenance/tasks/${id}`, data);
  }

  async getHistory(params?: GetMaintenanceHistoryParams): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return api.get<any[]>(`/maintenance/history${query ? `?${query}` : ''}`);
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
