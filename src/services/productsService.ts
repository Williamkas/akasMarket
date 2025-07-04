import api from './apiServices';

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
  created_at?: string;
  // Agrega más campos si es necesario
}

interface GetAllProductsResponse {
  data: Product[];
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export const getAllProducts = async (filters: ProductFilters = {}): Promise<GetAllProductsResponse> => {
  const params = new URLSearchParams({
    page: String(filters.page ?? 1),
    limit: String(filters.limit ?? 10),
    search: filters.search ?? '',
    sortBy: filters.sortBy ?? 'title',
    order: filters.order ?? 'asc',
    ...(filters.minPrice !== undefined ? { minPrice: String(filters.minPrice) } : {}),
    ...(filters.maxPrice !== undefined ? { maxPrice: String(filters.maxPrice) } : {}),
    ...(filters.categories && filters.categories.length > 0 ? { categories: filters.categories.join(',') } : {})
  });

  const response = await api.get(`/api/products?${params.toString()}`);
  return response.data.data;
};
