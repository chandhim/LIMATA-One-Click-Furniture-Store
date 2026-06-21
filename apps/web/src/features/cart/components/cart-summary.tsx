"use client";

import Link from "next/link";
import { ShoppingBag, ChevronRight } from "lucide-react";
import type { CartItem } from "../types/cart.types";

interface CartSummaryProps {
  items: CartItem[];
}

export function CartSummary({ items }: CartSummaryProps) {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.75rem",
        boxShadow: "var(--shadow-sm)",
        position: "sticky",
        top: "6rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.625rem",
          marginBottom: "1.5rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            background: "rgba(201,169,110,0.1)",
            borderRadius: "var(--radius-sm)",
            padding: "0.4rem",
            color: "var(--accent-dark)",
          }}
        >
          <ShoppingBag size={16} />
        </div>
        <h2
          className="font-display"
          style={{
            fontSize: "1.0625rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
          }}
        >
          Order Summary
        </h2>
      </div>

      {/* Line items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.875rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
            Items ({totalItems})
          </span>
          <span
            className="font-numeric"
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--fg-primary)",
            }}
          >
            Rs.&nbsp;{subtotal.toLocaleString()}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
            Shipping
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "var(--accent-dark)",
            }}
          >
            Calculated at checkout
          </span>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: "1.25rem",
        }}
      />

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.75rem",
        }}
      >
        <span
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
          }}
        >
          Estimated Total
        </span>
        <span
          className="font-serif font-numeric"
          style={{
            fontSize: "1.375rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Rs.&nbsp;{subtotal.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        className="btn-shimmer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "0.875rem 1.5rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          color: "var(--fg-primary)",
          textDecoration: "none",
          borderRadius: "var(--radius-full)",
          boxShadow: "var(--shadow-accent)",
        }}
      >
        Proceed to Checkout
        <ChevronRight size={16} />
      </Link>

      {/* Trust note */}
      <p
        style={{
          marginTop: "1rem",
          textAlign: "center",
          fontSize: "0.75rem",
          color: "var(--fg-muted)",
          lineHeight: 1.5,
        }}
      >
        Secure checkout · Free assembly on delivery
      </p>
    </div>
  );
}
