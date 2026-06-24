"use client";

import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { useRemoveWishlistItem } from "@/features/wishlist/hooks/use-remove-wishlist-item";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { HeartCrack, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "3rem 1.5rem 6rem",
        minHeight: "70vh",
      }}
    >
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          My Wishlist
        </h1>
        <p style={{ color: "var(--fg-secondary)" }}>
          {items.length} {items.length === 1 ? "item" : "items"} saved for later
        </p>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem 2rem",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-xl)",
            border: "1px dashed var(--border-strong)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "rgba(201, 169, 110, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "1.5rem",
              color: "var(--accent)",
            }}
          >
            <HeartCrack size={32} />
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              marginBottom: "0.75rem",
            }}
          >
            Your wishlist is empty
          </h2>
          <p
            style={{
              color: "var(--fg-secondary)",
              marginBottom: "2rem",
              maxWidth: "400px",
            }}
          >
            Create your dream space by saving the items you love. They'll be
            right here when you're ready.
          </p>
          <Link
            href="/products"
            className="btn-shimmer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "var(--radius-full)",
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "var(--fg-primary)",
              textDecoration: "none",
            }}
          >
            Explore Products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((item) => {
            const product = item.product;
            const inStock = product.stock > 0;
            const image = product.images?.[0] || "/favicon.ico";
            const isProcessing =
              loadingItem === product.productId || isRemoving || isAddingToCart;

            return (
              <div
                key={item.wishlistItemId}
                style={{
                  background: "var(--bg-surface)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  boxShadow: "var(--shadow-sm)",
                  opacity: isProcessing ? 0.6 : 1,
                  pointerEvents: isProcessing ? "none" : "auto",
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
              >
                {/* Image */}
                <Link
                  href={`/products/${product.productId}`}
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    display: "block",
                  }}
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                  {/* Stock Indicator */}
                  <div
                    style={{
                      position: "absolute",
                      top: "0.75rem",
                      left: "0.75rem",
                      background: "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(4px)",
                      padding: "0.25rem 0.625rem",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.7rem",
                      fontWeight: 600,
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
                </Link>

                {/* Details */}
                <div
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                  }}
                >
                  <Link
                    href={`/products/${product.productId}`}
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      flex: 1,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.0625rem",
                        fontWeight: 600,
                        color: "var(--fg-primary)",
                        marginBottom: "0.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </h3>
                    <div
                      style={{
                        fontSize: "1.125rem",
                        fontWeight: 700,
                        color: "var(--fg-primary)",
                        fontFamily: "var(--font-serif)",
                      }}
                    >
                      Rs. {product.price.toLocaleString()}
                    </div>
                  </Link>

                  {/* Actions */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginTop: "1.5rem",
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
                        flex: 1,
                        padding: "0.625rem",
                        borderRadius: "var(--radius-md)",
                        background: inStock
                          ? "var(--bg-dark)"
                          : "var(--border-strong)",
                        color: inStock
                          ? "var(--accent-light)"
                          : "var(--fg-muted)",
                        border: "none",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        cursor: inStock ? "pointer" : "not-allowed",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ShoppingCart size={16} />
                      Move to Cart
                    </button>

                    <button
                      onClick={() => {
                        setLoadingItem(product.productId);
                        removeWishlistItem(product.productId, {
                          onSettled: () => setLoadingItem(null),
                        });
                      }}
                      style={{
                        padding: "0.625rem",
                        borderRadius: "var(--radius-md)",
                        background: "var(--bg-surface)",
                        border: "1px solid var(--border-strong)",
                        color: "var(--fg-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.borderColor = "#ef4444";
                        e.currentTarget.style.background =
                          "rgba(239, 68, 68, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--fg-secondary)";
                        e.currentTarget.style.borderColor =
                          "var(--border-strong)";
                        e.currentTarget.style.background = "var(--bg-surface)";
                      }}
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
