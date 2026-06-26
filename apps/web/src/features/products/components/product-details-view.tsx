"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useProducts } from "../hooks/use-products";
import { ProductCard } from "./product-card";
import type { Product } from "../types/product.types";
import { ProductReviews } from "./product-reviews";
import dynamic from "next/dynamic";
const Product3DViewer = dynamic(
  () => import("./product-3d-viewer").then((mod) => mod.Product3DViewer),
  { ssr: false },
);
import { ARLauncherView } from "./ar-launcher-view";
import { useAddToCart } from "@/features/cart/hooks/use-add-to-cart";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useWishlist } from "@/features/wishlist/hooks/use-wishlist";
import { useAddToWishlist } from "@/features/wishlist/hooks/use-add-to-wishlist";
import { useRemoveWishlistItem } from "@/features/wishlist/hooks/use-remove-wishlist-item";
import { toast } from "sonner";
import {
  Heart,
  ShoppingCart,
  ChevronRight,
  ShieldCheck,
  Award,
  Sparkles,
  Truck,
  Plus,
  Minus,
  X,
  Maximize2,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";

interface ProductDetailsViewProps {
  product: Product;
}

export function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping"
  >("description");

  // View Mode
  const [viewMode, setViewMode] = useState<"photos" | "3d">("photos");

  // Hover Zoom State
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Wishlist Hooks
  const { data: wishlist } = useWishlist();
  const { mutate: addToWishlist, isPending: isAddingToWishlist } =
    useAddToWishlist();
  const { mutate: removeFromWishlist, isPending: isRemovingFromWishlist } =
    useRemoveWishlistItem();
  const isWishlisted = wishlist?.items?.some(
    (i) => i.productId === product.productId,
  );

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(product.productId);
    } else {
      addToWishlist(product.productId);
    }
  };

  // Cart
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const addToCartMutation = useAddToCart();
  const [cartFeedback, setCartFeedback] = useState<
    "idle" | "adding" | "added" | "error"
  >("idle");

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setCartFeedback("adding");
    addToCartMutation.mutate(
      { productId: product.productId, quantity },
      {
        onSuccess: () => {
          setCartFeedback("added");
          setTimeout(() => setCartFeedback("idle"), 2500);
        },
        onError: () => {
          setCartFeedback("error");
          setTimeout(() => setCartFeedback("idle"), 2500);
        },
      },
    );
  };

  // Fetch related products (same category)
  const { data: relatedProducts, isLoading: relatedLoading } = useProducts(
    undefined,
    product.category,
  );

  const filteredRelated =
    relatedProducts
      ?.filter((p) => p.productId !== product.productId)
      .slice(0, 4) ?? [];

  const images =
    product.images && product.images.length > 0
      ? product.images
      : ["/favicon.ico"];
  const currentImage = images[activeImageIndex] || "/favicon.ico";

  // Stock status styling helper
  const getStockBadge = (stock: number) => {
    if (stock <= 0) {
      return {
        text: "Out Of Stock",
        bg: "rgba(239, 68, 68, 0.1)",
        color: "#dc2626",
        dot: "#ef4444",
      };
    }
    if (stock <= 3) {
      return {
        text: `Low Stock (${stock} left)`,
        bg: "rgba(245, 158, 11, 0.1)",
        color: "#d97706",
        dot: "#f59e0b",
      };
    }
    return {
      text: "In Stock",
      bg: "rgba(34, 197, 94, 0.1)",
      color: "#16a34a",
      dot: "#22c55e",
    };
  };

  const stockBadge = getStockBadge(product.stock);

  // Quantity handlers
  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Hover Zoom handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Lightbox handlers
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh" }}>
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "2rem 1.5rem 6rem",
        }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.8125rem",
            color: "var(--fg-secondary)",
            marginBottom: "2.5rem",
          }}
        >
          <Link
            href="/"
            style={{
              textDecoration: "none",
              color: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent-dark)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            Home
          </Link>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <Link
            href="/products"
            style={{
              textDecoration: "none",
              color: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "var(--accent-dark)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.color = "inherit")}
          >
            Products
          </Link>
          <ChevronRight size={14} style={{ opacity: 0.5 }} />
          <span
            style={{
              color: "var(--fg-primary)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "200px",
            }}
          >
            {product.name}
          </span>
        </nav>

        {/* Dynamic Two-Column Layout */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3.5rem" }}
          className="details-grid"
        >
          {/* Column 1: Image Gallery & AR Reserved Section */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
          >
            {/* View Mode Toggle */}
            <div
              style={{
                display: "flex",
                background: "var(--bg-surface)",
                padding: "0.35rem",
                borderRadius: "var(--radius-full)",
                width: "fit-content",
                gap: "0.25rem",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => setViewMode("photos")}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "var(--radius-full)",
                  background:
                    viewMode === "photos" ? "var(--bg-dark)" : "transparent",
                  color:
                    viewMode === "photos"
                      ? "var(--fg-inverse)"
                      : "var(--fg-secondary)",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                Photos
              </button>
              <button
                onClick={() => setViewMode("3d")}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: "var(--radius-full)",
                  background:
                    viewMode === "3d" ? "var(--bg-dark)" : "transparent",
                  color:
                    viewMode === "3d"
                      ? "var(--fg-inverse)"
                      : "var(--fg-secondary)",
                  border: "none",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                3D & AR
              </button>
            </div>

            {viewMode === "photos" ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {/* Main Image Viewport with Hover Zoom */}
                <div
                  onMouseEnter={() => setIsZoomed(true)}
                  onMouseLeave={() => setIsZoomed(false)}
                  onMouseMove={handleMouseMove}
                  onClick={() => setIsLightboxOpen(true)}
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "4/3",
                    background:
                      "linear-gradient(135deg, #FDFCFB 0%, #E2D1C3 100%)",
                    borderRadius: "var(--radius-xl)",
                    overflow: "hidden",
                    cursor: "zoom-in",
                    border: "1px solid rgba(255,255,255,0.4)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      transform: isZoomed ? "scale(1.8)" : "scale(1)",
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      transition: isZoomed
                        ? "none"
                        : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                    }}
                  >
                    <Image
                      src={currentImage}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      className="object-cover"
                    />
                  </div>

                  {/* Maximize Icon Overlay */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "1rem",
                      right: "1rem",
                      background: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "50%",
                      padding: "0.5rem",
                      color: "var(--fg-primary)",
                      pointerEvents: "none",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  >
                    <Maximize2 size={16} />
                  </div>
                </div>

                {/* Thumbnail Row */}
                {images.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {images.map((img, idx) => (
                      <button
                        key={`${img}-${idx}`}
                        onClick={() => setActiveImageIndex(idx)}
                        style={{
                          position: "relative",
                          width: "80px",
                          height: "80px",
                          borderRadius: "var(--radius-md)",
                          overflow: "hidden",
                          border:
                            activeImageIndex === idx
                              ? "2.5px solid var(--accent)"
                              : "1px solid var(--border)",
                          background:
                            "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
                          cursor: "pointer",
                          padding: 0,
                          outline: "none",
                          transition: "all 0.2s ease",
                          transform:
                            activeImageIndex === idx
                              ? "scale(1.03)"
                              : "scale(1)",
                        }}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div style={{ aspectRatio: "4/3", width: "100%" }}>
                  <Product3DViewer modelUrl={product.model3dUrl} />
                </div>
                {product.model3dUrl && (
                  <ARLauncherView modelUrl={product.model3dUrl} />
                )}
              </div>
            )}
          </div>

          {/* Column 2: Product Information & Purchase Area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: "2.5rem",
            }}
          >
            {/* Header info */}
            <div>
              {/* Category */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-dark)",
                  marginBottom: "0.75rem",
                }}
              >
                {product.category}
              </div>

              {/* Title & Stock Badge */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h1
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    color: "var(--fg-primary)",
                  }}
                >
                  {product.name}
                </h1>

                {/* Stock status badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    background: stockBadge.bg,
                    borderRadius: "var(--radius-full)",
                    padding: "0.3rem 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: stockBadge.color,
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: stockBadge.dot,
                      display: "inline-block",
                    }}
                  />
                  {stockBadge.text}
                </div>
              </div>

              {/* Price */}
              <div
                className="font-serif font-numeric"
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                  letterSpacing: "-0.02em",
                  marginBottom: "1.5rem",
                }}
              >
                Rs. {product.price.toLocaleString()}
              </div>

              {/* Short description */}
              <p
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.6,
                  marginBottom: "2rem",
                }}
              >
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div
              style={{ width: "100%", height: 1, background: "var(--border)" }}
            />

            {/* Purchase Section */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  width: "100%",
                }}
              >
                {/* Quantity Selector */}
                {product.stock > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                      minWidth: "120px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "var(--fg-muted)",
                        height: "1rem",
                      }}
                    >
                      Quantity
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: "transparent",
                        border: "1.5px solid var(--border-strong)",
                        borderRadius: "var(--radius-full)",
                        padding: "0.25rem",
                        height: "44px",
                      }}
                    >
                      <button
                        onClick={handleDecrement}
                        disabled={quantity <= 1}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: quantity <= 1 ? "not-allowed" : "pointer",
                          padding: "0.5rem",
                          color: "var(--fg-primary)",
                          opacity: quantity <= 1 ? 0.35 : 0.8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          outline: "none",
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        style={{
                          minWidth: "2rem",
                          textAlign: "center",
                          fontSize: "0.9375rem",
                          fontWeight: 600,
                          color: "var(--fg-primary)",
                        }}
                      >
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncrement}
                        disabled={quantity >= product.stock}
                        style={{
                          background: "none",
                          border: "none",
                          cursor:
                            quantity >= product.stock
                              ? "not-allowed"
                              : "pointer",
                          padding: "0.5rem",
                          color: "var(--fg-primary)",
                          opacity: quantity >= product.stock ? 0.35 : 0.8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          outline: "none",
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Add to Cart & Wishlist Actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "transparent",
                      height: "1rem",
                      userSelect: "none",
                    }}
                  >
                    Action
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      width: "100%",
                    }}
                  >
                    {/* Cart button */}
                    <button
                      disabled={product.stock <= 0 || cartFeedback === "adding"}
                      onClick={handleAddToCart}
                      className={
                        product.stock > 0 && cartFeedback !== "adding"
                          ? "btn-shimmer"
                          : ""
                      }
                      style={{
                        flex: 1,
                        height: "44px",
                        background:
                          product.stock <= 0
                            ? "var(--border-strong)"
                            : cartFeedback === "added"
                              ? "rgba(34,197,94,0.15)"
                              : cartFeedback === "error"
                                ? "rgba(239,68,68,0.12)"
                                : "var(--bg-dark)",
                        color:
                          product.stock <= 0
                            ? "var(--fg-muted)"
                            : cartFeedback === "added"
                              ? "#16a34a"
                              : cartFeedback === "error"
                                ? "#dc2626"
                                : "var(--accent-light)",
                        border:
                          cartFeedback === "added"
                            ? "1px solid rgba(34,197,94,0.3)"
                            : cartFeedback === "error"
                              ? "1px solid rgba(239,68,68,0.3)"
                              : "none",
                        borderRadius: "var(--radius-full)",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor:
                          product.stock <= 0 || cartFeedback === "adding"
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.5rem",
                        boxShadow:
                          product.stock > 0 && cartFeedback === "idle"
                            ? "0 8px 20px rgba(0,0,0,0.15)"
                            : "none",
                        outline: "none",
                        transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                      }}
                    >
                      <ShoppingCart
                        size={16}
                        style={{
                          animation:
                            cartFeedback === "adding"
                              ? "pulse 0.8s ease infinite"
                              : "none",
                        }}
                      />
                      {product.stock <= 0
                        ? "Out of Stock"
                        : cartFeedback === "adding"
                          ? "Adding…"
                          : cartFeedback === "added"
                            ? "Added to Cart ✓"
                            : cartFeedback === "error"
                              ? "Try Again"
                              : "Add to Cart"}
                    </button>

                    {/* Wishlist button */}
                    <button
                      onClick={handleWishlist}
                      disabled={isAddingToWishlist || isRemovingFromWishlist}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        border: "1.5px solid var(--border-strong)",
                        background: isWishlisted
                          ? "rgba(239, 68, 68, 0.08)"
                          : "var(--bg-surface)",
                        color: isWishlisted ? "#ef4444" : "var(--fg-secondary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        outline: "none",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                        opacity:
                          isAddingToWishlist || isRemovingFromWishlist
                            ? 0.6
                            : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isWishlisted) {
                          e.currentTarget.style.borderColor =
                            "var(--fg-primary)";
                          e.currentTarget.style.color = "var(--fg-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isWishlisted) {
                          e.currentTarget.style.borderColor =
                            "var(--border-strong)";
                          e.currentTarget.style.color = "var(--fg-secondary)";
                        }
                      }}
                    >
                      <Heart
                        size={18}
                        fill={isWishlisted ? "#ef4444" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Contact Seller */}
              <button
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-chat", {
                      detail: {
                        productId: product.productId,
                        productName: product.name,
                        origin: window.location.origin,
                      },
                    }),
                  );
                }}
                style={{
                  height: "44px",
                  background: "transparent",
                  color: "var(--fg-primary)",
                  border: "1.5px solid var(--border-strong)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  width: "100%",
                  transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--bg-dark)";
                  el.style.borderColor = "var(--bg-dark)";
                  el.style.color = "var(--accent-light)";
                  el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                  el.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "transparent";
                  el.style.borderColor = "var(--border-strong)";
                  el.style.color = "var(--fg-primary)";
                  el.style.boxShadow = "none";
                  el.style.transform = "translateY(0)";
                }}
              >
                <MessageSquare size={16} /> Chat with Seller
              </button>
            </div>

            {/* Divider */}
            <div
              style={{ width: "100%", height: 1, background: "var(--border)" }}
            />

            {/* Product Value Badges */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "var(--accent-dark)",
                    background: "rgba(201, 169, 110, 0.08)",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Award size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                    }}
                  >
                    5-Year Warranty
                  </div>
                  <div
                    style={{ fontSize: "0.72rem", color: "var(--fg-muted)" }}
                  >
                    Guaranteed quality
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    color: "var(--accent-dark)",
                    background: "rgba(201, 169, 110, 0.08)",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <Truck size={18} />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                    }}
                  >
                    Free Assembly
                  </div>
                  <div
                    style={{ fontSize: "0.72rem", color: "var(--fg-muted)" }}
                  >
                    On scheduled delivery
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Highlights Section */}
        <section
          style={{
            marginTop: "5rem",
            borderTop: "1px solid var(--border)",
            paddingTop: "4rem",
          }}
        >
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <div className="section-label" style={{ marginBottom: "0.5rem" }}>
              Craftsmanship
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "var(--fg-primary)",
              }}
            >
              Product Features & Highlights
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Card 1 */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{ color: "var(--accent-dark)", marginBottom: "1rem" }}
              >
                <Award size={24} />
              </div>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Premium Quality
              </h3>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Every piece is hand-selected and crafted with strict attention
                to structural integrity and aesthetic details.
              </p>
            </div>

            {/* Card 2 */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{ color: "var(--accent-dark)", marginBottom: "1rem" }}
              >
                <ShieldCheck size={24} />
              </div>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Durable Materials
              </h3>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Built using resilient raw timbers, reinforced fabrics, and
                coatings that stand up to active daily wear and tear.
              </p>
            </div>

            {/* Card 3 */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{ color: "var(--accent-dark)", marginBottom: "1rem" }}
              >
                <Sparkles size={24} />
              </div>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Modern Design
              </h3>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Clean lines, organic forms, and functional proportions design
                languages that seamlessly accent modern layouts.
              </p>
            </div>

            {/* Card 4 */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.75rem",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <div
                style={{ color: "var(--accent-dark)", marginBottom: "1rem" }}
              >
                <Truck size={24} />
              </div>
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Trusted Purchase
              </h3>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.6,
                }}
              >
                Your order is processed securely. Includes transparent delivery
                updates.
              </p>
            </div>
          </div>
        </section>

        {/* Product Details Tabs Section */}
        <section style={{ marginTop: "5rem" }}>
          {/* Tab Headers */}
          <div
            style={{
              display: "flex",
              borderBottom: "1.5px solid var(--border)",
              gap: "2rem",
              marginBottom: "2rem",
              overflowX: "auto",
              paddingBottom: "0.25rem",
            }}
          >
            {[
              { id: "description", label: "Description" },
              { id: "specifications", label: "Specifications" },
              { id: "shipping", label: "Shipping Information" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "description" | "specifications" | "shipping",
                    )
                  }
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.75rem 0.25rem",
                    fontSize: "0.9375rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "var(--fg-primary)" : "var(--fg-muted)",
                    cursor: "pointer",
                    position: "relative",
                    transition: "color 0.2s ease",
                    outline: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                  {active && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "-2px",
                        left: 0,
                        right: 0,
                        height: "2.5px",
                        background: "var(--accent)",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Panels */}
          <div style={{ minHeight: "180px" }}>
            {/* Description Tab Panel */}
            {activeTab === "description" && (
              <div
                className="animate-fade-in"
                style={{
                  fontSize: "0.9375rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.8,
                }}
              >
                <p style={{ marginBottom: "1rem" }}>{product.description}</p>
                <p>
                  Built by local artisans adhering to LIMATA&apos;s standard
                  simple, premium guidelines. Every corner and finish is
                  carefully examined. This piece complements warm, woodsy
                  environments, minimalist modern rooms, and eclectic
                  configurations alike.
                </p>
              </div>
            )}

            {/* Specifications Tab Panel */}
            {activeTab === "specifications" && (
              <div className="animate-fade-in" style={{ maxWidth: "600px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "0.9rem",
                  }}
                >
                  <tbody>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                          width: "180px",
                        }}
                      >
                        Product ID
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          color: "var(--fg-primary)",
                          fontFamily: "monospace",
                        }}
                      >
                        {product.productId.slice(-5).toUpperCase()}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                        }}
                      >
                        Category
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {product.category}
                      </td>
                    </tr>
                    {product.material && (
                      <tr style={{ borderBottom: "1px solid var(--border)" }}>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            fontWeight: 600,
                            color: "var(--fg-secondary)",
                          }}
                        >
                          Material
                        </td>
                        <td
                          style={{
                            padding: "0.75rem 0",
                            color: "var(--fg-primary)",
                          }}
                        >
                          {product.material}
                        </td>
                      </tr>
                    )}
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          fontWeight: 600,
                          color: "var(--fg-secondary)",
                        }}
                      >
                        Availability
                      </td>
                      <td
                        style={{
                          padding: "0.75rem 0",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {product.stock > 0
                          ? `In Stock (${product.stock} units)`
                          : "Out of Stock"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Shipping Tab Panel */}
            {activeTab === "shipping" && (
              <div
                className="animate-fade-in"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  fontSize: "0.9375rem",
                  color: "var(--fg-secondary)",
                  lineHeight: 1.7,
                }}
              >
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      fontSize: "0.9375rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Delivery Information
                  </h4>
                  <p>
                    We offer premier white-glove shipping on all items. Our
                    professional delivery crew will place the furniture in your
                    preferred room, unwrap, inspect, and complete the physical
                    assembly, carrying away all packing debris.
                  </p>
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 600,
                      color: "var(--fg-primary)",
                      fontSize: "0.9375rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Estimated Delivery
                  </h4>
                  <p>
                    Standard processing takes 2-3 business days. Delivery dates
                    range from 5 to 10 business days depending on location. You
                    will receive a tracking link and a coordinator call to book
                    a delivery timeframe.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Customer Reviews Section */}
        <ProductReviews productId={product.productId} />

        {/* Related Products Section */}
        {!relatedLoading && filteredRelated.length > 0 && (
          <section
            style={{
              marginTop: "6rem",
              borderTop: "1px solid var(--border)",
              paddingTop: "5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: "2.5rem",
              }}
            >
              <div>
                <div
                  className="section-label"
                  style={{ marginBottom: "0.5rem" }}
                >
                  Suggestions
                </div>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 700,
                    color: "var(--fg-primary)",
                  }}
                >
                  You May Also Like
                </h2>
              </div>
              <Link
                href="/products"
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "var(--accent-dark)",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                View Collection →
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {filteredRelated.map((relatedProd) => (
                <ProductCard
                  key={relatedProd.productId}
                  product={relatedProd}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Lightbox / Fullscreen Image Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(10, 8, 5, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            animation: "fadeIn 0.25s ease both",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              color: "#FAF9F7",
              borderRadius: "50%",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s",
              outline: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
          >
            <X size={20} />
          </button>

          {/* Left Arrow */}
          {images.length > 1 && (
            <button
              onClick={handlePrevImage}
              style={{
                position: "absolute",
                left: "1.5rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#FAF9F7",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")
              }
            >
              <ChevronLeft size={20} />
            </button>
          )}

          {/* Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "85vw",
              height: "80vh",
              maxWidth: "1100px",
              cursor: "default",
            }}
          >
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-contain"
              sizes="85vw"
              priority
            />
          </div>

          {/* Right Arrow */}
          {images.length > 1 && (
            <button
              onClick={handleNextImage}
              style={{
                position: "absolute",
                right: "1.5rem",
                background: "rgba(255, 255, 255, 0.08)",
                border: "none",
                color: "#FAF9F7",
                borderRadius: "50%",
                width: "44px",
                height: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "background 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)")
              }
            >
              <ChevronRight size={20} />
            </button>
          )}

          {/* Lightbox Caption */}
          <div
            style={{
              position: "absolute",
              bottom: "1.5rem",
              color: "rgba(250, 249, 247, 0.7)",
              fontSize: "0.85rem",
              background: "rgba(0,0,0,0.5)",
              padding: "0.35rem 1rem",
              borderRadius: "var(--radius-full)",
            }}
          >
            {activeImageIndex + 1} of {images.length}
          </div>
        </div>
      )}

      {/* Embedded Responsive Styles */}
      <style>{`
        .details-grid {
          grid-template-columns: 1.1fr 0.9fr !important;
        }
        @media (max-width: 900px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
