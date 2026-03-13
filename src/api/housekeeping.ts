import api from './client';
import type { HousekeepingTask, HousekeepingStatus, CleaningLog, HousekeepingDashboard } from '../types/database';

export interface GetHousekeepingTasksParams {
  status?: string;
  scheduledDate?: string;
  assignedStaffId?: number;
  priority?: string;
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

export interface HousekeepingStaff {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  phone?: string;
  email?: string;
  activeTasks: number;
}

export interface HousekeepingRoom {
  roomId: number;
  roomNumber: string;
  typeName?: string;
  cleaningStatus?: string;
  roomStatus?: string;
  floorId?: number;
  lastCleaned?: string;
  lastCleanScheduled?: string;
  activeTasks?: number;
  currentReservationId?: number | null;
}

export interface HousekeepingDashboardData {
  stats: {
    totalRooms: number;
    dirtyRooms: number;
    inProgress: number;
    cleanAndReady: number;
    pending: number;
    completed: number;
  };
  activeTasks: HousekeepingTask[];
  staffOnDuty: HousekeepingStaff[];
}

export interface HousekeepingReportsData {
  tasksByStatus: { status: string; count: number }[];
  tasksByType: { taskType: string; count: number }[];
  staffProductivity: {
    employeeId: number;
    firstName: string;
    lastName: string;
    totalTasks: number;
    completedTasks: number;
    avgMinutes: number;
  }[];
  avgCleaningTime: number;
  delayedTasks: number;
  passRate: number;
}

export interface StatusBoardItem {
  typeName: string;
  total: number;
  available: number;
  occupied: number;
  dirty: number;
  maintenance: number;
  reserved: number;
}

class HousekeepingService {
  async getTasks(params?: GetHousekeepingTasksParams): Promise<HousekeepingTask[]> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.scheduledDate) queryParams.append('scheduledDate', params.scheduledDate);
    if (params?.assignedStaffId) queryParams.append('assignedStaffId', String(params.assignedStaffId));
    if (params?.priority) queryParams.append('priority', params.priority);
    
