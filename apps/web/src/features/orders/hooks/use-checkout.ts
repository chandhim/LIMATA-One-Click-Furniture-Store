"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useCreateOrder, ORDERS_QUERY_KEY } from "./use-orders";
import { getPaymentParams } from "../services/order.service";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/use-cart-store";

// Add PayHere script to the document body dynamically
function loadPayHereScript() {
  if (typeof window === "undefined") return;
  if (document.getElementById("payhere-sdk")) return;

  const script = document.createElement("script");
  script.id = "payhere-sdk";
  script.src = "https://www.payhere.lk/lib/payhere.js";
  script.async = true;
  document.body.appendChild(script);
}

export function useCheckout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const resetCartCount = useCartStore((s) => s.reset);
  const createOrderMutation = useCreateOrder();

  const [shippingName, setShippingName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYHERE">("COD");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Prefill authenticated user profile data
  useEffect(() => {
    if (user) {
      setShippingName(user.name || "");
      setShippingEmail(user.email || "");
    }
  }, [user]);

  // Load PayHere JS SDK
  useEffect(() => {
    loadPayHereScript();
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!shippingName.trim()) newErrors.shippingName = "Full Name is required";
    if (!shippingEmail.trim()) {
      newErrors.shippingEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingEmail)) {
      newErrors.shippingEmail = "Invalid email formatting";
    }
    if (!shippingPhone.trim()) newErrors.shippingPhone = "Phone is required";
    if (!shippingAddress.trim()) newErrors.shippingAddress = "Address is required";
    if (!shippingCity.trim()) newErrors.shippingCity = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    setIsProcessing(true);

    try {
      // 1. Create order on the backend
      const order = await createOrderMutation.mutateAsync({
        shippingName,
        shippingEmail,
        shippingPhone,
        shippingAddress,
        shippingCity,
        deliveryMethod,
        paymentMethod,
      });

      if (paymentMethod === "COD") {
        // COD workflow: order is placed, cart cleared, redirect directly to success
        resetCartCount();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        setIsProcessing(false);
        router.push(`/orders/success?id=${order.id}`);
      } else {
        // PayHere workflow: get hash and launch checkout modal
        const params = await getPaymentParams(order.id);
        const payhere = (window as unknown as { payhere?: {
          onCompleted?: (completedOrderId: string) => void;
          onDismissed?: () => void;
          onError?: (error: string) => void;
          startPayment: (payParams: unknown) => void;
        } }).payhere;

        if (typeof window !== "undefined" && payhere) {
          payhere.onCompleted = function (orderId: string) {
            console.log("Payment completed. OrderID:", orderId);
            resetCartCount();
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
            router.push(`/orders/success?id=${orderId}`);
          };

          payhere.onDismissed = function () {
            console.log("Payment dismissed");
            setIsProcessing(false);
            alert("Payment dismissed. You can pay later from your order details page.");
            router.push(`/account/orders/${order.id}`);
          };

          payhere.onError = function (error: string) {
            console.error("PayHere Error:", error);
            setIsProcessing(false);
            alert(`Payment error: ${error}`);
            router.push(`/account/orders/${order.id}`);
          };

          // Trigger PayHere checkout lightbox modal
          payhere.startPayment(params);
        } else {
          setIsProcessing(false);
          alert("PayHere SDK is not loaded yet. Please try again.");
        }
      }
    } catch (err: unknown) {
      setIsProcessing(false);
      console.error(err);
      const message = err instanceof Error ? err.message : "An error occurred while placing your order.";
      alert(message);
    }
  };

  return {
    shippingName,
    setShippingName,
    shippingEmail,
    setShippingEmail,
    shippingPhone,
    setShippingPhone,
    shippingAddress,
    setShippingAddress,
    shippingCity,
    setShippingCity,
    deliveryMethod,
    setDeliveryMethod,
    paymentMethod,
    setPaymentMethod,
    errors,
    isProcessing: isProcessing || createOrderMutation.isPending,
    handlePlaceOrder,
  };
}
