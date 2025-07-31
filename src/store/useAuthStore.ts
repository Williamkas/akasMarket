import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';
import { useFavoritesStore } from './useFavoritesStore';

interface User {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
  user_metadata?: {
    name?: string;
    lastname?: string;
    email?: string;
  };
}

interface UserData {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
  user_metadata?: {
    name?: string;
    lastname?: string;
    email?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hydrated: boolean;
  redirectUrl: string | null;
  setUser: (user: UserData | null) => void;
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
      setUser: (userData) => {
        if (!userData) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        // Extraer datos de user_metadata si existen
        const userMetadata = userData.user_metadata || {};
        const processedUser: User = {
          id: userData.id,
          email: userData.email,
          name: userMetadata.name || userData.name,
          lastname: userMetadata.lastname || userData.lastname,
          user_metadata: userMetadata
        };

        set({ user: processedUser, isAuthenticated: true });
      },
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
