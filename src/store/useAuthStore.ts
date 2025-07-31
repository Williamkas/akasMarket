import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { useFavoritesStore } from './useFavoritesStore';

interface User {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  redirectUrl: string | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  setHydrated: () => void;
  setRedirectUrl: (url: string | null) => void;
  clearRedirectUrl: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,
      redirectUrl: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
          useCartStore.getState().clearCart();
          useFavoritesStore.getState().clearFavorites();
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // ignore
        }
        set({ user: null, isAuthenticated: false });
      },
      setHydrated: () => set({ hydrated: true }),
      setRedirectUrl: (url) => set({ redirectUrl: url }),
      clearRedirectUrl: () => set({ redirectUrl: null })
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
);

// Hook para verificar si el usuario está autenticado
export const useAuth = () => {
  const { user, isAuthenticated, hydrated, redirectUrl } = useAuthStore();
  return { user, isAuthenticated, hydrated, redirectUrl };
};
