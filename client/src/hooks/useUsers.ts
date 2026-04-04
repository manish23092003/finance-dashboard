import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { User, Role } from '../types';

// ─── Get all users (admin) ──────────────────────────────────────────────────
export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: User[] }>('/admin/users');
      return data.data;
    },
  });
}

// ─── Change user role ───────────────────────────────────────────────────────
export function useChangeRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: Role }) => {
      const { data } = await api.patch<{ success: boolean; data: User }>(
        `/admin/users/${userId}/role`,
        { role }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ─── Toggle user status ─────────────────────────────────────────────────────
export function useToggleStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { data } = await api.patch<{ success: boolean; data: User }>(
        `/admin/users/${userId}/status`,
        { isActive }
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}

// ─── Create user (admin) ────────────────────────────────────────────────────
export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string; role: Role }) => {
      const { data } = await api.post<{ success: boolean; data: User }>(
        '/admin/users',
        userData
      );
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
}
