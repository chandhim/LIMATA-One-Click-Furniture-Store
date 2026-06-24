import type { Product } from "@/features/products/types/product.types";

export interface WishlistItem {
  wishlistItemId: string;
  wishlistId: string;
  productId: string;
  createdAt: string;
  product: Product;
}

export interface Wishlist {
  wishlistId: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}
