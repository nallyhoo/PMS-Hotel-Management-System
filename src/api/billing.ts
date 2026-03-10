import api from './client';
import type { Invoice, InvoiceItem, Payment, PaymentMethod, Refund } from '../types/database';

export interface GetInvoicesParams {
  status?: string;
  reservationId?: number;
  page?: number;
  limit?: number;
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
}

export interface GetPaymentsParams {
  invoiceId?: number;
  reservationId?: number;
  status?: string;
  page?: number;
  limit?: number;
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
