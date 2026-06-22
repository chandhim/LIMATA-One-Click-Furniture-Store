"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/features/products/hooks/use-product";
import { MainLayout } from "@/components/layout/main-layout";
import { ProductDetailsView } from "@/features/products/components/product-details-view";
import { ProductDetailsSkeleton } from "@/features/products/components/product-details-skeleton";
import { Armchair } from "lucide-react";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const { data: product, isLoading, isError } = useProduct(productId);
  const router = useRouter();

  if (isLoading) {
    return (
      <MainLayout>
        <ProductDetailsSkeleton />
      </MainLayout>
    );
  }

  if (isError || !product) {
    return (
      <MainLayout>
        <div style={{ background: "var(--bg-base)", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "center", color: "var(--fg-muted)", marginBottom: "1.5rem" }}>
              <Armchair size={64} strokeWidth={1.2} />
            </div>
            <h1 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--fg-primary)", marginBottom: "0.75rem" }}>
              Product Not Found
            </h1>
            <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)", marginBottom: "2rem", lineHeight: 1.6 }}>
              The furniture piece you are looking for might have been moved, sold out, or is temporarily unavailable.
            </p>
            <button
              onClick={() => router.push("/products")}
              style={{
                background: "var(--bg-dark)",
                color: "var(--fg-inverse)",
                border: "none",
                borderRadius: "var(--radius-full)",
                padding: "0.75rem 2rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "opacity 0.2s",
                outline: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Back To Products
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ProductDetailsView product={product} />
    </MainLayout>
  );
}
