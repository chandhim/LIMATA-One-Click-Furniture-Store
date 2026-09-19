"use client";

import { useSearchParams } from "next/navigation";
import { useOrderDetails } from "@/features/orders/hooks/use-orders";
import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data: order, isLoading } = useOrderDetails(orderId);

  return (
    <div
      style={{
        background: "var(--bg-base)",
        minHeight: "80vh",
        padding: "4rem 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "3rem 2rem",
          boxShadow: "var(--shadow-md)",
          textAlign: "center",
        }}
      >
        {/* Dynamic Icon based on payment status */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            background: order?.orderStatus === "PAYMENT_PENDING" ? "rgba(234, 179, 8, 0.1)" : "rgba(34, 197, 94, 0.1)",
            color: order?.orderStatus === "PAYMENT_PENDING" ? "#eab308" : "#22c55e",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            margin: "0 auto 1.5rem",
          }}
        >
          {order?.orderStatus === "PAYMENT_PENDING" ? "⏳" : "✓"}
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "2rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          {order?.orderStatus === "PAYMENT_PENDING"
            ? "Waiting for Payment Confirmation"
            : "Thank You for Your Order!"}
        </h1>
        <p
          style={{
            color: "var(--fg-secondary)",
            fontSize: "0.95rem",
            marginBottom: "2rem",
          }}
        >
          {order?.orderStatus === "PAYMENT_PENDING"
            ? "We are waiting for PayHere to securely confirm your payment. If you have already completed the payment, this page will update shortly once we receive the confirmation."
            : "Your order has been placed successfully."}
        </p>

        {isLoading ? (
          <div style={{ color: "var(--fg-muted)", padding: "1.5rem 0" }}>
            Loading order details...
          </div>
        ) : order ? (
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              background: "var(--bg-base)",
              textAlign: "left",
              marginBottom: "2.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "0.75rem",
              }}
            >
              <span style={{ fontWeight: 600, color: "var(--fg-secondary)" }}>
                Order Reference
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  color: "var(--fg-primary)",
                  fontWeight: 700,
                }}
              >
                #{order.orderId.slice(-5).toUpperCase()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "var(--fg-secondary)" }}>
                Payment Status
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color:
                    order.paymentStatus === "PAID"
                      ? "#166534"
                      : order.paymentStatus === "FAILED"
                        ? "#991b1b"
                        : "#854d0e",
                  background:
                    order.paymentStatus === "PAID"
                      ? "rgba(34, 197, 94, 0.12)"
                      : order.paymentStatus === "FAILED"
                        ? "rgba(239, 68, 68, 0.12)"
                        : "rgba(201, 169, 110, 0.12)",
                  padding: "0.15rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                }}
              >
                {order.paymentStatus}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "var(--fg-secondary)" }}>
                Payment Method
              </span>
              <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
                {order.paymentMethod}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "var(--fg-secondary)" }}>
                Shipping Address
              </span>
              <span
                style={{
                  color: "var(--fg-primary)",
                  fontWeight: 500,
                  textAlign: "right",
                }}
              >
                {order.shippingAddress}, {order.shippingCity}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid var(--border)",
                paddingTop: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--fg-primary)" }}>
                Amount Paid
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  fontSize: "1.1rem",
                }}
              >
                Rs. {order.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <div style={{ color: "red", padding: "1.5rem 0" }}>
            Order not found.
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link
            href={`/account/orders/${orderId}`}
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              background: "var(--accent-dark)",
              color: "white",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
            }}
          >
            Track Order Status
          </Link>
          <Link
            href="/products"
            style={{
              flex: 1,
              padding: "0.75rem 1.5rem",
              border: "1.5px solid var(--border)",
              color: "var(--fg-secondary)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "0.95rem",
              transition: "border-color 0.2s",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <MainLayout>
      <Suspense
        fallback={
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
              Loading confirmation details...
            </div>
          </div>
        }
      >
        <OrderSuccessContent />
      </Suspense>
    </MainLayout>
  );
}
