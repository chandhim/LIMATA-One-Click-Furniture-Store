"use client";

import { useState } from "react";
import { MainLayout }         from "@/components/layout/main-layout";
import { useProducts }        from "@/features/products/hooks/use-products";
import { useProductFilters }  from "@/features/products/hooks/use-product-filters";
import { ProductGrid }        from "@/features/products/components/product-grid";
import { ProductSearch }      from "@/features/products/components/product-search";
import { ProductSkeleton }    from "@/features/products/components/product-skeleton";
import { ProductEmpty }       from "@/features/products/components/product-empty";
import { FilterBar }          from "@/features/products/components/filter-bar";
import { FilterDrawer }       from "@/features/products/components/filter-drawer";
import { ActiveFilterChips }  from "@/features/products/components/active-filter-chips";
import { Pagination }         from "@/features/products/components/pagination";
import { SortSelect }         from "@/features/products/components/sort-select";

export default function ProductsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    filters, queryFilters, debouncedSearch,
    activeFilterCount, hasActiveFilters, limit,
    setSearch, setCategory, setMaterial,
    setMinPrice, setMaxPrice, toggleInStock,
    setSort, setPage, clearAll,
  } = useProductFilters();

  const { data, isLoading, isError, isFetching } = useProducts(queryFilters);

  const products = data?.products ?? [];
  const total    = data?.total    ?? 0;

  return (
    <MainLayout>
      {/* ── Hero Header ───────────────────────────────────────────── */}
      <div
        style={{
          background: "var(--bg-dark)",
          padding:    "4rem 1.5rem 3rem",
          position:   "relative",
          overflow:   "hidden",
        }}
      >
        {/* Dot pattern */}
        <div style={{
          position:        "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(250,249,247,0.04) 1px, transparent 1px)",
          backgroundSize:  "28px 28px",
        }} />
        {/* Warm glow */}
        <div style={{
          position:   "absolute", top: "50%", right: "10%",
          transform:  "translateY(-50%)",
          width:      "24rem", height: "16rem", borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(201,169,110,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>
          <div className="section-label" style={{ marginBottom: "0.875rem" }}>Our Collection</div>
          <h1
            style={{
              fontFamily:    "var(--font-serif)",
              fontSize:      "clamp(2rem, 4vw, 3rem)",
              fontWeight:    700,
              letterSpacing: "-0.03em",
              color:         "var(--fg-inverse)",
              lineHeight:    1.1,
              marginBottom:  "0.625rem",
            }}
          >
            All Products
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "rgba(250,249,247,0.55)", maxWidth: "28rem" }}>
            Carefully curated pieces for every room in your home.
          </p>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-base)", minHeight: "60vh", padding: "2.5rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

          {/* ── Search Row ── */}
          <div style={{ marginBottom: "1rem" }}>
            <ProductSearch value={filters.search} onChange={setSearch} />
          </div>

          {/* ── Desktop Filter Bar (hidden on mobile) ── */}
          <div className="hide-mobile" style={{ marginBottom: "1rem" }}>
            <FilterBar
              category={filters.category}
              material={filters.material}
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              inStock={filters.inStock}
              sort={filters.sort}
              onCategory={setCategory}
              onMaterial={setMaterial}
              onMinPrice={setMinPrice}
              onMaxPrice={setMaxPrice}
              onInStock={toggleInStock}
              onSort={setSort}
            />
          </div>

          {/* ── Mobile: Filter button + Sort ── */}
          <div
            className="hide-desktop"
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        "0.625rem",
              marginBottom: "1rem",
            }}
          >
            <button
              id="mobile-filter-btn"
              onClick={() => setDrawerOpen(true)}
              style={{
                display:      "flex",
                alignItems:   "center",
                gap:          "0.5rem",
                padding:      "0.625rem 1.125rem",
                background:   "var(--bg-surface)",
                border:       "1.5px solid var(--border)",
                borderRadius: "var(--radius-full)",
                fontSize:     "0.875rem",
                fontWeight:   600,
                color:        "var(--fg-primary)",
                cursor:       "pointer",
                transition:   "border-color 0.2s",
                position:     "relative",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  background:   "var(--accent)",
                  color:        "#fff",
                  borderRadius: "var(--radius-full)",
                  fontSize:     "0.65rem",
                  fontWeight:   700,
                  padding:      "0.1rem 0.4rem",
                  lineHeight:   1.4,
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div style={{ flex: 1 }} />
            <SortSelect value={filters.sort} onChange={setSort} />
          </div>

          {/* ── Active Filter Chips ── */}
          {hasActiveFilters && (
            <div style={{ marginBottom: "1.25rem" }}>
              <ActiveFilterChips
                category={filters.category}
                material={filters.material}
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                inStock={filters.inStock}
                sort={filters.sort}
                debouncedSearch={debouncedSearch}
                onClearCategory={() => setCategory("")}
                onClearMaterial={() => setMaterial("")}
                onClearMinPrice={() => setMinPrice("")}
                onClearMaxPrice={() => setMaxPrice("")}
                onClearInStock={toggleInStock}
                onClearSort={() => setSort("newest")}
                onClearAll={clearAll}
              />
            </div>
          )}

          {/* ── Results Count ── */}
          {!isLoading && data && (
            <div
              style={{
                display:       "flex",
                alignItems:    "center",
                gap:           "0.5rem",
                fontSize:      "0.875rem",
                color:         "var(--fg-muted)",
                marginBottom:  "1.5rem",
                opacity:       isFetching ? 0.5 : 1,
                transition:    "opacity 0.2s",
              }}
            >
              <strong style={{ color: "var(--fg-primary)", fontWeight: 700, fontSize: "1rem" }}>
                {total.toLocaleString()}
              </strong>
              <span>{total === 1 ? "product" : "products"} found</span>
              {isFetching && (
                <span style={{ fontSize: "0.75rem", color: "var(--accent)", marginLeft: "0.25rem" }}>
                  — updating…
                </span>
              )}
            </div>
          )}

          {/* ── Skeleton Loading ── */}
          {isLoading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.25rem" }}>
              {Array.from({ length: 12 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {/* ── Error State ── */}
          {isError && (
            <div style={{
              textAlign: "center", padding: "4rem 2rem",
              background: "var(--bg-surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⚠️</div>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
                Unable to load products
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--fg-secondary)" }}>
                Please check your connection and try again.
              </p>
            </div>
          )}

          {/* ── Empty State ── */}
          {!isLoading && !isError && products.length === 0 && (
            <ProductEmpty hasFilters={hasActiveFilters} onClearFilters={clearAll} />
          )}

          {/* ── Product Grid ── */}
          {!isLoading && products.length > 0 && (
            <ProductGrid products={products} />
          )}

          {/* ── Pagination ── */}
          {!isLoading && total > limit && (
            <Pagination
              page={filters.page}
              total={total}
              limit={limit}
              onPage={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        category={filters.category}
        material={filters.material}
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        inStock={filters.inStock}
        sort={filters.sort}
        activeFilterCount={activeFilterCount}
        onCategory={setCategory}
        onMaterial={setMaterial}
        onMinPrice={setMinPrice}
        onMaxPrice={setMaxPrice}
        onInStock={toggleInStock}
        onSort={setSort}
        onClearAll={clearAll}
      />

      {/* ── Responsive helpers ── */}
      <style>{`
        .hide-mobile  { display: block; }
        .hide-desktop { display: none;  }

        @media (max-width: 768px) {
          .hide-mobile  { display: none !important;  }
          .hide-desktop { display: flex !important;  }
        }
      `}</style>
    </MainLayout>
  );
}
