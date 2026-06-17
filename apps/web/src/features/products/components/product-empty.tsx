"use client";

interface ProductEmptyProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

export function ProductEmpty({ hasFilters = false, onClearFilters }: ProductEmptyProps) {
  return (
    <div
      style={{
        textAlign:    "center",
        padding:      "5rem 2rem",
        background:   "var(--bg-surface)",
        border:       "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        animation:    "fadeIn 0.35s ease both",
      }}
    >
      <div style={{ fontSize: "3.5rem", marginBottom: "1.25rem", opacity: 0.45 }}>
        {hasFilters ? "🔍" : "🛋️"}
      </div>

      <h3
        style={{
          fontFamily:    "var(--font-serif)",
          fontSize:      "1.375rem",
          fontWeight:    600,
          color:         "var(--fg-primary)",
          marginBottom:  "0.625rem",
          letterSpacing: "-0.01em",
        }}
      >
        {hasFilters ? "No products match your filters" : "No products found"}
      </h3>

      <p
        style={{
          fontSize:  "0.9375rem",
          color:     "var(--fg-secondary)",
          lineHeight: 1.6,
          maxWidth:  "26rem",
          margin:    "0 auto 1.75rem",
        }}
      >
        {hasFilters
          ? "Try adjusting or removing some filters to see more results."
          : "Our catalogue is being updated. Check back soon."}
      </p>

      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          style={{
            padding:      "0.625rem 1.5rem",
            background:   "var(--fg-primary)",
            border:       "none",
            borderRadius: "var(--radius-full)",
            fontSize:     "0.875rem",
            fontWeight:   600,
            color:        "var(--fg-inverse)",
            cursor:       "pointer",
            transition:   "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform  = "translateY(-2px)";
            e.currentTarget.style.boxShadow  = "var(--shadow-md)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform  = "translateY(0)";
            e.currentTarget.style.boxShadow  = "none";
          }}
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
