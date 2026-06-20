import { z } from "zod";
import { PaymentMethod } from "@prisma/client";

export const createOrderSchema = z.object({
  shippingName: z.string().min(1, "Name is required"),
  shippingEmail: z.string().email("Invalid email address"),
  shippingPhone: z.string().min(5, "Phone is required"),
  shippingAddress: z.string().min(1, "Address is required"),
  shippingCity: z.string().min(1, "City is required"),
  paymentMethod: z.nativeEnum(PaymentMethod),
  deliveryMethod: z.string().min(1, "Delivery method is required"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
