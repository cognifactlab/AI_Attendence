import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock authentication
        if (email === 'admin@company.com' && password === 'admin123') {
          const user = {
            id: 'USR-001',
            email,
            name: 'Admin User',
            role: 'admin' as const,
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
          };
          set({
            user,
            token: 'mock-jwt-token-' + Date.now(),
            isAuthenticated: true,
          });
          return true;
        }
        return false;
      },

      register: async (name: string, email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const user = {
          id: 'USR-' + Date.now(),
          email,
          name,
          role: 'employee' as const,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
        };
        
        set({
          user,
          token: 'mock-jwt-token-' + Date.now(),
          isAuthenticated: true,
        });
        return true;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
