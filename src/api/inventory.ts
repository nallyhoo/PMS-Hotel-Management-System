import api from './client';
import type { InventoryItem, InventoryCategory, Supplier, InventoryTransaction } from '../types/database';

export interface GetInventoryItemsParams {
  categoryId?: number;
  isActive?: boolean;
}

export interface CreateInventoryItemRequest {
  itemName: string;
  sku?: string;
  categoryId?: number;
  description?: string;
  unitOfMeasure?: string;
  currentStock?: number;
  minimumStock?: number;
  maximumStock?: number;
  unitCost?: number;
  unitPrice?: number;
  location?: string;
}

export interface StockAdjustmentRequest {
  itemId: number;
  transactionType: string;
  quantity: number;
  notes?: string;
}

export interface GetTransactionsParams {
  itemId?: number;
  transactionType?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateInventoryCategoryRequest {
  categoryName: string;
  description?: string;
}

export interface CreateSupplierRequest {
  supplierName: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  notes?: string;
}

class InventoryService {
  async getItems(params?: GetInventoryItemsParams): Promise<InventoryItem[]> {
    const queryParams = new URLSearchParams();
    if (params?.categoryId) queryParams.append('categoryId', String(params.categoryId));
    if (params?.isActive !== undefined) queryParams.append('isActive', String(params.isActive));
    
    return api.get<InventoryItem[]>(`/inventory/items?${queryParams}`);
  }

  async getItem(id: number): Promise<InventoryItem> {
    return api.get<InventoryItem>(`/inventory/items/${id}`);
  }

  async createItem(data: CreateInventoryItemRequest): Promise<{ itemId: number }> {
    return api.post<{ itemId: number }>('/inventory/items', data);
  }

  async updateItem(id: number, data: Partial<CreateInventoryItemRequest>): Promise<void> {
    return api.put<void>(`/inventory/items/${id}`, data);
  }

  async deleteItem(id: number): Promise<void> {
    return api.delete<void>(`/inventory/items/${id}`);
  }

  async adjustStock(data: StockAdjustmentRequest): Promise<{ message: string; newStock: number }> {
    return api.post<{ message: string; newStock: number }>('/inventory/adjustment', data);
  }

  async getTransactions(params?: GetTransactionsParams): Promise<InventoryTransaction[]> {
    const queryParams = new URLSearchParams();
    if (params?.itemId) queryParams.append('itemId', String(params.itemId));
    if (params?.transactionType) queryParams.append('transactionType', params.transactionType);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    return api.get<InventoryTransaction[]>(`/inventory/transactions?${queryParams}`);
  }

  async getAlerts(): Promise<InventoryItem[]> {
    return api.get<InventoryItem[]>('/inventory/alerts');
  }

  async getCategories(): Promise<InventoryCategory[]> {
    return api.get<InventoryCategory[]>('/inventory/categories');
  }

  async createCategory(data: CreateInventoryCategoryRequest): Promise<{ categoryId: number }> {
    return api.post<{ categoryId: number }>('/inventory/categories', data);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return api.get<Supplier[]>('/inventory/suppliers');
  }

  async createSupplier(data: CreateSupplierRequest): Promise<{ supplierId: number }> {
    return api.post<{ supplierId: number }>('/inventory/suppliers', data);
  }

  async getPurchaseOrders(): Promise<unknown[]> {
    return api.get<unknown[]>('/inventory/purchase-orders');
  }
}

export const inventoryService = new InventoryService();
export default inventoryService;
