import { create } from 'zustand';
import type { Product } from '@/services/productsService';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  deleteFromCart: (productId: string) => void;
  getCartCount: () => number;
}

const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('cart');
    if (stored) return JSON.parse(stored);
  }
  return [];
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: getInitialCart(),
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(newItems));
        window.dispatchEvent(new CustomEvent('cart-toast', { detail: { name: product.title } }));
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
      if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  deleteFromCart: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product.id !== productId);
      if (typeof window !== 'undefined') localStorage.setItem('cart', JSON.stringify(newItems));
      return { items: newItems };
    });
  },
  getCartCount: () => {
    return get().items.reduce((acc, item) => acc + item.quantity, 0);
  }
}));
