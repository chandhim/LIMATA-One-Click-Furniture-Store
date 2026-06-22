import api from "@/lib/axios";
import type { Wishlist } from "../types/wishlist.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchWishlist(): Promise<Wishlist> {
  const res = await api.get<ApiResponse<Wishlist>>("/wishlist");
  return res.data.data;
}

export async function addToWishlist(productId: string): Promise<Wishlist> {
  const res = await api.post<ApiResponse<Wishlist>>("/wishlist/items", {
    productId,
  });
  return res.data.data;
}

export async function removeWishlistItem(productId: string): Promise<void> {
  await api.delete(`/wishlist/items/${productId}`);
}
