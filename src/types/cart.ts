import { Product } from './product';

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface CartData {
  id: string;
  created_at: string;
  user_id: string;
  items: CartItem[];
}

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface CreateCartRequest {
  items: CartItemInput[];
}

export interface CreatedCartResponse {
  id: string;
  created_at: string;
  user_id: string;
}
