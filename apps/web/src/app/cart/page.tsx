"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "@/features/cart/hooks/use-cart";
import { useClearCart } from "@/features/cart/hooks/use-clear-cart";
import { CartItemCard } from "@/features/cart/components/cart-item";
import { CartSummary } from "@/features/cart/components/cart-summary";
import { CartEmptyState } from "@/features/cart/components/cart-empty-state";
import { CartSkeleton } from "@/features/cart/components/cart-skeleton";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

export default function CartPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const { data: cart, isLoading, isError } = useCart();
  const clearCart = useClearCart();

  // Redirect to login when not authenticated
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || isLoading) return <CartSkeleton />;
  if (!isAuthenticated) return null;

  if (isError) {
    return (
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
          color: "var(--fg-secondary)",
        }}
      >
        <ShoppingCart size={40} strokeWidth={1.5} />
        <p style={{ fontSize: "0.9375rem" }}>
          Unable to load your cart. Please try again.
        </p>
      </div>
    );
  }

  const hasItems = cart?.items && cart.items.length > 0;

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "3rem 1.5rem 6rem",
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "3rem" }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--fg-secondary)",
              textDecoration: "none",
              fontSize: "0.875rem",
              marginBottom: "1.5rem",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--fg-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--fg-secondary)";
            }}
          >
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "1rem",
            }}
          >
            <div>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.75rem)",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "0.25rem",
                }}
              >
                <ShoppingCart size={40} />
                Your Cart
              </h1>
              {hasItems && (
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {cart!.items.length}{" "}
                  {cart!.items.length === 1 ? "item" : "items"}
                </p>
              )}
            </div>

            {hasItems && (
              <button
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.625rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#52525b",
                  background: "transparent",
                  border: "none",
                  cursor: clearCart.isPending ? "not-allowed" : "pointer",
                  opacity: clearCart.isPending ? 0.6 : 1,
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "#52525b";
                }}
              >
                <Trash2 size={15} />
                {clearCart.isPending ? "Clearing…" : "Clear Cart"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {!hasItems ? (
          <CartEmptyState />
        ) : (
          <div className="cart-grid">
            {/* Items column */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {cart!.items.map((item) => (
                <CartItemCard key={item.cartItemId} item={item} />
              ))}
            </div>

            {/* Summary sidebar */}
            <CartSummary items={cart!.items} />
          </div>
        )}
      </div>

      <style>{`
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 960px) {
          .cart-grid {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}
