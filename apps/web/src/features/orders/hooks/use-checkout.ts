"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useCreateOrder, ORDERS_QUERY_KEY } from "./use-orders";
import { getPaymentParams } from "../services/order.service";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/use-cart-store";
import { updateProfile } from "@/features/auth/api/auth";
import { getApiBaseUrl } from "@/lib/env";

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
  const updateUserStore = useAuthStore((s) => s.updateUser);
  const resetCartCount = useCartStore((s) => s.reset);
  const createOrderMutation = useCreateOrder();

  const [shippingName, setShippingName] = useState("");
  const [shippingEmail, setShippingEmail] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("Standard");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "PAYHERE">("COD");
  const [saveToProfile, setSaveToProfile] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Prefill from authenticated user profile data (name, email, phone, address, city)
  useEffect(() => {
    if (user) {
      setShippingName(user.name || "");
      setShippingEmail(user.email || "");

      // Pre-fill from profile fields if available
      if (user.phoneNumber) setShippingPhone(user.phoneNumber);
      if (user.addressLine1) setShippingAddress(user.addressLine1);
      if (user.city) setShippingCity(user.city);
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
    if (!shippingAddress.trim())
      newErrors.shippingAddress = "Address is required";
    if (!shippingCity.trim()) newErrors.shippingCity = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Persist checkout shipping data back to the user's profile.
   * Called only when the user has checked "Save Details To Profile".
   */
  async function persistCheckoutToProfile() {
    if (!user || !saveToProfile) return;
    try {
      const updatedUser = await updateProfile({
        phoneNumber: shippingPhone || null,
        addressLine1: shippingAddress || null,
        city: shippingCity || null,
      });
      // Keep Zustand store in sync so the navbar avatar / profile page reflect changes
      updateUserStore(updatedUser);
      void queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      // Non-fatal — don't block the order flow
      console.warn("[Checkout] Failed to save details to profile:", err);
    }
  }

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

      // 2. Optionally persist shipping info back to user profile
      await persistCheckoutToProfile();

      if (paymentMethod === "COD") {
        // COD workflow: order is placed, cart cleared, redirect directly to success
        resetCartCount();
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
        setIsProcessing(false);
        router.push(`/orders/success?orderId=${order.orderId}`);
      } else {
        // PayHere workflow: get hash and launch checkout modal
        const params = await getPaymentParams(order.orderId);
        const payhere = (
          window as unknown as {
            payhere?: {
              onCompleted?: (completedOrderId: string) => void;
              onDismissed?: () => void;
              onError?: (error: string) => void;
              startPayment: (payParams: unknown) => void;
            };
          }
        ).payhere;

        if (typeof window !== "undefined" && payhere) {
          payhere.onCompleted = function (orderId: string) {
            console.log("Payment completed. OrderID:", orderId);
            resetCartCount();
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
            router.push(`/orders/success?orderId=${orderId}`);
          };

          payhere.onDismissed = function () {
            console.log("Payment dismissed");
            setIsProcessing(false);
            alert(
              "Payment dismissed. You can pay later from your order details page.",
            );
            router.push(`/account/orders/${order.orderId}`);
          };

          payhere.onError = function (error: string) {
            console.error("PayHere Error:", error);
            setIsProcessing(false);
            alert(`Payment error: ${error}`);
            router.push(`/account/orders/${order.orderId}`);
          };

          const payment = {
            sandbox: true,
            merchant_id: params.merchantId,
            order_id: params.orderId,
            amount: params.amount,
            currency: params.currency,
            hash: params.hash,
            items: params.items,
            first_name: params.first_name,
            last_name: params.last_name,
            email: params.email,
            phone: params.phone,
            address: params.address,
            city: params.city,
            country: params.country,
            notify_url: `${getApiBaseUrl()}/api/payment/notify`,
            return_url:
              typeof window !== "undefined"
                ? `${window.location.origin}/orders/success?orderId=${params.orderId}`
                : "",
            cancel_url:
              typeof window !== "undefined"
                ? `${window.location.origin}/account/orders/${params.orderId}`
                : "",
          };

          // Trigger PayHere checkout lightbox modal
          payhere.startPayment(payment);
        } else {
          setIsProcessing(false);
          alert("PayHere SDK is not loaded yet. Please try again.");
        }
      }
    } catch (err: unknown) {
      setIsProcessing(false);
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred while placing your order.";
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
    saveToProfile,
    setSaveToProfile,
    errors,
    isProcessing: isProcessing || createOrderMutation.isPending,
    handlePlaceOrder,
  };
}
