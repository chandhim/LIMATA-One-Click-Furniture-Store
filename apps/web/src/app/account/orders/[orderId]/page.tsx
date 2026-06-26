"use client";

import { useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import {
  useOrderDetails,
  useCancelOrder,
  ORDERS_QUERY_KEY,
} from "@/features/orders/hooks/use-orders";
import { getPaymentParams } from "@/features/orders/services/order.service";
import { MainLayout } from "@/components/layout/main-layout";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getApiBaseUrl } from "@/lib/env";
import Link from "next/link";
import { OrderProductReview } from "./order-product-review";
import { Armchair } from "lucide-react";

export default function OrderDetailsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const orderId = (params?.orderId as string) || "";

  // 1. Authenticate user
  const { isAuthenticated, isHydrated } = useAuthGuard();

  // 2. Fetch order details
  const { data: order, isLoading, isError } = useOrderDetails(orderId);

  // 3. Cancel order mutation
  const cancelOrderMutation = useCancelOrder();

  const [isPaying, setIsPaying] = useState(false);

  // Load PayHere script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("payhere-sdk")) return;
    const script = document.createElement("script");
    script.id = "payhere-sdk";
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!isHydrated || isLoading) {
    return (
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
            background: "var(--bg-base)",
          }}
        >
          <div style={{ fontSize: "1.1rem", color: "var(--fg-secondary)" }}>
            Loading order details...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated) return null;

  if (isError || !order) {
    return (
      <MainLayout>
        <div
          style={{
            background: "var(--bg-base)",
            minHeight: "75vh",
            padding: "4rem 1.5rem",
          }}
        >
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              textAlign: "center",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              padding: "3rem 2rem",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <span
              style={{
                fontSize: "3rem",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              ⚠️
            </span>
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
                marginBottom: "1rem",
              }}
            >
              Order Not Found
            </h2>
            <p style={{ color: "var(--fg-secondary)", marginBottom: "2rem" }}>
              We couldn&apos;t retrieve the details for order #{orderId.slice(-5).toUpperCase()}. It
              might not exist or you might not have access to it.
            </p>
            <Link
              href="/account/orders"
              style={{
                background: "var(--accent-dark)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      await cancelOrderMutation.mutateAsync(order.orderId);
      alert("Order status updated.");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to cancel order.";
      alert(message);
    }
  };

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const payParams = await getPaymentParams(order.orderId);
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
        payhere.onCompleted = function (completedOrderId: string) {
          console.log("Payment completed. OrderID:", completedOrderId);
          queryClient.invalidateQueries({
            queryKey: ["order", completedOrderId],
          });
          queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
          setIsPaying(false);
        };

        payhere.onDismissed = function () {
          setIsPaying(false);
        };

        payhere.onError = function (error: string) {
          alert(`Payment error: ${error}`);
          setIsPaying(false);
        };

        const payment = {
          sandbox: true,
          merchant_id: payParams.merchantId,
          order_id: payParams.orderId,
          amount: payParams.amount,
          currency: payParams.currency,
          hash: payParams.hash,
          items: payParams.items,
          first_name: payParams.first_name,
          last_name: payParams.last_name,
          email: payParams.email,
          phone: payParams.phone,
          address: payParams.address,
          city: payParams.city,
          country: payParams.country,
          notify_url: `${getApiBaseUrl()}/api/payment/notify`,
          return_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/orders/success?orderId=${payParams.orderId}`
              : "",
          cancel_url:
            typeof window !== "undefined"
              ? `${window.location.origin}/account/orders/${payParams.orderId}`
              : "",
        };

        payhere.startPayment(payment);
      } else {
        setIsPaying(false);
        alert(
          "PayHere SDK is not loaded yet. Please wait a moment and try again.",
        );
      }
    } catch (err: unknown) {
      setIsPaying(false);
      const message =
        err instanceof Error ? err.message : "Failed to fetch payment details.";
      alert(message);
    }
  };

  // Define steps for order tracker
  const steps = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  const isCancelled =
    order.orderStatus === "CANCELLED" ||
    order.orderStatus === "CANCELLATION_REQUESTED";

  return (
    <MainLayout>
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "100vh",
          padding: "4rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Back link */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              href="/account/orders"
              style={{
                textDecoration: "none",
                color: "var(--fg-secondary)",
                fontWeight: 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                transition: "color 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--accent-dark)";
                e.currentTarget.style.transform = "translateX(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--fg-secondary)";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <span>←</span> Back to My Orders
            </Link>
          </div>

          {/* Heading block */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "1.5rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <div>
              <span
                className="section-label"
                style={{ marginBottom: "0.5rem" }}
              >
                Receipt
              </span>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                Order #{order.orderId.slice(-5).toUpperCase()}
              </h1>
              <p
                style={{
                  margin: "0.375rem 0 0",
                  fontSize: "0.875rem",
                  color: "var(--fg-secondary)",
                }}
              >
                Placed on {formattedDate}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Order Status Badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: 600,
                  color:
                    order.orderStatus === "DELIVERED"
                      ? "#166534"
                      : isCancelled
                        ? "#991b1b"
                        : "#b45309",
                  background:
                    order.orderStatus === "DELIVERED"
                      ? "rgba(34, 197, 94, 0.08)"
                      : isCancelled
                        ? "rgba(239, 68, 68, 0.08)"
                        : "rgba(245, 158, 11, 0.08)",
                  border: `1px solid ${
                    order.orderStatus === "DELIVERED"
                      ? "rgba(34, 197, 94, 0.2)"
                      : isCancelled
                        ? "rgba(239, 68, 68, 0.2)"
                        : "rgba(245, 158, 11, 0.2)"
                  }`,
                  padding: "0.5rem 1rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.78rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background:
                      order.orderStatus === "DELIVERED"
                        ? "#22c55e"
                        : isCancelled
                          ? "#ef4444"
                          : "#f59e0b",
                  }}
                />
                {order.orderStatus.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Visual Order Timeline Tracker */}
          {!isCancelled && (
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "2.5rem 2rem",
                marginBottom: "3rem",
                boxShadow: "var(--shadow-sm)",
                position: "relative",
              }}
              className="texture-grain"
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--fg-secondary)",
                  marginBottom: "2rem",
                }}
              >
                Delivery Journey
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {/* Horizontal bar */}
                <div
                  style={{
                    position: "absolute",
                    left: "2rem",
                    right: "2rem",
                    top: "16px",
                    height: "3px",
                    background: "var(--border)",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "2rem",
                    width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 4rem)`,
                    top: "16px",
                    height: "3px",
                    background: "var(--accent)",
                    zIndex: 2,
                    transition: "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                  }}
                />

                {steps.map((step, idx) => {
                  const active = idx <= currentStepIndex;
                  const current = idx === currentStepIndex;
                  return (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.75rem",
                        zIndex: 3,
                        flex: 1,
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          background: current
                            ? "var(--bg-dark)"
                            : active
                              ? "var(--accent)"
                              : "var(--bg-surface)",
                          border: `2px solid ${
                            current
                              ? "var(--bg-dark)"
                              : active
                                ? "var(--accent)"
                                : "var(--border-strong)"
                          }`,
                          color: active
                            ? "var(--fg-inverse)"
                            : "var(--fg-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          boxShadow: current
                            ? "0 0 0 4px var(--accent-glow)"
                            : active
                              ? "0 4px 10px rgba(201,169,110,0.2)"
                              : "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        {active ? "✓" : idx + 1}
                      </div>
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: active ? 700 : 500,
                          color: active
                            ? "var(--fg-primary)"
                            : "var(--fg-muted)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                          textAlign: "center",
                        }}
                      >
                        {step.toLowerCase().replace("_", " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details split grid */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}
          >
            <div
              className="order-details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1fr",
                gap: "2.5rem",
              }}
            >
              {/* Left Column: Items purchased */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "2rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--fg-secondary)",
                      marginBottom: "1.5rem",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    Items in Order
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    {order.items.map((item) => (
                      <div
                        key={item.orderItemId}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          padding: "1rem 0",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: "1.5rem",
                            alignItems: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "5rem",
                              height: "5rem",
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-md)",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              position: "relative",
                            }}
                          >
                            {item.product.images &&
                            item.product.images.length > 0 ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <Armchair
                                size={28}
                                style={{ color: "var(--fg-muted)" }}
                              />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: "var(--fg-primary)",
                                margin: "0 0 0.25rem",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              {item.product.name}
                            </h4>
                            <span
                              style={{
                                fontSize: "0.825rem",
                                color: "var(--fg-secondary)",
                              }}
                            >
                              Rs. {item.price.toLocaleString()} ×{" "}
                              {item.quantity}
                            </span>
                          </div>
                          <div
                            style={{
                              fontWeight: 600,
                              color: "var(--fg-primary)",
                              fontSize: "0.95rem",
                            }}
                          >
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                        <OrderProductReview
                          productId={item.productId}
                          orderStatus={order.orderStatus}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
                      paddingTop: "1.25rem",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Subtotal</span>
                      <span
                        style={{ fontWeight: 500, color: "var(--fg-primary)" }}
                      >
                        Rs.{" "}
                        {order.items.reduce((acc, item) => acc + item.price * item.quantity, 0).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.85rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Shipping ({order.deliveryMethod})</span>
                      <span
                        style={{ fontWeight: 500, color: "var(--fg-primary)" }}
                      >
                        {order.totalAmount - order.items.reduce((acc, item) => acc + item.price * item.quantity, 0) > 0
                          ? `Rs. ${(order.totalAmount - order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)).toLocaleString()}`
                          : "Free"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "1.0625rem",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                        marginTop: "0.75rem",
                        paddingTop: "0.75rem",
                        borderTop: "1.5px solid var(--fg-primary)",
                      }}
                    >
                      <span>Total Amount</span>
                      <span className="text-gradient">
                        Rs. {order.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Shipping & Payment details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {/* Shipping Details */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.75rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--fg-secondary)",
                      marginBottom: "1.25rem",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    Delivery Location
                  </h3>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Recipient Name
                      </span>
                      <strong
                        style={{ color: "var(--fg-primary)", fontWeight: 600 }}
                      >
                        {order.shippingName}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Phone Number
                      </span>
                      <strong
                        style={{ color: "var(--fg-primary)", fontWeight: 600 }}
                      >
                        {order.shippingPhone}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Email Address
                      </span>
                      <strong
                        style={{ color: "var(--fg-primary)", fontWeight: 600 }}
                      >
                        {order.shippingEmail}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{
                          color: "var(--fg-muted)",
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                          display: "block",
                          marginBottom: "0.15rem",
                        }}
                      >
                        Shipping Address
                      </span>
                      <strong
                        style={{
                          color: "var(--fg-primary)",
                          fontWeight: 600,
                          lineHeight: 1.4,
                        }}
                      >
                        {order.shippingAddress}, {order.shippingCity}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Payment status */}
                <div
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "1.75rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--fg-secondary)",
                      marginBottom: "1.25rem",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.75rem",
                    }}
                  >
                    Payment Overview
                  </h3>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ color: "var(--fg-secondary)" }}>
                        Payment Method
                      </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
                        {order.paymentMethod}
                      </strong>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                      }}
                    >
                      <span style={{ color: "var(--fg-secondary)" }}>
                        Settlement Status
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "var(--radius-full)",
                          background:
                            order.paymentStatus === "PAID"
                              ? "rgba(34, 197, 94, 0.08)"
                              : order.paymentStatus === "FAILED"
                                ? "rgba(239, 68, 68, 0.08)"
                                : "rgba(245, 158, 11, 0.08)",
                          color:
                            order.paymentStatus === "PAID"
                              ? "#22c55e"
                              : order.paymentStatus === "FAILED"
                                ? "#ef4444"
                                : "#f59e0b",
                          border: `1px solid ${
                            order.paymentStatus === "PAID"
                              ? "rgba(34, 197, 94, 0.2)"
                              : order.paymentStatus === "FAILED"
                                ? "rgba(239, 68, 68, 0.2)"
                                : "rgba(245, 158, 11, 0.2)"
                          }`,
                        }}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>

                    {/* Pay Now Button (if PayHere payment is still pending) */}
                    {order.paymentMethod === "PAYHERE" &&
                      order.paymentStatus === "PENDING" &&
                      order.orderStatus === "PENDING" && (
                        <button
                          onClick={handlePayNow}
                          disabled={isPaying}
                          className="btn-shimmer"
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            border: "none",
                            color: "var(--fg-inverse)",
                            borderRadius: "var(--radius-full)",
                            fontWeight: 600,
                            cursor: isPaying ? "not-allowed" : "pointer",
                            marginTop: "1.25rem",
                            fontSize: "0.825rem",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {isPaying
                            ? "Loading Checkout..."
                            : "Pay Now with PayHere"}
                        </button>
                      )}
                  </div>
                </div>

                {/* Cancellation trigger */}
                {["PENDING", "CONFIRMED"].includes(order.orderStatus) && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={cancelOrderMutation.isPending}
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      background: "transparent",
                      border: "1.5px solid rgba(220,80,80,0.3)",
                      color: "rgba(220,80,80,0.9)",
                      borderRadius: "var(--radius-full)",
                      fontWeight: 600,
                      cursor: cancelOrderMutation.isPending
                        ? "not-allowed"
                        : "pointer",
                      fontSize: "0.825rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(220,80,80,0.8)";
                      e.currentTarget.style.background = "rgba(220,80,80,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(220,80,80,0.3)";
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {cancelOrderMutation.isPending
                      ? "Cancelling Order..."
                      : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 768px) {
          .order-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </MainLayout>
  );
}
