"use client";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { useRemoveWishlistItem } from "@/features/wishlist/hooks/use-remove-wishlist-item";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { HeartCrack, ShoppingCart, Trash2, ArrowLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const { mutate: removeWishlistItem, isPending: isRemoving } =
    useRemoveWishlistItem();
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const [loadingItem, setLoadingItem] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          className="spinner"
          style={{
            width: "2rem",
            height: "2rem",
            border: "2px solid var(--border)",
            borderTopColor: "var(--accent)",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const items = wishlist?.items || [];

  return (
    <div
      style={{
        maxWidth: "1024px",
        margin: "0 auto",
        padding: "3rem 1.5rem 8rem",
        minHeight: "70vh",
      }}
    >
      <div style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--fg-secondary)",
              textDecoration: "none",
              fontSize: "0.875rem",
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

          <Link
            href="/cart"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--fg-primary)",
              textDecoration: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "0.5rem 1rem",
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-full)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--fg-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <ShoppingCart size={16} /> View Cart
          </Link>
        </div>

        <div>
          <h1
            className="font-display"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: "var(--fg-primary)",
              marginBottom: "0.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Your Wishlist
          </h1>
          <p style={{ color: "var(--fg-secondary)", fontSize: "1.0625rem" }}>
            {items.length} {items.length === 1 ? "item" : "items"} saved for later
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "5rem 2rem",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(201, 169, 110, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "2rem",
              color: "var(--accent-dark)",
            }}
          >
            <HeartCrack size={36} strokeWidth={1.5} />
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              marginBottom: "1rem",
            }}
          >
            Nothing saved yet
          </h2>
          <p
            style={{
              color: "var(--fg-secondary)",
              marginBottom: "2.5rem",
              maxWidth: "400px",
              lineHeight: 1.6,
            }}
          >
            Create your dream space by saving the items you love. They&apos;ll be
            right here when you&apos;re ready.
          </p>
          <Link
            href="/products"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 2rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              background: "var(--bg-dark)",
              color: "var(--accent-light)",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-dark)";
            }}
          >
            Explore Furniture
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {items.map((item, index) => {
            const product = item.product;
            const inStock = product.stock > 0;
            const image = product.images?.[0] || "/favicon.ico";
            const isProcessing =
              loadingItem === product.productId || isRemoving || isAddingToCart;
            const isLast = index === items.length - 1;

            return (
              <div
                key={item.wishlistItemId}
                className="wishlist-list-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  borderBottom: isLast ? "none" : "1px solid var(--border)",
                  opacity: isProcessing ? 0.6 : 1,
                  pointerEvents: isProcessing ? "none" : "auto",
                  transition: "opacity 0.2s ease",
                }}
              >
                {/* Image */}
                <Link
                  href={`/products/${product.productId}`}
                  style={{
                    position: "relative",
                    width: "120px",
                    height: "120px",
                    flexShrink: 0,
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </Link>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link
                    href={`/products/${product.productId}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "block",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.0625rem",
                        fontWeight: 600,
                        color: "var(--fg-primary)",
                        marginBottom: "0.375rem",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <div
                    className="font-serif font-numeric"
                    style={{
                      fontSize: "1.125rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Rs.&nbsp;{product.price.toLocaleString()}
                  </div>

                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      color: inStock ? "#166534" : "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: inStock ? "#22c55e" : "#ef4444",
                      }}
                    />
                    {inStock ? "In Stock" : "Out of Stock"}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="wishlist-actions"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.75rem",
                    marginLeft: "auto",
                  }}
                >
                  <button
                    onClick={() => {
                      setLoadingItem(product.productId);
                      addToCart(
                        { productId: product.productId, quantity: 1 },
                        {
                          onSuccess: () => {
                            removeWishlistItem(product.productId, {
                              onSettled: () => setLoadingItem(null),
                            });
                          },
                          onError: () => {
                            setLoadingItem(null);
                          },
                        },
                      );
                    }}
                    disabled={!inStock}
                    style={{
                      padding: "0.625rem 1.25rem",
                      borderRadius: "var(--radius-full)",
                      background: inStock ? "var(--bg-dark)" : "var(--border-strong)",
                      color: inStock ? "var(--accent-light)" : "var(--fg-muted)",
                      border: "none",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      cursor: inStock ? "pointer" : "not-allowed",
                      transition: "background 0.2s ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (inStock) {
                        e.currentTarget.style.background = "#000";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (inStock) {
                        e.currentTarget.style.background = "var(--bg-dark)";
                      }
                    }}
                  >
                    Move to Cart <ChevronRight size={16} />
                  </button>

                  <button
                    onClick={() => {
                      setLoadingItem(product.productId);
                      removeWishlistItem(product.productId, {
                        onSettled: () => setLoadingItem(null),
                      });
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--fg-secondary)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.375rem",
                      fontSize: "0.8125rem",
                      fontWeight: 500,
                      padding: "0.375rem 0.5rem",
                      borderRadius: "var(--radius-sm)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#dc2626";
                      e.currentTarget.style.background = "rgba(220, 38, 38, 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--fg-secondary)";
                      e.currentTarget.style.background = "none";
                    }}
                    title="Remove from wishlist"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .wishlist-list-item {
            flex-direction: column;
            align-items: stretch !important;
            gap: 1rem !important;
          }
          .wishlist-actions {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-left: 0 !important;
            width: 100%;
          }
          .wishlist-actions button:first-child {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
