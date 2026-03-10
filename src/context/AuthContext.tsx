import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { getToken, setToken, clearToken } from '../api/client';

interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getToken();
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setTokenState(storedToken);
          setUser(JSON.parse(storedUser));
        } catch {
          clearToken();
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post<{
        token: string;
        user: { id: number; username: string; firstName: string; lastName: string; role: string };
      }>('/auth/login', { username, password });

      const { token: newToken, user: userData } = response;

      setToken(newToken);
      setTokenState(newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData as AuthUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
    } finally {
      clearToken();
      setTokenState(null);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
