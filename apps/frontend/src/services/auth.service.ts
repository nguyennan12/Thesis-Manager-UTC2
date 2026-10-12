import { apiClient } from '@/lib/api-client';
import { LoginCredentials, LoginResponse, UserProfile } from '@/types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const res = await apiClient.post<{ data: LoginResponse }>('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    });
    // Support uniform response { data: { ... } } or direct response { accessToken, ... }
    return res.data?.data || (res.data as unknown as LoginResponse);
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await apiClient.get<{ data: UserProfile }>('/auth/me');
    return res.data?.data || (res.data as unknown as UserProfile);
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
