/** Product snapshot embedded in each cart item. */
export interface CartProduct {
  productId: string;
  name: string;
  price: number;
  images: string[];
  stock: number;
}

/** A single line item in the cart. */
export interface CartItem {
  cartItemId: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: string;
  product: CartProduct;
}

/** Full cart response from GET /api/cart */
export interface Cart {
  cartId: string | null;
  userId: string;
  items: CartItem[];
}
