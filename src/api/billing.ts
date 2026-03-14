import api from './client';
import type { Invoice, InvoiceItem, Payment, PaymentMethod, Refund } from '../types/database';

export interface GetInvoicesParams {
  status?: string;
  reservationId?: number;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateInvoiceRequest {
  reservationId?: number;
  invoiceDate: string;
  dueDate?: string;
  subTotal: number;
  taxAmount?: number;
  discountAmount?: number;
  totalAmount: number;
  notes?: string;
  items?: CreateInvoiceItemRequest[];
}

export interface CreateInvoiceItemRequest {
  itemType: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  taxRate?: number;
}

export interface CreatePaymentRequest {
  invoiceId?: number;
  reservationId?: number;
  paymentMethod: string;
  amount: number;
  currency?: string;
  referenceNumber?: string;
  transactionId?: string;
  notes?: string;
}

export interface CreateRefundRequest {
  refundAmount: number;
  reason: string;
}

export interface CreatePaymentMethodRequest {
  methodName: string;
  methodType?: string;
}

class BillingService {
  async getInvoices(params?: GetInvoicesParams): Promise<PaginatedResponse<Invoice>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.reservationId) queryParams.append('reservationId', String(params.reservationId));
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get<PaginatedResponse<Invoice>>(`/invoices?${queryParams}`);
  }

  async getInvoice(id: number): Promise<Invoice> {
    return api.get<Invoice>(`/invoices/${id}`);
  }

  async createInvoice(data: CreateInvoiceRequest): Promise<{ invoiceId: number; invoiceNumber: string }> {
    return api.post<{ invoiceId: number; invoiceNumber: string }>('/invoices', data);
  }

  async updateInvoice(id: number, data: Partial<CreateInvoiceRequest>): Promise<void> {
    return api.put<void>(`/invoices/${id}`, data);
  }

  async deleteInvoice(id: number): Promise<void> {
    return api.delete<void>(`/invoices/${id}`);
  }

  async addInvoiceItem(invoiceId: number, data: CreateInvoiceItemRequest): Promise<{ itemId: number }> {
    return api.post<{ itemId: number }>(`/invoices/${invoiceId}/items`, data);
  }

  async getInvoiceForPrint(id: number): Promise<Invoice & { items: InvoiceItem[] }> {
    return api.get<Invoice & { items: InvoiceItem[] }>(`/invoices/${id}/print`);
  }

  async getPayments(params?: GetPaymentsParams): Promise<PaginatedResponse<Payment>> {
    const queryParams = new URLSearchParams();
    if (params?.invoiceId) queryParams.append('invoiceId', String(params.invoiceId));
    if (params?.reservationId) queryParams.append('reservationId', String(params.reservationId));
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get<PaginatedResponse<Payment>>(`/payments?${queryParams}`);
  }

  async getPayment(id: number): Promise<Payment> {
    return api.get<Payment>(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentRequest): Promise<{ paymentId: number }> {
    return api.post<{ paymentId: number }>('/payments', data);
  }

  async processRefund(paymentId: number, data: CreateRefundRequest): Promise<void> {
    return api.post<void>(`/payments/${paymentId}/refund`, data);
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return api.get<PaymentMethod[]>('/payments/methods/list');
  }

  async createPaymentMethod(data: CreatePaymentMethodRequest): Promise<{ methodId: number }> {
    return api.post<{ methodId: number }>('/payments/methods', data);
  }

  async getPaymentHistory(startDate?: string, endDate?: string): Promise<Payment[]> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    return api.get<Payment[]>(`/payments/history?${queryParams}`);
  }

  async getRefunds(params?: { status?: string; page?: number; limit?: number }): Promise<PaginatedResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    return api.get<PaginatedResponse<any>>(`/payments/refunds?${queryParams}`);
  }

  async getRefund(id: number): Promise<any> {
    return api.get<any>(`/payments/refunds/${id}`);
  }

  async approveRefund(id: number, data: { approvedBy?: number; notes?: string }): Promise<void> {
    return api.put<void>(`/payments/refunds/${id}/approve`, data);
  }

  async rejectRefund(id: number, data: { rejectedBy?: number; reason: string }): Promise<void> {
    return api.put<void>(`/payments/refunds/${id}/reject`, data);
  }

  async processRefundPayment(id: number, data: { processedBy?: number; refundMethod?: string; notes?: string }): Promise<void> {
    return api.put<void>(`/payments/refunds/${id}/process`, data);
  }

  async getPaymentGateways(): Promise<any[]> {
    return api.get<any[]>('/payment-gateway/gateways');
  }

  async createPaymentGateway(data: any): Promise<{ gatewayId: number }> {
    return api.post<{ gatewayId: number }>('/payment-gateway/gateways', data);
  }

  async updatePaymentGateway(id: number, data: any): Promise<void> {
    return api.put<void>(`/payment-gateway/gateways/${id}`, data);
  }

  async processCardPayment(data: { invoiceId?: number; amount: number; currency?: string; cardNumber: string; cardExpiry: string; cardCvv: string; gatewayId?: number }): Promise<any> {
    return api.post<any>('/payment-gateway/process-card', data);
  }

  async processPayPalPayment(data: { invoiceId?: number; amount: number; currency?: string; paypalEmail: string }): Promise<any> {
    return api.post<any>('/payment-gateway/process-paypal', data);
  }

  async processBankTransfer(data: { invoiceId?: number; amount: number; currency?: string; bankName: string; referenceNumber?: string }): Promise<any> {
    return api.post<any>('/payment-gateway/process-bank-transfer', data);
  }

  async compareWithReservations(): Promise<any> {
    return api.get<any>('/invoices/compare/reservations');
  }
}

export interface GetPaymentsParams {
  invoiceId?: number;
  reservationId?: number;
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const billingService = new BillingService();
export default billingService;
