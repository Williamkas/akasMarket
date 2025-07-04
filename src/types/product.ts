export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  created_at: string;
  categories: string[];
  main_image_url: string;
  status: 'new' | 'old';
  delivery_type: 'Envío a domicilio' | 'Retiro en sucursal';
}

export interface ProductQueryParams {
  page: number;
  limit: number;
  search?: string;
  sortBy: 'title' | 'price' | 'created_at';
  order: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  categories?: string[];
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
