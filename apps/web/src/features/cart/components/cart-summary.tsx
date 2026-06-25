"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
        padding: "2rem",
        position: "sticky",
        top: "6rem",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <h2
        className="font-display"
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "var(--fg-primary)",
          marginBottom: "1.5rem",
          letterSpacing: "-0.01em",
        }}
      >
        Order Summary
      </h2>

      {/* Line items */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)" }}>
            Subtotal ({totalItems} items)
          </span>
          <span
            className="font-numeric"
            style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "var(--fg-primary)",
            }}
          >
            Rs.&nbsp;{subtotal.toLocaleString()}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)" }}>
            Shipping
          </span>
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "var(--fg-primary)",
            }}
          >
            Calculated at checkout
          </span>
        </div>
{/* 
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)" }}>
            Tax
          </span>
          <span
            style={{
              fontSize: "0.9375rem",
              fontWeight: 500,
              color: "var(--fg-primary)",
            }}
          >
            Calculated at checkout
          </span>
        </div>
      </div> */}
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: "1.5rem",
        }}
      />

      {/* Total */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2rem",
        }}
      >
        <span
          style={{
            fontSize: "1.0625rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
          }}
        >
          Estimated Total
        </span>
        <span
          className="font-serif font-numeric"
          style={{
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          Rs.&nbsp;{subtotal.toLocaleString()}
        </span>
      </div>

      {/* Checkout Button */}
      <Link
        href="/checkout"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          width: "100%",
          padding: "1rem 1.5rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          background: "var(--bg-dark)",
          color: "var(--accent-light)",
          textDecoration: "none",
          transition: "background 0.2s ease",
          marginBottom: "2rem",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#000";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "var(--bg-dark)";
        }}
      >
        Proceed to Checkout
        <ChevronRight size={18} />
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
