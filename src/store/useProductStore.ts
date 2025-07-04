import { create } from 'zustand';
import { getAllProducts, type ProductFilters } from '../services/productsService';
import type { Product } from '../types/product';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  pagination: Pagination;
  hasSearched: boolean;
  hydrated: boolean;
  setHydrated: () => void;
  setFilters: (filters: Partial<ProductFilters>) => void;
  setFiltersAndSearch: (filters: Partial<ProductFilters>) => void;
  clearFilters: () => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  hasSearched: false,
  hydrated: false,
  setHydrated: () => set({ hydrated: true }),
  filters: {
    page: 1,
    limit: 12,
    search: '',
    sortBy: 'title',
    order: 'asc'
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  },
  setFilters: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 }
    }));
  },
  setFiltersAndSearch: (filters) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
      hasSearched: true
    }));
  },
  clearFilters: () => {
    set((state) => ({
      filters: {
        ...state.filters,
        categories: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        sortBy: 'title',
        order: 'asc',
        page: 1
      },
      hasSearched: true
    }));
  },
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const { filters } = get();
      const response = await getAllProducts(filters);
      set({
        products: Array.isArray(response.data) ? response.data : [],
        pagination: {
          currentPage: response.page,
          totalPages: response.totalPages,
          totalCount: response.count
        },
        error: null
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error fetching products';
      set({ products: [], error: message });
    } finally {
      set({ loading: false });
    }
  }
}));
