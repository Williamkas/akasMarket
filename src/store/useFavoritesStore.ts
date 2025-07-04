import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favorites: string[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) =>
        set((state) => (state.favorites.includes(productId) ? state : { favorites: [...state.favorites, productId] })),
      removeFavorite: (productId) => set((state) => ({ favorites: state.favorites.filter((id) => id !== productId) })),
      isFavorite: (productId) => get().favorites.includes(productId)
    }),
    {
      name: 'favorites-storage'
    }
  )
);
