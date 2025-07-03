import { create } from 'zustand';
import { getAllProducts, type ProductFilters } from '../services/productsService';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: string[];
  main_image_url: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

interface ProductStore {
  products: Product[];
  loading: boolean;
  filters: ProductFilters;
  pagination: Pagination;
  setFilters: (filters: Partial<ProductFilters>) => void;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  loading: false,
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
  fetchProducts: async () => {
    set({ loading: true });
    try {
      const { filters } = get();
      const response = await getAllProducts(filters);
      set({
        products: Array.isArray(response.data) ? response.data : [],
        pagination: {
          currentPage: response.page,
          totalPages: response.totalPages,
          totalCount: response.count
        }
      });
    } catch (error) {
      set({ products: [] });
      // Puedes agregar manejo de error global aquí
    } finally {
      set({ loading: false });
    }
  }
}));
