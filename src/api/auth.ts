import api, { setToken, clearToken, getToken } from './client';
import type { User } from '../types/database';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    setToken(response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      clearToken();
      localStorage.removeItem('user');
    }
  }

  async refreshToken(currentToken: string): Promise<string> {
    const response = await api.post<{ token: string }>('/auth/refresh-token', { token: currentToken });
    setToken(response.token);
    return response.token;
  }

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile');
    return response;
  }

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!getToken();
  }
}

export const authService = new AuthService();
export default authService;
