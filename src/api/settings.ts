import api from './client';
import type { TaxRate, Currency, Language, PaymentGateway, Hotel } from '../types/database';

export interface CreateTaxRateRequest {
  taxName: string;
  taxCode?: string;
  rate: number;
  taxType?: string;
  country?: string;
  isDefault?: boolean;
}

export interface CreateCurrencyRequest {
  currencyCode: string;
  currencyName: string;
  symbol?: string;
  exchangeRate?: number;
  isDefault?: boolean;
}

export interface CreateLanguageRequest {
  languageCode: string;
  languageName: string;
  nativeName?: string;
  isDefault?: boolean;
  sortOrder?: number;
}

export interface CreatePaymentGatewayRequest {
  gatewayName: string;
  gatewayType?: string;
  configJson?: string;
  isActive?: boolean;
  isTestMode?: boolean;
}

export interface UpdateHotelRequest {
  hotelName?: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  timezone?: string;
}

class SettingsService {
  async getTaxRates(): Promise<TaxRate[]> {
    return api.get<TaxRate[]>('/settings/tax-rates');
  }

  async createTaxRate(data: CreateTaxRateRequest): Promise<{ taxRateId: number }> {
    return api.post<{ taxRateId: number }>('/settings/tax-rates', data);
  }

  async getCurrencies(): Promise<Currency[]> {
    return api.get<Currency[]>('/settings/currencies');
  }

  async createCurrency(data: CreateCurrencyRequest): Promise<{ currencyId: number }> {
    return api.post<{ currencyId: number }>('/settings/currencies', data);
  }

  async getLanguages(): Promise<Language[]> {
    return api.get<Language[]>('/settings/languages');
  }

  async createLanguage(data: CreateLanguageRequest): Promise<{ languageId: number }> {
    return api.post<{ languageId: number }>('/settings/languages', data);
  }

  async getPaymentGateways(): Promise<PaymentGateway[]> {
    return api.get<PaymentGateway[]>('/settings/payment-gateways');
  }

  async createPaymentGateway(data: CreatePaymentGatewayRequest): Promise<{ gatewayId: number }> {
    return api.post<{ gatewayId: number }>('/settings/payment-gateways', data);
  }

  async getHotelInfo(): Promise<Hotel> {
    return api.get<Hotel>('/settings/hotel');
  }

  async updateHotelInfo(data: UpdateHotelRequest): Promise<void> {
    return api.put<void>('/settings/hotel', data);
  }
}

export const settingsService = new SettingsService();
export default settingsService;
