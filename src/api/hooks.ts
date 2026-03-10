import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { getToken, setToken, clearToken } from './client';
import reservationService, { GetReservationsParams } from './reservations';
import roomService, { GetRoomsParams } from './rooms';
import guestService, { GetGuestsParams } from './guests';
import staffService, { GetEmployeesParams } from './staff';
import type { Reservation, Room, Guest, Employee } from '../types/database';
import { useState, useEffect } from 'react';

export function useReservations(params?: GetReservationsParams) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => reservationService.getReservations(params),
  });
}

export function useReservation(id: number | string) {
  return useQuery({
    queryKey: ['reservation', id],
    queryFn: () => reservationService.getReservation(Number(id)),
    enabled: !!id,
  });
}

export function useRooms(params?: GetRoomsParams) {
  return useQuery({
    queryKey: ['rooms', params],
    queryFn: () => roomService.getRooms(params),
  });
}

export function useRoom(id: number | string) {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoom(Number(id)),
    enabled: !!id,
  });
}

export function useGuests(params?: GetGuestsParams) {
  return useQuery({
    queryKey: ['guests', params],
    queryFn: () => guestService.getGuests(params),
  });
}

export function useGuest(id: number | string) {
  return useQuery({
    queryKey: ['guest', id],
    queryFn: () => guestService.getGuest(Number(id)),
    enabled: !!id,
  });
}

export function useEmployees(params?: GetEmployeesParams) {
  return useQuery({
    queryKey: ['employees', params],
    queryFn: () => staffService.getEmployees(params),
  });
}

export function useEmployee(id: number | string) {
  return useQuery({
    queryKey: ['employee', id],
    queryFn: () => staffService.getEmployee(Number(id)),
    enabled: !!id,
  });
}

export function useAuth() {
  const [user, setUser] = useState<unknown>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
    }
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      clearToken();
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return { user, isAuthenticated, isLoading, login, logout };
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof reservationService.createReservation>[0]) =>
      reservationService.createReservation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useUpdateReservation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof reservationService.updateReservation>[1] }) =>
      reservationService.updateReservation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservation', id] });
    },
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof roomService.createRoom>[0]) =>
      roomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof roomService.updateRoom>[1] }) =>
      roomService.updateRoom(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', id] });
    },
  });
}

export function useCreateGuest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof guestService.createGuest>[0]) =>
      guestService.createGuest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
    },
  });
}

export function useUpdateGuest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof guestService.updateGuest>[1] }) =>
      guestService.updateGuest(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      queryClient.invalidateQueries({ queryKey: ['guest', id] });
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Parameters<typeof staffService.createEmployee>[0]) =>
      staffService.createEmployee(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof staffService.updateEmployee>[1] }) =>
      staffService.updateEmployee(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
    },
  });
}
