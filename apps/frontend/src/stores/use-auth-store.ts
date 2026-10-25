import { create } from 'zustand';
import { UserProfile } from '@/types/auth';
import { safeStorage, safeSetCookie } from '@/lib/storage';

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
    safeStorage.setItem('access_token', token);
    // Also set document cookie for middleware check
    safeSetCookie(`access_token=${token}; path=/; max-age=86400; SameSite=Lax`);
    set({
      user,
      accessToken: token,
      isAuthenticated: true,
    });
  },

  clearAuth: () => {
    safeStorage.removeItem('access_token');
    safeStorage.removeItem('refresh_token');
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
    } catch {
      // Ignore sessionStorage block
    }
    safeSetCookie('access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax');
    safeSetCookie('refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; max-age=0; SameSite=Lax');
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
