/**
 * Shape of a cart item returned by the API.
 * Includes a nested product snapshot for display purposes.
 */
export type CartItemWithProduct = {
  cartItemId: string;
  cartId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  product: {
    productId: string;
    name: string;
    price: number;
    images: string[];
    stock: number;
  };
};

/**
 * Full cart response — includes the resolved item list.
 */
export type CartWithItems = {
  cartId: string | null;
  userId: string;
  items: CartItemWithProduct[];
};
