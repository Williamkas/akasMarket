export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  created_at: string;
}

export interface ProductQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'name' | 'price';
  order: 'asc' | 'desc';
}

export interface ProductListResponse {
  data: Product[];
  page: number;
  limit: number;
  count: number;
  totalPages: number;
}

export interface ProductCreateResponse {
  message: string;
  data: Product[];
}

export interface ProductResponse {
  data: Product;
}

export interface ProductUpdateResponse {
  message: string;
  data: Product[];
}

export type ProductCreateRequest = Omit<Product, 'id' | 'created_at'>;
