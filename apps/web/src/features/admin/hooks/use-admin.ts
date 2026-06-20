import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminStats,
  getAdminUsers,
  updateAdminUserRole,
  toggleAdminUserStatus,
  getAdminReviews,
  toggleReviewApproval,
  deleteAdminReview,
  getAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
  getAdminSettings,
  updateAdminSetting,
  getPublicSetting,
  getPublicCategories,
  getAdminOrders,
  updateOrderStatus,
} from "../api/admin.api";

// 1. Stats
export function useAdminStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getAdminStats,
  });
}

// 2. Users
export function useAdminUsers(search?: string) {
  return useQuery({
    queryKey: ["admin-users", search],
    queryFn: () => getAdminUsers(search),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      updateAdminUserRole(userId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      toggleAdminUserStatus(userId, isActive),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// 3. Reviews
export function useAdminReviews() {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: getAdminReviews,
  });
}

export function useToggleReviewApproval() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, isApproved }: { reviewId: string; isApproved: boolean }) =>
      toggleReviewApproval(reviewId, isApproved),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => deleteAdminReview(reviewId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    },
  });
}

// 4. Categories
export function useAdminCategories() {
  return useQuery({
    queryKey: ["admin-categories"],
    queryFn: getAdminCategories,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; desc: string; image?: string; alt?: string }) =>
      createAdminCategory(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      void queryClient.invalidateQueries({ queryKey: ["public-categories"] });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryId: string) => deleteAdminCategory(categoryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      void queryClient.invalidateQueries({ queryKey: ["public-categories"] });
    },
  });
}

// 5. CMS / Settings
export function useAdminSettings() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: getAdminSettings,
  });
}

export function useUpdateSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: unknown }) =>
      updateAdminSetting(key, value),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      void queryClient.invalidateQueries({ queryKey: ["public-setting", variables.key] });
    },
  });
}

// 6. Public Helpers
export function usePublicSetting(key: string) {
  return useQuery({
    queryKey: ["public-setting", key],
    queryFn: () => getPublicSetting(key),
  });
}

export function usePublicCategories() {
  return useQuery({
    queryKey: ["public-categories"],
    queryFn: getPublicCategories,
  });
}

// 7. Orders
export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: getAdminOrders,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      void queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });
}
