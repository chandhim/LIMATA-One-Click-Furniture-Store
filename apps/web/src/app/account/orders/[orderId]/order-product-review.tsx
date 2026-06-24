"use client";

import { useState } from "react";
import { useReviewEligibility } from "@/features/products/hooks/use-reviews";
import { ReviewForm } from "@/features/products/components/review-form";
import { Star } from "lucide-react";

interface OrderProductReviewProps {
  productId: string;
  orderStatus: string;
}

export function OrderProductReview({
  productId,
  orderStatus,
}: OrderProductReviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only check eligibility if order is delivered
  const {
    data: eligibility,
    isLoading,
    isError,
  } = useReviewEligibility(productId, orderStatus === "DELIVERED");

  if (orderStatus !== "DELIVERED") {
    return null; // Don't show review option if not delivered
  }

  if (isLoading) {
    return (
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--fg-muted)",
          marginTop: "0.5rem",
        }}
      >
        Checking...
      </div>
    );
  }

  if (eligibility?.reason === "ALREADY_REVIEWED") {
    return (
      <div
        style={{
          marginTop: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          color: "#16a34a",
          fontSize: "0.85rem",
          fontWeight: 500,
        }}
      >
        <Star size={14} fill="#16a34a" />
        You reviewed this item
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ fontSize: "0.8rem", color: "red", marginTop: "0.5rem" }}>
        Error checking eligibility. Please refresh.
      </div>
    );
  }

  if (eligibility && !eligibility.isEligible) {
    return (
      <div
        style={{
          fontSize: "0.8rem",
          color: "var(--fg-muted)",
          marginTop: "0.5rem",
        }}
      >
        Cannot review: {eligibility.reason}
      </div>
    );
  }

  if (!eligibility) {
    return null; // Wait for data
  }

  return (
    <div style={{ marginTop: "1rem", width: "100%" }}>
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          style={{
            background: "transparent",
            border: "1px solid var(--border-strong)",
            color: "var(--fg-primary)",
            padding: "0.5rem 1rem",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent-dark)";
            e.currentTarget.style.color = "var(--accent-dark)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.color = "var(--fg-primary)";
          }}
        >
          <Star size={14} /> Leave a Review
        </button>
      ) : (
        <div style={{ position: "relative", marginTop: "0.5rem" }}>
          <button
            onClick={() => setIsExpanded(false)}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "none",
              border: "none",
              color: "var(--fg-muted)",
              cursor: "pointer",
              fontSize: "0.85rem",
              textDecoration: "underline",
              zIndex: 10,
            }}
          >
            Cancel
          </button>
          <ReviewForm productId={productId} />
        </div>
      )}
    </div>
  );
}
