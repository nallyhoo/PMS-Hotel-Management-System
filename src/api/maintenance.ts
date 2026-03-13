import api from './client';
import type { MaintenanceRequest, MaintenanceTask, MaintenanceHistory } from '../types/database';

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetMaintenanceRequestsParams extends PaginationParams {
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
  priority?: string;
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

export interface GetMaintenanceHistoryParams extends PaginationParams {
  roomId?: number;
  startDate?: string;
  endDate?: string;
}

export interface Staff {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  departmentName: string;
  activeTasks: number;
}

class MaintenanceService {
  async getDashboard(): Promise<any> {
    return api.get<any>('/maintenance/dashboard');
  }

  async getRequests(params?: GetMaintenanceRequestsParams): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.priority) queryParams.append('priority', params.priority);
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    if (params?.search) queryParams.append('search', params.search);
    
    const query = queryParams.toString();
    return api.get<PaginatedResponse<any>>(`/maintenance/requests${query ? `?${query}` : ''}`);
  }

  async getRequest(id: number): Promise<any> {
    return api.get<any>(`/maintenance/requests/${id}`);
  }

  async createRequest(data: CreateMaintenanceRequestRequest): Promise<{ requestId: number }> {
    return api.post<{ requestId: number }>('/maintenance/requests', data);
  }

  async updateRequest(id: number, data: UpdateMaintenanceRequestRequest): Promise<{ message: string }> {
    return api.put<{ message: string }>(`/maintenance/requests/${id}`, data);
  }

  async createTask(data: CreateMaintenanceTaskRequest): Promise<{ taskId: number }> {
    return api.post<{ taskId: number }>('/maintenance/tasks', data);
  }

  async updateTask(id: number, data: UpdateMaintenanceTaskRequest): Promise<{ message: string }> {
    return api.put<{ message: string }>(`/maintenance/tasks/${id}`, data);
  }

  async getHistory(params?: GetMaintenanceHistoryParams): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.roomId) queryParams.append('roomId', String(params.roomId));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const query = queryParams.toString();
    return api.get<PaginatedResponse<any>>(`/maintenance/history${query ? `?${query}` : ''}`);
  }

  async getStaff(): Promise<Staff[]> {
    return api.get<Staff[]>('/maintenance/staff');
  }

  async addStaff(data: { firstName: string; lastName: string; position?: string; phone?: string; email?: string }): Promise<any> {
    return api.post<any>('/maintenance/staff', data);
  }
}

export const maintenanceService = new MaintenanceService();
export default maintenanceService;
