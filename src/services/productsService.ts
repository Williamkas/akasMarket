import api from './apiServices';
import { isServer } from '../utils/isServer';

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categories: string[];
  main_image_url: string;
  stock: number;
  imageUrl: string;
  created_at: string;
  status: 'new' | 'old';
  delivery_type: 'Envío a domicilio' | 'Retiro en sucursal';
}

interface GetAllProductsResponse {
  data: Product[];
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export const getAllProducts = async (filters: ProductFilters = {}): Promise<GetAllProductsResponse> => {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.order) params.set('order', filters.order);
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters.categories && filters.categories.length > 0) params.set('categories', filters.categories.join(','));

  if (isServer()) {
    // Usar fetch con URL absoluta en server-side
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
    const res = await fetch(`${baseUrl}/api/products?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data.data;
  } else {
    // Usar axios en client-side
    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data.data;
  }
};
