import { useMutation } from '@tanstack/react-query';
import api from '../lib/axios';
import { useAuthStore } from '../context/authStore';
import type { LoginInput } from '../validators/forms';
import type { User } from '../types';

export function useLogin() {
  const login = useAuthStore((s) => s.login);

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await api.post<{ success: boolean; data: { user: User; token: string } }>(
        '/auth/login',
        credentials
      );
      return data.data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
    },
  });
}