    return api.get<HousekeepingTask[]>(`/housekeeping/tasks?${queryParams}`);
  }

  async getTask(id: number): Promise<HousekeepingTask> {
    return api.get<HousekeepingTask>(`/housekeeping/tasks/${id}`);
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

  async getStatusBoard(): Promise<StatusBoardItem[]> {
    return api.get<StatusBoardItem[]>('/housekeeping/status-board');
  }

  async createLog(data: CreateCleaningLogRequest): Promise<{ logId: number }> {
    return api.post<{ logId: number }>('/housekeeping/logs', data);
  }

  async getDashboard(): Promise<HousekeepingDashboardData> {
    return api.get<HousekeepingDashboardData>('/housekeeping/dashboard');
  }

  async getStaff(): Promise<HousekeepingStaff[]> {
    return api.get<HousekeepingStaff[]>('/housekeeping/staff');
  }

  async getDirtyRooms(): Promise<HousekeepingRoom[]> {
    return api.get<HousekeepingRoom[]>('/housekeeping/rooms/dirty');
  }

  async getRooms(cleaningStatus?: string): Promise<HousekeepingRoom[]> {
    const queryParams = new URLSearchParams();
    if (cleaningStatus) queryParams.append('cleaningStatus', cleaningStatus);
    return api.get<HousekeepingRoom[]>(`/housekeeping/rooms?${queryParams}`);
  }

  async getReports(days?: number): Promise<HousekeepingReportsData> {
    const queryParams = new URLSearchParams();
    if (days) queryParams.append('days', String(days));
    return api.get<HousekeepingReportsData>(`/housekeeping/reports/analytics?${queryParams}`);
  }

  async requestInspection(taskId: number, notes?: string): Promise<{ inspectionTaskId: number }> {
    return api.post<{ inspectionTaskId: number }>(`/housekeeping/tasks/${taskId}/request-inspection`, { notes });
  }

  async approveTask(taskId: number, approved: boolean, notes?: string): Promise<void> {
    return api.post<void>(`/housekeeping/tasks/${taskId}/approve`, { approved, notes });
  }

  async uploadPhoto(taskId: number, photoUrl: string, photoType?: string, notes?: string): Promise<{ photoId: number }> {
    return api.post<{ photoId: number }>(`/housekeeping/tasks/${taskId}/photos`, { photoUrl, photoType, notes });
  }

  async getTaskPhotos(taskId: number): Promise<any[]> {
    return api.get<any[]>(`/housekeeping/tasks/${taskId}/photos`);
  }

  async exportTasks(params?: { startDate?: string; endDate?: string; format?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.format) queryParams.append('format', params.format);
    return api.get<any[]>(`/housekeeping/export/tasks?${queryParams}`);
  }

  async exportStaffPerformance(params?: { startDate?: string; endDate?: string; format?: string }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.format) queryParams.append('format', params.format);
    return api.get<any[]>(`/housekeeping/export/staff-performance?${queryParams}`);
  }

  async getDailySummary(date?: string): Promise<any> {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    return api.get<any>(`/housekeeping/export/daily-summary?${queryParams}`);
  }

  async getSchedule(params?: { startDate?: string; endDate?: string }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return api.get<any[]>(`/housekeeping/schedule?${queryParams}`);
  }

  async getShifts(date?: string): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (date) queryParams.append('date', date);
    return api.get<any[]>(`/housekeeping/schedule/shifts?${queryParams}`);
  }

  async createSchedule(data: { employeeId: number; shiftDate: string; shiftType: string; startTime: string; endTime: string; breakDuration?: number; notes?: string }): Promise<{ scheduleId: number }> {
    return api.post<{ scheduleId: number }>('/housekeeping/schedule', data);
  }

  async updateSchedule(id: number, data: { shiftType?: string; startTime?: string; endTime?: string; breakDuration?: number; status?: string; notes?: string }): Promise<void> {
    return api.put<void>(`/housekeeping/schedule/${id}`, data);
  }

  async deleteSchedule(id: number): Promise<void> {
    return api.delete<void>(`/housekeeping/schedule/${id}`);
  }

  async bulkCreateSchedule(schedules: { employeeId: number; shiftDate: string; shiftType: string; startTime: string; endTime: string; breakDuration?: number; notes?: string }[]): Promise<void> {
    return api.post<void>('/housekeeping/schedule/bulk', { schedules });
  }

  async getSupplies(params?: { category?: string; lowStock?: boolean }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.lowStock) queryParams.append('lowStock', 'true');
    return api.get<any[]>(`/housekeeping/supplies?${queryParams}`);
  }

  async getSupply(id: number): Promise<any> {
    return api.get<any>(`/housekeeping/supplies/${id}`);
  }

  async createSupply(data: { itemName: string; itemCode?: string; category?: string; unit?: string; minStockLevel?: number; currentStock?: number; costPerUnit?: number; supplier?: string }): Promise<{ supplyId: number }> {
    return api.post<{ supplyId: number }>('/housekeeping/supplies', data);
  }

  async updateSupply(id: number, data: { itemName?: string; itemCode?: string; category?: string; unit?: string; minStockLevel?: number; currentStock?: number; costPerUnit?: number; supplier?: string }): Promise<void> {
    return api.put<void>(`/housekeeping/supplies/${id}`, data);
  }

  async deleteSupply(id: number): Promise<void> {
    return api.delete<void>(`/housekeeping/supplies/${id}`);
  }

  async adjustSupplyStock(id: number, adjustment: number, notes?: string): Promise<{ newStock: number }> {
    return api.post<{ newStock: number }>(`/housekeeping/supplies/${id}/adjust`, { adjustment, notes });
  }

  async getLowStockSupplies(): Promise<any[]> {
    return api.get<any[]>('/housekeeping/supplies/low-stock');
  }

  async recordSupplyUsage(data: { taskId?: number; supplyId: number; quantityUsed: number; usedBy?: number; notes?: string }): Promise<{ usageId: number }> {
    return api.post<{ usageId: number }>('/housekeeping/usage', data);
  }

  async getSupplyUsage(params?: { taskId?: number; startDate?: string; endDate?: string }): Promise<any[]> {
    const queryParams = new URLSearchParams();
    if (params?.taskId) queryParams.append('taskId', String(params.taskId));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    return api.get<any[]>(`/housekeeping/usage?${queryParams}`);
  }

  async getOverdueTasks(): Promise<any[]> {
    return api.get<any[]>('/housekeeping/alerts/overdue');
  }

  async getLowStockAlerts(): Promise<any[]> {
    return api.get<any[]>('/housekeeping/alerts/low-stock');
  }

  async getDashboardAlerts(): Promise<any> {
    return api.get<any>('/housekeeping/alerts/dashboard');
  }
}

export const housekeepingService = new HousekeepingService();
export default housekeepingService;
