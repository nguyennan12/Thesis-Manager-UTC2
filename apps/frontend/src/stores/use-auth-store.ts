import { create } from 'zustand';
import { UserProfile } from '@/types/auth';

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  clearAuth: () => void;
  hasRole: (role: string) => boolean;
  hasPosition: (position: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
      // Also set document cookie for middleware check
      document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    }
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      sessionStorage.clear();
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax';
    }
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
    });
  },

  hasRole: (role: string) => {
    const roles = get().user?.roles || [];
    return roles.includes(role) || roles.includes('ADMIN');
  },

  hasPosition: (position: string) => {
    const positions = get().user?.positions || [];
    return positions.includes(position);
  },
}));
