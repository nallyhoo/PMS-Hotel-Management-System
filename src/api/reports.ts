import api from './client';

export interface ReportParams {
  startDate: string;
  endDate: string;
  branchId?: number;
}

export interface BookingReportParams extends ReportParams {
  bookingSource?: string;
}

export interface PaymentReportParams extends ReportParams {
  paymentMethod?: string;
}

export interface StaffReportParams {
  startDate?: string;
  endDate?: string;
  departmentId?: number;
}

export interface RevenueReportData {
  date: string;
  totalRevenue: number;
  transactionCount: number;
}

export interface OccupancyReportData {
  date: string;
  reservations: number;
  checkIns: number;
  checkOuts: number;
  occupancyRate: number;
}

export interface BookingReportData {
  date: string;
  totalBookings: number;
  confirmed: number;
  cancelled: number;
  totalRevenue: number;
  bookingSource: string;
}

export interface PaymentReportData {
  date: string;
  paymentMethod: string;
  totalAmount: number;
  count: number;
}

export interface GuestReportData {
  nationality: string;
  totalGuests: number;
  vipGuests: number;
}

export interface StaffReportData {
  employeeId: number;
  firstName: string;
  lastName: string;
  position: string;
  departmentName: string;
  workingDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
}

export interface RoomAvailabilityData {
  typeName: string;
  totalRooms: number;
  available: number;
  occupied: number;
  dirty: number;
  maintenance: number;
}

class ReportService {
  async getRevenueReport(params: ReportParams): Promise<RevenueReportData[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    if (params.branchId) queryParams.append('branchId', String(params.branchId));
    
    return api.get<RevenueReportData[]>(`/reports/revenue?${queryParams}`);
  }

  async getOccupancyReport(params: ReportParams): Promise<OccupancyReportData[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    if (params.branchId) queryParams.append('branchId', String(params.branchId));
    
    return api.get<OccupancyReportData[]>(`/reports/occupancy?${queryParams}`);
  }

  async getBookingReport(params: BookingReportParams): Promise<BookingReportData[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    if (params.bookingSource) queryParams.append('bookingSource', params.bookingSource);
    
    return api.get<BookingReportData[]>(`/reports/bookings?${queryParams}`);
  }

  async getPaymentReport(params: PaymentReportParams): Promise<PaymentReportData[]> {
    const queryParams = new URLSearchParams({
      startDate: params.startDate,
      endDate: params.endDate,
    });
    if (params.paymentMethod) queryParams.append('paymentMethod', params.paymentMethod);
    
    return api.get<PaymentReportData[]>(`/reports/payments?${queryParams}`);
  }

  async getGuestStatistics(nationality?: string): Promise<GuestReportData[]> {
    const queryParams = new URLSearchParams();
    if (nationality) queryParams.append('nationality', nationality);
    
    return api.get<GuestReportData[]>(`/reports/guests?${queryParams}`);
  }

  async getStaffReport(params: StaffReportParams): Promise<StaffReportData[]> {
    const queryParams = new URLSearchParams();
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.departmentId) queryParams.append('departmentId', String(params.departmentId));
    
    return api.get<StaffReportData[]>(`/reports/staff?${queryParams}`);
  }

  async getRoomAvailability(): Promise<RoomAvailabilityData[]> {
    return api.get<RoomAvailabilityData[]>('/reports/room-availability');
  }
}

export const reportService = new ReportService();
export default reportService;
