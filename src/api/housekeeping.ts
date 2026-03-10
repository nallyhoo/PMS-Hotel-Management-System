import api from './client';
import type { HousekeepingTask, HousekeepingStatus, CleaningLog, HousekeepingDashboard } from '../types/database';

export interface GetHousekeepingTasksParams {
  status?: string;
  scheduledDate?: string;
  assignedStaffId?: number;
}

export interface CreateHousekeepingTaskRequest {
  roomId: number;
  taskType: string;
  assignedStaffId?: number;
  priority?: string;
  scheduledDate: string;
  scheduledTime?: string;
  notes?: string;
}

export interface UpdateHousekeepingTaskRequest {
  status?: string;
  assignedStaffId?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
}

export interface CreateCleaningLogRequest {
  roomId: number;
  staffId: number;
  taskId?: number;
  cleaningType?: string;
  startTime: string;
  endTime?: string;
  status?: string;
  notes?: string;
  rating?: number;
}

class HousekeepingService {
  async getTasks(params?: GetHousekeepingTasksParams): Promise<HousekeepingTask[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.scheduledDate) queryParams.append('scheduledDate', params.scheduledDate);
    if (params?.assignedStaffId) queryParams.append('assignedStaffId', String(params.assignedStaffId));
    
    return api.get<HousekeepingTask[]>(`/housekeeping/tasks?${queryParams}`);
  }

  async createTask(data: CreateHousekeepingTaskRequest): Promise<{ taskId: number }> {
    return api.post<{ taskId: number }>('/housekeeping/tasks', data);
  }

  async updateTask(id: number, data: UpdateHousekeepingTaskRequest): Promise<void> {
    return api.put<void>(`/housekeeping/tasks/${id}`, data);
  }

  async deleteTask(id: number): Promise<void> {
    return api.delete<void>(`/housekeeping/tasks/${id}`);
  }

  async getStatus(): Promise<HousekeepingStatus[]> {
    return api.get<HousekeepingStatus[]>('/housekeeping/status');
  }

  async createLog(data: CreateCleaningLogRequest): Promise<{ logId: number }> {
    return api.post<{ logId: number }>('/housekeeping/logs', data);
  }

  async getDashboard(): Promise<HousekeepingDashboard> {
    return api.get<HousekeepingDashboard>('/housekeeping/dashboard');
  }
}

export const housekeepingService = new HousekeepingService();
export default housekeepingService;
