"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Armchair } from "lucide-react";
import { QuantitySelector } from "./quantity-selector";
import { useUpdateCartItem } from "../hooks/use-update-cart";
import { useRemoveCartItem } from "../hooks/use-remove-cart-item";
import type { CartItem } from "../types/cart.types";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const { product, quantity, cartItemId: itemId } = item;
  const subtotal = product.price * quantity;
  const isUpdating = updateItem.isPending || removeItem.isPending;

  const handleQuantityChange = (newQty: number) => {
    updateItem.mutate({ cartItemId: itemId, quantity: newQty });
  };

  const handleRemove = () => {
    removeItem.mutate(itemId);
  };

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        padding: "1.5rem",
        display: "flex",
        gap: "1.5rem",
        alignItems: "stretch",
        opacity: isUpdating ? 0.6 : 1,
        transition: "opacity 0.2s ease",
        position: "relative",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* Product Image */}
      <Link
        href={`/products/${product.productId}`}
        style={{
          position: "relative",
          width: 140,
          height: 140,
          flexShrink: 0,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
        }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="140px"
            className="object-cover"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--fg-muted)",
            }}
          >
            <Armchair size={48} strokeWidth={1.2} />
          </div>
        )}
      </Link>

      {/* Info & Actions */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        
        {/* Top: Title & Price */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
          <div>
            <Link
              href={`/products/${product.productId}`}
              style={{
                textDecoration: "none",
                color: "var(--fg-primary)",
              }}
            >
              <h3
                style={{
                  fontSize: "1.0625rem",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {product.name}
              </h3>
            </Link>
            <div
              style={{
                fontSize: "0.9375rem",
                color: "var(--fg-secondary)",
                marginTop: "0.25rem",
              }}
            >
              Rs.&nbsp;{product.price.toLocaleString()}
            </div>
          </div>
          
          <div
            className="font-serif font-numeric"
            style={{
              fontSize: "1.125rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Rs.&nbsp;{subtotal.toLocaleString()}
          </div>
        </div>

        {/* Bottom: Quantity & Remove */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "1.5rem",
          }}
        >
          <QuantitySelector
            value={quantity}
            min={1}
            max={product.stock}
            disabled={isUpdating}
            onChange={handleQuantityChange}
          />

          <button
            onClick={handleRemove}
            disabled={isUpdating}
            aria-label="Remove item"
            style={{
              background: "none",
              border: "none",
              cursor: isUpdating ? "not-allowed" : "pointer",
              color: "var(--fg-muted)",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              padding: "0.375rem 0.5rem",
              borderRadius: "var(--radius-sm)",
              transition: "all 0.2s ease",
              outline: "none",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#dc2626";
              (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
              (e.currentTarget as HTMLElement).style.background = "none";
            }}
          >
            <Trash2 size={16} />
            <span style={{ display: "none" }} className="sm:inline">Remove</span>
          </button>
        </div>
      </div>
      
      <style>{`
        @media (min-width: 640px) {
          .sm\\:inline {
            display: inline-block !important;
          }
        }
      `}</style>
    </div>
  );
}
