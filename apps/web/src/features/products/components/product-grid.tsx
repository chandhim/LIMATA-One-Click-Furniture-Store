"use client";

import { ProductCard } from "./product-card";
import type { ProductSummary } from "../types/product.types";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "1.25rem",
      }}
    >
      {products.map((p) => (
        <ProductCard key={p.productId} product={p} />
      ))}
    </div>
  );
}
