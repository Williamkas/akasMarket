import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';
import { useAuthStore } from './useAuthStore';

interface FavoritesState {
  favorites: string[];
  hydrated: boolean;
  hydrateFavorites: () => void;
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
}

const getFavoritesKey = (userId: string | null) => (userId ? `favorites_${userId}` : 'favorites_guest');

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      hydrated: false,
      hydrateFavorites: () => {
        const userId = useAuthStore.getState().user?.id || null;
        const key = getFavoritesKey(userId);
        const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        set({ hydrated: true, favorites: saved ? JSON.parse(saved) : [] });
      },
      addFavorite: (productId) => {
        set((state) => {
          const newFavorites = state.favorites.includes(productId) ? state.favorites : [...state.favorites, productId];
          const userId = useAuthStore.getState().user?.id || null;
          const key = getFavoritesKey(userId);
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(newFavorites));
          }
          return { favorites: newFavorites };
        });
      },
      removeFavorite: (productId) => {
        set((state) => {
          const newFavorites = state.favorites.filter((id) => id !== productId);
          const userId = useAuthStore.getState().user?.id || null;
          const key = getFavoritesKey(userId);
          if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(newFavorites));
          }
          return { favorites: newFavorites };
        });
      },
      clearFavorites: () => {
        set({ favorites: [] });
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      }
    }),
    {
      name: 'favorites'
    }
  )
);

// Hook personalizado para manejar la hidratación
export const useFavoritesHydration = () => {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
  }, []);
};
