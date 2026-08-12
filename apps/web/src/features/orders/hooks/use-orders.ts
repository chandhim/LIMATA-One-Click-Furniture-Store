"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrder,
  fetchOrders,
  fetchOrderDetails,
  cancelOrder,
  type CreateOrderInput,
  type Order,
} from "../services/order.service";

export const ORDERS_QUERY_KEY = ["orders"] as const;

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderInput>({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate cart and orders lists to sync state
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });
}

export function useOrderHistory() {
  return useQuery<Order[], Error>({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: fetchOrders,
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery<Order, Error>({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderDetails(orderId),
    enabled: !!orderId,
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, string>({
    mutationFn: cancelOrder,
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["order", updatedOrder.orderId],
      });
    },
  });
}
