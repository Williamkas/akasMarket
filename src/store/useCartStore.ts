import { create } from 'zustand';
import type { Product } from '@/services/productsService';
import { useAuthStore } from './useAuthStore';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  hydrated: boolean;
  setHydrated: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  deleteFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const getCartKey = (userId: string | null) => (userId ? `cart_${userId}` : 'cart_guest');

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  hydrated: false,
  setHydrated: () => {
    const userId = useAuthStore.getState().user?.id || null;
    const key = getCartKey(userId);
    const saved = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    set({ hydrated: true, items: saved ? JSON.parse(saved) : [] });
  },
  addToCart: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      let newItems;
      if (existing) {
        newItems = state.items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        newItems = [...state.items, { product, quantity: 1 }];
      }
      const userId = useAuthStore.getState().user?.id || null;
      const key = getCartKey(userId);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(newItems));
      }
      return { items: newItems };
    });
  },
  removeFromCart: (productId) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === productId);
      if (!existing) return state;
      let newItems;
      if (existing.quantity > 1) {
        newItems = state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        newItems = state.items.filter((item) => item.product.id !== productId);
      }
      const userId = useAuthStore.getState().user?.id || null;
      const key = getCartKey(userId);
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  deleteFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      const userId = useAuthStore.getState().user?.id || null;
      const key = getCartKey(userId);
      if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  clearCart: () => {
    set({ items: [] });
  },
  getCartCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  }
}));
