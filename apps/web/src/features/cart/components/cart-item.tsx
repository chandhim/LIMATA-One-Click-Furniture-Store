"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
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

  const { product, quantity, id: itemId } = item;
  const subtotal = product.price * quantity;
  const isUpdating = updateItem.isPending || removeItem.isPending;

  const handleQuantityChange = (newQty: number) => {
    updateItem.mutate({ itemId, quantity: newQty });
  };

  const handleRemove = () => {
    removeItem.mutate(itemId);
  };

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "1.25rem",
        display: "flex",
        gap: "1.25rem",
        alignItems: "center",
        boxShadow: "var(--shadow-sm)",
        opacity: isUpdating ? 0.6 : 1,
        transition: "opacity 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Product Image */}
      <div
        style={{
          position: "relative",
          width: 96,
          height: 96,
          flexShrink: 0,
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
          border: "1px solid var(--border)",
        }}
      >
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="96px"
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
              fontSize: "1.5rem",
            }}
          >
            🪑
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3
          style={{
            fontSize: "0.9375rem",
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
        <div
          style={{
            fontSize: "0.875rem",
            color: "var(--fg-secondary)",
            marginBottom: "0.875rem",
          }}
        >
          Rs.&nbsp;{product.price.toLocaleString()} each
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <QuantitySelector
            value={quantity}
            min={1}
            max={product.stock}
            disabled={isUpdating}
            onChange={handleQuantityChange}
          />

          <div
            className="font-serif"
            style={{
              fontSize: "1rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Rs.&nbsp;{subtotal.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={handleRemove}
        disabled={isUpdating}
        aria-label="Remove item"
        style={{
          alignSelf: "flex-start",
          background: "none",
          border: "none",
          cursor: isUpdating ? "not-allowed" : "pointer",
          color: "var(--fg-muted)",
          padding: "0.375rem",
          borderRadius: "var(--radius-sm)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "color 0.2s ease, background 0.2s ease",
          outline: "none",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.color = "#dc2626";
          (e.currentTarget as HTMLElement).style.background = "rgba(220,38,38,0.06)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
          (e.currentTarget as HTMLElement).style.background = "none";
        }}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
