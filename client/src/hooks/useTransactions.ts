import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { PaginatedRecords, FinancialRecord, RecordType } from '../types';

// ─── Filters ────────────────────────────────────────────────────────────────
export interface TransactionFilters {
  page: number;
  limit: number;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  type?: RecordType | '';
}

// ─── Get paginated records ──────────────────────────────────────────────────
export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set('page', filters.page.toString());
      params.set('limit', filters.limit.toString());
      if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
      if (filters.dateTo) params.set('dateTo', filters.dateTo);
      if (filters.category) params.set('category', filters.category);
      if (filters.type) params.set('type', filters.type);

      const { data } = await api.get<{ success: boolean; data: PaginatedRecords }>(
        `/records?${params.toString()}`
      );
      return data.data;
    },
    placeholderData: (prev) => prev, // keep previous data while fetching
  });
}

// ─── Get categories for filter dropdown ─────────────────────────────────────
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: string[] }>('/records/categories');
      return data.data;
    },
    staleTime: 60_000,
  });
}

// ─── Create record ──────────────────────────────────────────────────────────
export function useCreateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: { amount: number; type: RecordType; category: string; date: string; notes?: string }) => {
      const { data } = await api.post<{ success: boolean; data: FinancialRecord }>('/records', record);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
}

// ─── Update record ──────────────────────────────────────────────────────────
export function useUpdateRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...record }: { id: string; amount?: number; type?: RecordType; category?: string; date?: string; notes?: string }) => {
      const { data } = await api.put<{ success: boolean; data: FinancialRecord }>(`/records/${id}`, record);
      return data.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// ─── Delete record ──────────────────────────────────────────────────────────
export function useDeleteRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/records/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
