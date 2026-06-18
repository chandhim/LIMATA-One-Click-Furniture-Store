import api from "@/lib/axios";
import type { Cart, CartItem } from "../types/cart.types";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function fetchCart(): Promise<Cart> {
  const res = await api.get<ApiResponse<Cart>>("/cart");
  return res.data.data;
}

export async function addToCart(productId: string, quantity: number): Promise<Cart> {
  const res = await api.post<ApiResponse<Cart>>("/cart/items", { productId, quantity });
  return res.data.data;
}

export async function updateCartItem(cartItemId: string, quantity: number): Promise<CartItem> {
  const res = await api.patch<ApiResponse<CartItem>>(`/cart/items/${cartItemId}`, { quantity });
  return res.data.data;
}

export async function removeCartItem(cartItemId: string): Promise<void> {
  await api.delete(`/cart/items/${cartItemId}`);
}

export async function clearCart(): Promise<void> {
  await api.delete("/cart");
}
