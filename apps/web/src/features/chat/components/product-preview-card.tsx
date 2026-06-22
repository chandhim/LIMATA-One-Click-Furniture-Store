"use client";

import Image from "next/image";
import Link from "next/link";
import { useProduct } from "@/features/products/hooks/use-product";
import { ArrowRight, Loader2 } from "lucide-react";

interface ProductPreviewCardProps {
  productId: string;
  isMine: boolean;
}

export function ProductPreviewCard({
  productId,
  isMine,
}: ProductPreviewCardProps) {
  const { data: product, isLoading, isError } = useProduct(productId);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "1rem",
          background: isMine ? "rgba(255,255,255,0.1)" : "var(--bg-surface)",
          borderRadius: "var(--radius-md)",
          border: isMine
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid var(--border)",
          color: isMine ? "#fff" : "var(--fg-primary)",
        }}
      >
        <Loader2 size={16} className="animate-spin" />
        <span style={{ fontSize: "0.85rem" }}>Loading product...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div
        style={{
          padding: "1rem",
          background: isMine ? "rgba(255,255,255,0.1)" : "var(--bg-surface)",
          borderRadius: "var(--radius-md)",
          border: isMine
            ? "1px solid rgba(255,255,255,0.2)"
            : "1px solid var(--border)",
          color: isMine ? "#fff" : "var(--fg-primary)",
          fontSize: "0.85rem",
        }}
      >
        Product no longer available.
      </div>
    );
  }

  return (
    <Link
      href={`/products/${productId}`}
      style={{
        display: "block",
        textDecoration: "none",
        background: isMine ? "var(--bg-surface)" : "var(--bg-elevated)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        boxShadow: "var(--shadow-sm)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        color: "var(--fg-primary)",
        width: "100%",
        maxWidth: "280px",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-2px)";
        el.style.boxShadow = "var(--shadow-md)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "var(--shadow-sm)";
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          position: "relative",
          background: "linear-gradient(135deg, #F5EFE6 0%, #EDE0CC 100%)",
        }}
      >
        {product.images && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="280px"
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
              fontSize: "0.75rem",
            }}
          >
            No image
          </div>
        )}
      </div>

      <div style={{ padding: "0.875rem" }}>
        <h4
          style={{
            margin: "0 0 0.25rem 0",
            fontSize: "0.875rem",
            fontWeight: 700,
            color: "var(--fg-primary)",
            lineHeight: 1.3,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h4>
        <p
          className="font-serif font-numeric"
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--accent-dark)",
          }}
        >
          Rs. {product.price.toLocaleString()}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--fg-secondary)",
          }}
        >
          View details <ArrowRight size={12} />
        </div>
      </div>
    </Link>
  );
}
