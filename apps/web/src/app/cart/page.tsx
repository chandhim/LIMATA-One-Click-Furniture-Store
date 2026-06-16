"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Trash2 } from "lucide-react";
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
          padding: "2rem 1.5rem 6rem",
        }}
      >
        {/* Page Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <div className="section-label" style={{ marginBottom: "0.625rem" }}>
            Shopping
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                fontWeight: 700,
                color: "var(--fg-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              Your Cart
            </h1>

            {hasItems && (
              <button
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.5rem 1rem",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "#dc2626",
                  background: "rgba(220,38,38,0.05)",
                  border: "1px solid rgba(220,38,38,0.18)",
                  borderRadius: "var(--radius-full)",
                  cursor: clearCart.isPending ? "not-allowed" : "pointer",
                  opacity: clearCart.isPending ? 0.6 : 1,
                  transition: "all 0.2s ease",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(220,38,38,0.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(220,38,38,0.05)";
                }}
              >
                <Trash2 size={13} />
                {clearCart.isPending ? "Clearing…" : "Clear Cart"}
              </button>
            )}
          </div>

          {hasItems && (
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.875rem",
                color: "var(--fg-secondary)",
              }}
            >
              {cart!.items.length}{" "}
              {cart!.items.length === 1 ? "item" : "items"} in your cart
            </p>
          )}
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
                gap: "1rem",
              }}
            >
              {cart!.items.map((item) => (
                <CartItemCard key={item.id} item={item} />
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
          grid-template-columns: 1fr 360px;
          gap: 2rem;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
