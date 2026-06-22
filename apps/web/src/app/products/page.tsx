"use client";

import { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePublicCategories } from "@/features/admin/hooks/use-admin";
import { useProducts } from "@/features/products/hooks/use-products";
import { ProductGrid } from "@/features/products/components/product-grid";
import { ProductSearch } from "@/features/products/components/product-search";
import { ProductEmpty } from "@/features/products/components/product-empty";
import { ProductSkeleton } from "@/features/products/components/product-skeleton";
import { CategorySection } from "@/features/products/components/category-section";
import { MainLayout } from "@/components/layout/main-layout";
import type { ProductSummary } from "@/features/products/types/product.types";
import { 
  Sofa, 
  BedDouble, 
  UtensilsCrossed, 
  Briefcase, 
  TreePine, 
  ChefHat, 
  Armchair,
  type LucideIcon 
} from "lucide-react";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Living Room": Sofa,
  "Bedroom": BedDouble,
  "Dining Room": UtensilsCrossed,
  "Office": Briefcase,
  "Outdoor": TreePine,
  "Kitchen": ChefHat,
};

// ── Helper ──────────────────────────────────────────────────────────
function groupByCategory(products: ProductSummary[], categories: { name: string }[]) {
  const map = new Map<string, ProductSummary[]>();
  for (const cat of categories) {
    map.set(cat.name, []);
  }
  for (const p of products) {
    if (map.has(p.category)) {
      map.get(p.category)!.push(p);
    } else {
      map.set(p.category, [p]);
    }
  }
  return map;
}

// ── Page ─────────────────────────────────────────────────────────────
function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || undefined;

  const [search, setSearch] = useState<string>("");
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const debouncedSearch = search.trim().length >= 1 ? search.trim() : undefined;
  const { data, isLoading, isError } = useProducts(debouncedSearch, categoryParam);
  const { data: dbCategories } = usePublicCategories();

  // Map dbCategories to format needed by CategorySidebarNav and pills
  const allCategories = (dbCategories || []).map((c: { name: string; alt?: string }) => {
    const IconComponent = CATEGORY_ICONS[c.name] || Armchair;
    return {
      name: c.name,
      Icon: IconComponent,
    };
  });

  const grouped = data ? groupByCategory(data, allCategories) : null;
  const isSearchMode = !!debouncedSearch || !!categoryParam;

  return (
    <MainLayout>
      {/* ── Hero Header ───────────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-dark)",
          padding: "4.5rem 1.5rem 5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(250,249,247,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />
        {/* Warm glow left */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "-5%",
            width: "30rem",
            height: "20rem",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201,169,110,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        {/* Warm glow right */}
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "5%",
            width: "22rem",
            height: "16rem",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(201,169,110,0.09) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          {/* Label */}
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                width: "1.5rem",
                height: "1.5px",
                background: "var(--accent)",
                display: "block",
              }}
            />
            Our Collection
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--fg-inverse)",
              lineHeight: 1.05,
              marginBottom: "0.75rem",
            }}
          >
            Furniture for
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent) 0%, #E2C07A 50%, var(--accent-dark) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              every room
            </span>
          </h1>

          <p
            style={{
              fontSize: "1rem",
              color: "rgba(250,249,247,0.5)",
              maxWidth: "30rem",
              lineHeight: 1.7,
              marginBottom: "2.5rem",
            }}
          >
            Discover thoughtfully curated pieces — from statement sofas to
            bedroom sanctuaries. Built to last, designed to inspire.
          </p>

          {/* Large hero search */}
          <div style={{ maxWidth: "42rem" }}>
            <ProductSearch
              onSearch={(q) => setSearch(q)}
              placeholder="Search furniture by name, material, room..."
              large
            />
          </div>

          {/* Category pills */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginTop: "1.75rem",
            }}
          >
            {allCategories.map(({ name, Icon }) => {
              const isActive = categoryParam === name;
              return (
              <button
                key={name}
                onClick={() => {
                  if (isActive) {
                    router.push("/products");
                  } else {
                    router.push(`/products?category=${encodeURIComponent(name)}`);
                  }
                }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.4rem 0.875rem",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  border: "1.5px solid",
                  borderColor: isActive ? "rgba(201,169,110,0.55)" : "rgba(255,255,255,0.12)",
                  background: isActive ? "rgba(201,169,110,0.12)" : "rgba(255,255,255,0.06)",
                  color: isActive ? "var(--accent)" : "rgba(250,249,247,0.7)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  fontFamily: "var(--font-sans)",
                  backdropFilter: "blur(6px)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(201,169,110,0.55)";
                  el.style.background = "rgba(201,169,110,0.12)";
                  el.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.12)";
                  el.style.background = "rgba(255,255,255,0.06)";
                  el.style.color = "rgba(250,249,247,0.7)";
                }}
              >
                <Icon size={14} strokeWidth={1.8} />
                {name}
              </button>
            )})}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ─────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-base)",
          minHeight: "70vh",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* ── Loading Skeleton ── */}
          {isLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.375rem",
              }}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          )}

          {/* ── Error ── */}
          {isError && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 2rem",
                background: "var(--bg-surface)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Unable to load products
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)" }}>
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* ── SEARCH MODE: flat results ── */}
          {!isLoading && isSearchMode && (
            <>
              <div
                style={{
                  marginBottom: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.75rem",
                      fontWeight: 700,
                      color: "var(--fg-primary)",
                      letterSpacing: "-0.02em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Search Results
                  </h2>
                  <p style={{ fontSize: "0.875rem", color: "var(--fg-muted)" }}>
                    {data?.length ?? 0} result
                    {(data?.length ?? 0) !== 1 ? "s" : ""}
                    {search ? (
                      <> for &ldquo;<strong style={{ color: "var(--fg-secondary)" }}>{search}</strong>&rdquo;</>
                    ) : null}
                    {categoryParam ? (
                      <> in category <strong style={{ color: "var(--fg-secondary)" }}>{categoryParam}</strong></>
                    ) : null}
                  </p>
                </div>
                <button
                  onClick={() => setSearch("")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.5rem 1rem",
                    borderRadius: "var(--radius-full)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    border: "1.5px solid var(--border)",
                    background: "transparent",
                    color: "var(--fg-secondary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.18s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--accent)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--accent-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "var(--border)";
                    (e.currentTarget as HTMLElement).style.color =
                      "var(--fg-secondary)";
                  }}
                >
                  ← Browse All
                </button>
              </div>

              {data?.length === 0 ? (
                <ProductEmpty />
              ) : (
                data && <ProductGrid products={data} />
              )}
            </>
          )}

          {/* ── BROWSE MODE: category sections (full width) ── */}
          {!isLoading && !isSearchMode && data && (
            <div>
              {allCategories.map(({ name, Icon }) => {
                const products = grouped?.get(name) ?? [];
                if (products.length === 0) return null; // Don't show empty sections
                return (
                  <div
                    key={name}
                    ref={(el) => {
                      if (el) sectionRefs.current.set(name, el);
                      else sectionRefs.current.delete(name);
                    }}
                  >
                    <CategorySection
                      category={name}
                      Icon={Icon}
                      products={products}
                    />
                  </div>
                );
              })}

              {/* All sections empty */}
              {data.length === 0 && <ProductEmpty />}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<MainLayout><div style={{ padding: "5rem", textAlign: "center", minHeight: "70vh" }}>Loading...</div></MainLayout>}>
      <ProductsPageContent />
    </Suspense>
  );
}
