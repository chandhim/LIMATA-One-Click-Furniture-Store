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
import Link from "next/link";

export default function OrderDetailsPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const orderId = (params?.id as string) || "";

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
              We couldn&apos;t retrieve the details for order #{orderId}. It
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
      await cancelOrderMutation.mutateAsync(order.id);
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
      const payParams = await getPaymentParams(order.id);
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
          notify_url: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000"}/api/payment/notify`,
          return_url: typeof window !== "undefined" ? `${window.location.origin}/orders/success?id=${payParams.orderId}` : "",
          cancel_url: typeof window !== "undefined" ? `${window.location.origin}/account/orders/${payParams.orderId}` : "",
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
          padding: "3rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1024px", margin: "0 auto" }}>
          {/* Back link */}
          <div style={{ marginBottom: "1.5rem" }}>
            <Link
              href="/account/orders"
              style={{
                textDecoration: "none",
                color: "var(--accent-dark)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
                fontSize: "0.9rem",
              }}
            >
              ← Back to My Orders
            </Link>
          </div>

          {/* Heading block */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                Order Detail
              </h1>
              <span style={{ fontSize: "0.9rem", color: "var(--fg-muted)" }}>
                Placed on {formattedDate}
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Order Status Badge */}
              <span
                style={{
                  fontWeight: 600,
                  color:
                    order.orderStatus === "DELIVERED"
                      ? "#166534"
                      : isCancelled
                        ? "#991b1b"
                        : "#1e3a8a",
                  background:
                    order.orderStatus === "DELIVERED"
                      ? "rgba(34, 197, 94, 0.12)"
                      : isCancelled
                        ? "rgba(239, 68, 68, 0.12)"
                        : "rgba(30, 58, 138, 0.12)",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.85rem",
                }}
              >
                {order.orderStatus}
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
                padding: "2rem",
                marginBottom: "2rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  marginBottom: "1.5rem",
                }}
              >
                Delivery Progress
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  position: "relative",
                  padding: "0 1rem",
                }}
              >
                {/* Horizontal bar */}
                <div
                  style={{
                    position: "absolute",
                    left: "2rem",
                    right: "2rem",
                    top: "14px",
                    height: "4px",
                    background: "var(--border)",
                    zIndex: 1,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: "2rem",
                    width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    top: "14px",
                    height: "4px",
                    background: "var(--accent)",
                    zIndex: 2,
                    transition: "width 0.4s ease",
                  }}
                />

                {steps.map((step, idx) => {
                  const active = idx <= currentStepIndex;
                  return (
                    <div
                      key={step}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "0.5rem",
                        zIndex: 3,
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: active
                            ? "var(--accent)"
                            : "var(--bg-surface)",
                          border: `2px solid ${active ? "var(--accent)" : "var(--border)"}`,
                          color: active ? "white" : "var(--fg-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "0.85rem",
                          fontWeight: 700,
                          transition: "all 0.3s ease",
                        }}
                      >
                        {active ? "✓" : idx + 1}
                      </div>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: active ? 700 : 500,
                          color: active
                            ? "var(--fg-primary)"
                            : "var(--fg-muted)",
                          textTransform: "capitalize",
                        }}
                      >
                        {step.toLowerCase()}
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
                gap: "2rem",
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
                    padding: "1.5rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      marginBottom: "1.25rem",
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
                      gap: "1rem",
                    }}
                  >
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          gap: "1rem",
                          alignItems: "center",
                          borderBottom: "1px solid rgba(0,0,0,0.03)",
                          paddingBottom: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "4.5rem",
                            height: "4.5rem",
                            background:
                              "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
                            borderRadius: "var(--radius-md)",
                            overflow: "hidden",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
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
                            <span style={{ fontSize: "1.75rem" }}>🪑</span>
                          )}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4
                            style={{
                              fontSize: "0.95rem",
                              fontWeight: 600,
                              color: "var(--fg-primary)",
                              margin: "0 0 0.25rem",
                            }}
                          >
                            {item.product.name}
                          </h4>
                          <span
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--fg-secondary)",
                            }}
                          >
                            Price: Rs. {item.price.toLocaleString()} | Qty:{" "}
                            {item.quantity}
                          </span>
                        </div>
                        <div
                          style={{
                            fontWeight: 700,
                            color: "var(--fg-primary)",
                            fontSize: "1rem",
                          }}
                        >
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      marginTop: "1.5rem",
                      borderTop: "1px solid var(--border)",
                      paddingTop: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Subtotal</span>
                      <span>
                        Rs.{" "}
                        {(
                          order.totalAmount -
                          (order.deliveryMethod === "Express" ? 1000 : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      <span>Shipping ({order.deliveryMethod})</span>
                      <span>
                        {order.deliveryMethod === "Express"
                          ? "Rs. 1,000"
                          : "Free"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                        marginTop: "0.5rem",
                        borderTop: "1px solid var(--border)",
                        paddingTop: "0.75rem",
                      }}
                    >
                      <span>Total Amount</span>
                      <span>Rs. {order.totalAmount.toLocaleString()}</span>
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
                    padding: "1.5rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      marginBottom: "1rem",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Shipping Details
                  </h3>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <span
                        style={{ color: "var(--fg-muted)", display: "block" }}
                      >
                        Recipient
                      </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
                        {order.shippingName}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{ color: "var(--fg-muted)", display: "block" }}
                      >
                        Contact Phone
                      </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
                        {order.shippingPhone}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{ color: "var(--fg-muted)", display: "block" }}
                      >
                        Contact Email
                      </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
                        {order.shippingEmail}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{ color: "var(--fg-muted)", display: "block" }}
                      >
                        Delivery Address
                      </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
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
                    padding: "1.5rem",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      marginBottom: "1rem",
                      borderBottom: "1px solid var(--border)",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Payment Details
                  </h3>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--fg-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--fg-muted)" }}>Method: </span>
                      <strong style={{ color: "var(--fg-primary)" }}>
                        {order.paymentMethod}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--fg-muted)" }}>Status: </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color:
                            order.paymentStatus === "PAID"
                              ? "#22c55e"
                              : order.paymentStatus === "FAILED"
                                ? "#ef4444"
                                : "#eab308",
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
                          style={{
                            width: "100%",
                            padding: "0.75rem",
                            background: "#22c55e",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-md)",
                            fontWeight: 700,
                            cursor: isPaying ? "not-allowed" : "pointer",
                            marginTop: "1rem",
                            fontSize: "0.85rem",
                            boxShadow: "0 2px 4px rgba(34, 197, 94, 0.2)",
                          }}
                        >
                          {isPaying
                            ? "Loading Payment..."
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
                      padding: "0.75rem",
                      background: "transparent",
                      border: "1.5px solid red",
                      color: "red",
                      borderRadius: "var(--radius-md)",
                      fontWeight: 600,
                      cursor: cancelOrderMutation.isPending
                        ? "not-allowed"
                        : "pointer",
                      fontSize: "0.875rem",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(239, 68, 68, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {cancelOrderMutation.isPending
                      ? "Requesting Cancellation..."
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
