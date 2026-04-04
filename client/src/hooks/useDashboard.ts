import { useQuery } from '@tanstack/react-query';
import api from '../lib/axios';
import type { DashboardMetrics } from '../types';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DashboardMetrics }>('/dashboard');
      return data.data;
    },
    staleTime: 30_000, // 30s cache
  });
}
