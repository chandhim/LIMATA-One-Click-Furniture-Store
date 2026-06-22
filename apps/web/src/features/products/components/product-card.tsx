"use client";

import Link from "next/link";
import type { ProductSummary } from "../types/product.types";
import { Armchair, Heart } from "lucide-react";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";
import { useRemoveWishlistItem } from "@/features/wishlist/hooks/use-remove-wishlist-item";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductSummary }) {
  const inStock = product.stock > 0;
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAdding } = useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemoving } =
    useRemoveWishlistItem();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isWishlisted = wishlist?.items?.some(
    (i) => i.productId === product.productId,
  );

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product.productId);
    }
  };

  return (
    <Link
      href={`/products/${product.productId}`}
      style={{
        display: "block",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition:
          "transform 0.32s cubic-bezier(0.22,1,0.36,1), box-shadow 0.32s ease, border-color 0.28s ease",
        boxShadow: "var(--shadow-sm)",
        position: "relative",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(-7px)";
        el.style.boxShadow = "var(--shadow-lg)";
        el.style.borderColor = "var(--accent-light)";
        const overlay = el.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "1";
        const img = el.querySelector(".card-img") as HTMLElement;
        if (img) img.style.transform = "scale(1.06)";
        const arrow = el.querySelector(".card-arrow") as HTMLElement;
        if (arrow) {
          arrow.style.background = "var(--accent)";
          arrow.style.borderColor = "var(--accent)";
          arrow.style.color = "#fff";
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-sm)";
        el.style.borderColor = "var(--border)";
        const overlay = el.querySelector(".card-overlay") as HTMLElement;
        if (overlay) overlay.style.opacity = "0";
        const img = el.querySelector(".card-img") as HTMLElement;
        if (img) img.style.transform = "scale(1)";
        const arrow = el.querySelector(".card-arrow") as HTMLElement;
        if (arrow) {
          arrow.style.background = "transparent";
          arrow.style.borderColor = "var(--border)";
          arrow.style.color = "var(--fg-muted)";
        }
      }}
    >
      {/* Image Area */}
      <div
        style={{
          height: "15rem",
          background: "linear-gradient(145deg, #F7F2EA 0%, #EDE0CC 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.images && product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="card-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ) : (
          <div
            className="card-img"
            style={{
              opacity: 0.35,
              transition: "transform 0.45s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              color: "var(--fg-muted)",
            }}
          >
            <Armchair size={64} strokeWidth={1.2} />
          </div>
        )}

        {/* Bottom gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(28,26,23,0.14) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />

        {/* Hover overlay CTA */}
        <div
          className="card-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(28,26,23,0.42)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.25s ease",
          }}
        >
          <span
            style={{
              background: "var(--bg-surface)",
              borderRadius: "var(--radius-full)",
              padding: "0.6rem 1.375rem",
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "0.03em",
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            View Details
          </span>
        </div>

        {/* Stock chip */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            left: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(8px)",
            borderRadius: "var(--radius-full)",
            padding: "0.28rem 0.65rem",
            fontSize: "0.68rem",
            fontWeight: 700,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: inStock ? "#22c55e" : "#ef4444",
              display: "inline-block",
              boxShadow: inStock ? "0 0 0 2px rgba(34,197,94,0.2)" : "none",
            }}
          />
          <span style={{ color: inStock ? "#166534" : "#991b1b" }}>
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isAdding || isRemoving}
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
            zIndex: 10,
            opacity: isAdding || isRemoving ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = "scale(1)";
          }}
        >
          <Heart
            size={16}
            color={isWishlisted ? "#ef4444" : "var(--fg-secondary)"}
            fill={isWishlisted ? "#ef4444" : "transparent"}
            style={{ transition: "all 0.2s ease" }}
          />
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "1.125rem 1.25rem 1.25rem" }}>
        <h3
          style={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            letterSpacing: "-0.01em",
            marginBottom: "0.375rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </h3>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "0.625rem",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Rs. {product.price.toLocaleString()}
          </div>

          {/* Arrow button */}
          <div
            className="card-arrow"
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "1.5px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-muted)",
              transition: "border-color 0.22s, color 0.22s, background 0.22s",
              fontSize: "0.9rem",
              fontWeight: 600,
              background: "transparent",
              flexShrink: 0,
            }}
          >
            →
          </div>
        </div>
      </div>
    </Link>
  );
}
