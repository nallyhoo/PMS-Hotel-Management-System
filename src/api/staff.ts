import api from './client';
import type { Employee, Department, EmployeeSchedule, Attendance } from '../types/database';

export interface GetEmployeesParams {
  departmentId?: number;
  employmentStatus?: string;
  position?: string;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  position: string;
  departmentId?: number;
  hireDate: string;
  salary?: number;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface CreateDepartmentRequest {
  departmentName: string;
  description?: string;
  managerId?: number;
}

export interface CreateScheduleRequest {
  employeeId: number;
  shiftDate: string;
  shiftType: string;
  startTime: string;
  endTime: string;
  breakDuration?: number;
  notes?: string;
}

export interface GetAttendanceParams {
  employeeId?: number;
  attendanceDate?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface GetSchedulesParams {
  employeeId?: number;
  shiftDate?: string;
  startDate?: string;
  endDate?: string;
}

class StaffService {
  async getEmployees(params?: GetEmployeesParams): Promise<Employee[]> {
    const queryParams = new URLSearchParams();
    if (params?.departmentId) queryParams.append('departmentId', String(params.departmentId));
    if (params?.employmentStatus) queryParams.append('employmentStatus', params.employmentStatus);
    if (params?.position) queryParams.append('position', params.position);
    
    return api.get<Employee[]>(`/staff?${queryParams}`);
  }

  async getEmployee(id: number): Promise<Employee> {
    return api.get<Employee>(`/staff/${id}`);
  }

  async createEmployee(data: CreateEmployeeRequest): Promise<{ employeeId: number }> {
    return api.post<{ employeeId: number }>('/staff', data);
  }

  async updateEmployee(id: number, data: Partial<CreateEmployeeRequest>): Promise<void> {
    return api.put<void>(`/staff/${id}`, data);
  }

  async terminateEmployee(id: number): Promise<void> {
    return api.delete<void>(`/staff/${id}`);
  }

  async getDepartments(): Promise<Department[]> {
    return api.get<Department[]>('/staff/departments');
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<{ departmentId: number }> {
    return api.post<{ departmentId: number }>('/staff/departments', data);
  }

  async getSchedules(params?: GetSchedulesParams): Promise<EmployeeSchedule[]> {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', String(params.employeeId));
    if (params?.shiftDate) queryParams.append('shiftDate', params.shiftDate);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get<EmployeeSchedule[]>(`/staff/schedules?${queryParams}`);
  }

  async createSchedule(data: CreateScheduleRequest): Promise<{ scheduleId: number }> {
    return api.post<{ scheduleId: number }>('/staff/schedules', data);
  }

  async getAttendance(params?: GetAttendanceParams): Promise<Attendance[]> {
    const queryParams = new URLSearchParams();
    if (params?.employeeId) queryParams.append('employeeId', String(params.employeeId));
    if (params?.attendanceDate) queryParams.append('attendanceDate', params.attendanceDate);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.status) queryParams.append('status', params.status);
    
    return api.get<Attendance[]>(`/staff/attendance?${queryParams}`);
  }

  async staffCheckIn(employeeId: number): Promise<{ attendanceId: number }> {
    return api.post<{ attendanceId: number }>('/staff/attendance/checkin', { employeeId });
  }

  async staffCheckOut(employeeId: number): Promise<void> {
    return api.post<void>('/staff/attendance/checkout', { employeeId });
  }
}

export const staffService = new StaffService();
export default staffService;
