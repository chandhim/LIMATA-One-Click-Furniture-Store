import api from "@/lib/axios";

// 1. Dashboard Stats
export async function getAdminStats() {
  const res = await api.get("/admin/stats");
  return res.data.data;
}

// 2. User Management
export async function getAdminUsers(search?: string) {
  const res = await api.get("/admin/users", { params: { search } });
  return res.data.data;
}

export async function updateAdminUserRole(userId: string, role: string) {
  const res = await api.patch(`/admin/users/${userId}/role`, { role });
  return res.data.data;
}

export async function toggleAdminUserStatus(userId: string, isActive: boolean) {
  const res = await api.patch(`/admin/users/${userId}/status`, { isActive });
  return res.data.data;
}

// 3. Review Management
export async function getAdminReviews() {
  const res = await api.get("/admin/reviews");
  return res.data.data;
}

export async function toggleReviewApproval(
  reviewId: string,
  isApproved: boolean,
) {
  const res = await api.patch(`/admin/reviews/${reviewId}/approve`, {
    isApproved,
  });
  return res.data.data;
}

export async function deleteAdminReview(reviewId: string) {
  const res = await api.delete(`/admin/reviews/${reviewId}`);
  return res.data.data;
}

// 4. Categories CRUD
export async function getAdminCategories() {
  const res = await api.get("/admin/categories");
  return res.data.data;
}

export async function createAdminCategory(data: {
  name: string;
  desc: string;
  image?: string;
  alt?: string;
}) {
  const res = await api.post("/admin/categories", data);
  return res.data.data;
}

export async function deleteAdminCategory(categoryId: string) {
  const res = await api.delete(`/admin/categories/${categoryId}`);
  return res.data.data;
}

// 5. CMS Settings
export async function getAdminSettings() {
  const res = await api.get("/admin/settings");
  return res.data.data;
}

export async function updateAdminSetting(key: string, value: unknown) {
  const res = await api.put("/admin/settings", { key, value });
  return res.data.data;
}

// 6. Public Endpoint Helpers (no auth needed)
export async function getPublicSetting(key: string) {
  const res = await api.get(`/public/settings/${key}`);
  return res.data.data;
}

export async function getPublicCategories() {
  const res = await api.get("/public/categories");
  return res.data.data;
}

// 7. Orders Integration (Helper)
export async function updateOrderStatus(orderId: string, orderStatus: string) {
  const res = await api.patch(`/orders/${orderId}/status`, { orderStatus });
  return res.data.data;
}

export async function getAdminOrders() {
  const res = await api.get("/orders");
  return res.data.data;
}
