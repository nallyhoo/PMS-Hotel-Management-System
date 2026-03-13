const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export { API_BASE_URL };

interface ApiClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T>;
  put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T>;
  patch<T>(url: string, data?: unknown, options?: RequestInit): Promise<T>;
  delete<T>(url: string, options?: RequestInit): Promise<T>;
}

class FetchClient implements ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (response.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    
    const text = await response.text();
    if (!text) {
      if (response.ok || response.status === 204) {
        return {} as T;
      }
      const errorData = { error: `Request failed with status ${response.status}`, message: 'An unexpected error occurred' };
      throw new Error(errorData.message);
    }
    try {
      const data = JSON.parse(text);
      if (!response.ok && response.status !== 204) {
        const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }
      return data;
    } catch (err) {
      if (response.ok || response.status === 204) {
        return {} as T;
      }
      throw new Error(`Request failed with status ${response.status}`);
    }
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async patch<T>(url: string, data?: unknown, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseURL}${url}`, {
      method: 'DELETE',
      ...options,
      headers: { ...this.getHeaders(), ...options?.headers },
    });
    return this.handleResponse<T>(response);
  }
}

const api = new FetchClient(API_BASE_URL);

export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const clearToken = (): void => {
  localStorage.removeItem('auth_token');
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export default api;
