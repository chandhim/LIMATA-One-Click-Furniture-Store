"use client";

interface PaginationProps {
  page:    number;
  total:   number;
  limit:   number;
  onPage:  (p: number) => void;
}

export function Pagination({ page, total, limit, onPage }: PaginationProps) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  // Build visible page window: always show first, last, and up to 3 around current
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  const btnBase: React.CSSProperties = {
    minWidth:     "2.25rem",
    height:       "2.25rem",
    display:      "flex",
    alignItems:   "center",
    justifyContent: "center",
    borderRadius: "var(--radius-md)",
    border:       "1.5px solid var(--border)",
    background:   "var(--bg-surface)",
    fontSize:     "0.875rem",
    fontWeight:   500,
    color:        "var(--fg-secondary)",
    cursor:       "pointer",
    padding:      "0 0.5rem",
    transition:   "all 0.18s ease",
    fontFamily:   "var(--font-sans)",
  };

  const activeStyle: React.CSSProperties = {
    ...btnBase,
    background:  "var(--fg-primary)",
    borderColor: "var(--fg-primary)",
    color:       "var(--fg-inverse)",
    fontWeight:  700,
    cursor:      "default",
  };

  const disabledStyle: React.CSSProperties = {
    ...btnBase,
    opacity:     0.35,
    cursor:      "not-allowed",
  };

  return (
    <nav
      aria-label="Pagination"
      style={{
        display:        "flex",
        justifyContent: "center",
        alignItems:     "center",
        gap:            "0.375rem",
        marginTop:      "3rem",
        flexWrap:       "wrap",
      }}
    >
      {/* Prev */}
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        style={page === 1 ? disabledStyle : btnBase}
        onMouseEnter={(e) => { if (page > 1) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-secondary)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Pages */}
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} style={{ padding: "0 0.25rem", color: "var(--fg-muted)", fontSize: "0.875rem" }}>…</span>
        ) : (
          <button
            key={p}
            onClick={() => p !== page && onPage(p)}
            style={p === page ? activeStyle : btnBase}
            onMouseEnter={(e) => { if (p !== page) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}}
            onMouseLeave={(e) => { if (p !== page) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-secondary)"; }}}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        style={page === totalPages ? disabledStyle : btnBase}
        onMouseEnter={(e) => { if (page < totalPages) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent-dark)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--fg-secondary)"; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Page info */}
      <span style={{ marginLeft: "0.5rem", fontSize: "0.8rem", color: "var(--fg-muted)" }}>
        Page {page} of {totalPages}
      </span>
    </nav>
  );
}
