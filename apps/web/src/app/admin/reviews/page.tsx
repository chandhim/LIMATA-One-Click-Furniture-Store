"use client";

import { useAdminReviews, useToggleReviewApproval, useDeleteReview } from "@/features/admin/hooks/use-admin";
import Image from "next/image";
import { Star, MessageSquare, Check, EyeOff, Trash2 } from "lucide-react";

interface AdminReview {
  id: string;
  rating: number;
  comment: string;
  isApproved?: boolean;
  createdAt: string;
  product?: {
    id: string;
    name: string;
    images?: string[];
  };
  user?: {
    name: string;
    email: string;
  };
}

export default function AdminReviewsPage() {
  const { data: reviews = [], isLoading } = useAdminReviews();
  const toggleApprovalMutation = useToggleReviewApproval();
  const deleteReviewMutation = useDeleteReview();

  async function handleToggleApproval(id: string, currentApproval: boolean) {
    try {
      await toggleApprovalMutation.mutateAsync({ id, isApproved: !currentApproval });
    } catch (err) {
      console.error("Failed to toggle review approval:", err);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this review? This action is permanent.")) {
      try {
        await deleteReviewMutation.mutateAsync(id);
      } catch (err) {
        console.error("Failed to delete review:", err);
      }
    }
  }

  if (isLoading) {
    return (
      <div 
        style={{ 
          padding: "4rem", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          minHeight: "80vh", 
          color: "var(--fg-muted)", 
          gap: "0.75rem",
          background: "var(--bg-base)"
        }}
      >
        <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--accent)", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
        <span>Loading reviews...</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: 1400, margin: "0 auto", background: "var(--bg-base)", minHeight: "100vh" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div className="section-label" style={{ marginBottom: "0.75rem" }}>Reviews</div>
        <h1 className="font-display" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--fg-primary)", letterSpacing: "-0.025em" }}>
          Reviews Moderation
        </h1>
        <p style={{ marginTop: "0.375rem", fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Moderate customer product feedback, approve helpful reviews, or remove inappropriate entries.
        </p>
      </div>

      {/* Reviews Table Container */}
      <div 
        style={{ 
          background: "var(--bg-surface)", 
          border: "1px solid var(--border)", 
          borderRadius: "var(--radius-lg)", 
          overflow: "hidden",
          boxShadow: "var(--shadow-sm)"
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border)" }}>
                {["Product Details", "Customer Info", "Rating Score", "Review Comment", "Status Badge", "Moderation Actions"].map((h) => (
                  <th key={h} style={{ padding: "1rem 1.5rem", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--fg-secondary)", whiteSpace: "nowrap" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "5rem", textAlign: "center", color: "var(--fg-muted)", fontSize: "0.875rem" }}>
                    <MessageSquare size={32} style={{ color: "var(--fg-muted)", opacity: 0.3, marginBottom: "1rem" }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>No reviews submitted yet.</p>
                  </td>
                </tr>
              ) : (
                reviews.map((item: AdminReview, idx: number) => {
                  const isApproved = item.isApproved !== false;
                  const itemDate = new Date(item.createdAt).toLocaleDateString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                  const initials = item.user?.name?.[0]?.toUpperCase() ?? "C";

                  return (
                    <tr
                      key={item.id}
                      style={{ borderBottom: idx < reviews.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.2s ease" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(250,249,247,0.4)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                    >
                      {/* Product */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: "var(--radius-md)",
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border)",
                              overflow: "hidden",
                              position: "relative",
                              flexShrink: 0,
                              boxShadow: "var(--shadow-sm)"
                            }}
                          >
                            {item.product?.images?.[0] ? (
                              <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: "cover" }} unoptimized />
                            ) : (
                              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "1.25rem" }}>
                                📦
                              </div>
                            )}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--fg-primary)" }}>{item.product?.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: "0.125rem" }}>ID: {item.product?.id.slice(-8).toUpperCase()}</div>
                          </div>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              background: "var(--bg-elevated)",
                              border: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "var(--fg-secondary)",
                              flexShrink: 0
                            }}
                          >
                            {initials}
                          </div>
                          <div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg-primary)" }}>{item.user?.name}</div>
                            <div style={{ fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: "0.05rem" }}>{item.user?.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Rating Score */}
                      <td style={{ padding: "1.25rem 1.5rem", whiteSpace: "nowrap" }}>
                        <div style={{ display: "flex", gap: "0.125rem", color: "var(--accent)" }}>
                          {[1, 2, 3, 4, 5].map((starIdx) => (
                            <Star
                              key={starIdx}
                              size={14}
                              fill={starIdx <= item.rating ? "var(--accent)" : "none"}
                              style={{
                                filter: starIdx <= item.rating ? "drop-shadow(0 1px 2px rgba(201,169,110,0.3))" : "none",
                                strokeWidth: 1.5
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--fg-muted)", marginTop: "0.25rem", fontWeight: 600 }}>
                          {item.rating} / 5 Score
                        </div>
                      </td>

                      {/* Review Comment */}
                      <td style={{ padding: "1.25rem 1.5rem", maxWidth: "24rem" }}>
                        <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--fg-primary)", lineHeight: 1.5, wordBreak: "break-word" }}>
                          &ldquo;{item.comment}&rdquo;
                        </p>
                        <span style={{ display: "block", fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: "0.375rem" }}>
                          Posted on {itemDate}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            padding: "0.2rem 0.625rem",
                            borderRadius: "var(--radius-full)",
                            background: isApproved ? "rgba(74,166,120,0.12)" : "rgba(220,160,80,0.08)",
                            color: isApproved ? "#276e47" : "#a85f10",
                            border: `1px solid ${isApproved ? "rgba(74,166,120,0.2)" : "rgba(220,160,80,0.15)"}`
                          }}
                        >
                          {isApproved ? "Approved" : "Pending Action"}
                        </span>
                      </td>

                      {/* Moderation Actions */}
                      <td style={{ padding: "1.25rem 1.5rem" }}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleToggleApproval(item.id, isApproved)}
                            style={{
                              padding: "0.4rem 0.875rem",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: isApproved ? "var(--fg-secondary)" : "var(--accent-dark)",
                              background: "var(--bg-surface)",
                              border: "1px solid var(--border)",
                              borderRadius: "var(--radius-full)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              if (isApproved) {
                                el.style.background = "var(--bg-elevated)";
                                el.style.borderColor = "var(--border-strong)";
                              } else {
                                el.style.background = "rgba(201,169,110,0.08)";
                                el.style.borderColor = "var(--accent)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "var(--bg-surface)";
                              el.style.borderColor = "var(--border)";
                            }}
                          >
                            {isApproved ? (
                              <>
                                <EyeOff size={12} />
                                <span>Hide Review</span>
                              </>
                            ) : (
                              <>
                                <Check size={12} />
                                <span>Approve Review</span>
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            style={{
                              padding: "0.4rem 0.875rem",
                              fontSize: "0.78rem",
                              fontWeight: 700,
                              color: "rgba(220,80,80,0.85)",
                              background: "rgba(220,80,80,0.05)",
                              border: "1px solid rgba(220,80,80,0.18)",
                              borderRadius: "var(--radius-full)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.35rem",
                              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                              whiteSpace: "nowrap",
                            }}
                            onMouseEnter={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "rgba(220,80,80,0.12)";
                              el.style.color = "#c0392b";
                              el.style.borderColor = "rgba(220,80,80,0.25)";
                            }}
                            onMouseLeave={(e) => {
                              const el = e.currentTarget as HTMLElement;
                              el.style.background = "rgba(220,80,80,0.05)";
                              el.style.color = "rgba(220,80,80,0.85)";
                              el.style.borderColor = "rgba(220,80,80,0.18)";
                            }}
                          >
                            <Trash2 size={12} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
