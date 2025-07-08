import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  setUser: (user: User | null) => void;
  logout: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hydrated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHydrated: () => set({ hydrated: true })
    }),
    {
      name: 'auth-storage',
      skipHydration: true
    }
  )
);

// Hook para verificar si el usuario está autenticado
export const useAuth = () => {
  const { user, isAuthenticated, hydrated } = useAuthStore();
  return { user, isAuthenticated, hydrated };
};
