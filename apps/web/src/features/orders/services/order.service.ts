import api from "@/lib/axios";

export interface OrderItem {
  orderItemId: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    productId: string;
    name: string;
    price: number;
    images: string[];
  };
}

export interface Order {
  orderId: string;
  userId: string;
  paymentMethod: "PAYHERE" | "COD";
  paymentStatus: "PENDING" | "PAID" | "UNPAID" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "CANCELLATION_REQUESTED";
  totalAmount: number;
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  deliveryMethod: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderInput {
  shippingName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingCity: string;
  paymentMethod: "PAYHERE" | "COD";
  deliveryMethod: string;
}

export interface PayHereCheckoutParams {
  merchantId: string;
  hash: string;
  amount: string;
  currency: string;
  orderId: string;
  items: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const res = await api.post<ApiResponse<Order>>("/orders", input);
  return res.data.data;
}

export async function fetchOrders(): Promise<Order[]> {
  const res = await api.get<ApiResponse<Order[]>>("/orders");
  return res.data.data;
}

export async function fetchOrderDetails(orderId: string): Promise<Order> {
  const res = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
  return res.data.data;
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const res = await api.patch<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
  return res.data.data;
}

export async function getPaymentParams(
  orderId: string,
): Promise<PayHereCheckoutParams> {
  const res = await api.post<ApiResponse<PayHereCheckoutParams>>(
    "/payment/create",
    { orderId },
  );
  return res.data.data;
}

export async function deleteDraftOrder(orderId: string): Promise<boolean> {
  const res = await api.delete<ApiResponse<{ deleted: boolean }>>(
    `/orders/${orderId}/draft`,
  );
  return res.data.success;
}
