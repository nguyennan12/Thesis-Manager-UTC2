import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { safeStorage, safeSetCookie } from './storage';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// Request Interceptor: Attach bearer token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`[apiClient] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url}`);
    const token = safeStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle unauthenticated or token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = safeStorage.getItem('refresh_token');
        if (refreshToken) {
          const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken }, { withCredentials: true });
          const newAccessToken = data?.data?.accessToken || data?.accessToken;
          if (newAccessToken) {
            safeStorage.setItem('access_token', newAccessToken);
            safeSetCookie(`access_token=${newAccessToken}; path=/; max-age=86400; SameSite=Lax`);
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          }
        }
      } catch {
        // Refresh token failed or expired
      }

      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        safeStorage.removeItem('access_token');
        safeStorage.removeItem('refresh_token');
        safeSetCookie('access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax');
        safeSetCookie('refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
