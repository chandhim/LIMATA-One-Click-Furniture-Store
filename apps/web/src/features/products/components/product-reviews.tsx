"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useProductReviews, useReviewEligibility } from "../hooks/use-reviews";
import { ReviewForm } from "./review-form";
import { ReviewItem } from "./review-item";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [sortBy, setSortBy] = useState("recent");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: reviewsData, isLoading: reviewsLoading } = useProductReviews(
    productId,
    sortBy,
  );
  const { data: eligibility, isLoading: eligibilityLoading } =
    useReviewEligibility(productId, isAuthenticated);

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.totalReviews || 0;
  const averageRating = reviewsData?.averageRating || 0;

  return (
    <div style={{ marginTop: "4rem" }} id="reviews-section">
      {/* Header section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "1.5rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h2
            className="font-display"
            style={{
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--fg-primary)",
              marginBottom: "0.5rem",
            }}
          >
            Customer Reviews
          </h2>
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}
            >
              <Star size={20} fill="#f59e0b" color="#f59e0b" />
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--fg-primary)",
                }}
              >
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span style={{ color: "var(--border-strong)" }}>|</span>
            <span
              style={{ color: "var(--fg-secondary)", fontSize: "0.9375rem" }}
            >
              {totalReviews} {totalReviews === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>

        {reviews.length > 0 && (
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-full)",
                border: "1px solid var(--border)",
                background: "var(--bg-surface)",
                color: "var(--fg-primary)",
                fontSize: "0.875rem",
                fontWeight: 500,
                outline: "none",
                cursor: "pointer",
                appearance: "none",
                backgroundImage:
                  'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem top 50%",
                backgroundSize: "0.65rem auto",
                paddingRight: "2.5rem",
              }}
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "3rem" }}>
        {/* Left Column: Form / Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {!isAuthenticated ? (
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <MessageSquare
                size={32}
                style={{ color: "var(--fg-muted)", margin: "0 auto 1rem" }}
              />
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                Login to Review
              </h3>
              <p
                style={{
                  color: "var(--fg-secondary)",
                  fontSize: "0.9375rem",
                  marginBottom: "1.5rem",
                }}
              >
                You need to be logged in and have purchased this item to write a
                review.
              </p>
            </div>
          ) : eligibilityLoading ? (
            <div
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "var(--fg-muted)",
              }}
            >
              Checking eligibility...
            </div>
          ) : eligibility?.isEligible ? (
            <ReviewForm productId={productId} />
          ) : (
            <div
              style={{
                background: "var(--bg-surface)",
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border)",
                textAlign: "center",
              }}
            >
              <MessageSquare
                size={32}
                style={{ color: "var(--fg-muted)", margin: "0 auto 1rem" }}
              />
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                }}
              >
                {eligibility?.reason === "ALREADY_REVIEWED"
                  ? "You've reviewed this"
                  : "Only purchasers can review"}
              </h3>
              <p
                style={{ color: "var(--fg-secondary)", fontSize: "0.9375rem" }}
              >
                {eligibility?.reason === "ALREADY_REVIEWED"
                  ? "You have already submitted a review for this product."
                  : "You must purchase and receive this product before you can leave a review."}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Review List */}
        <div>
          {reviewsLoading ? (
            <div
              style={{
                padding: "3rem",
                textAlign: "center",
                color: "var(--fg-muted)",
              }}
            >
              Loading reviews...
            </div>
          ) : reviews.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {reviews.map((review) => (
                <ReviewItem key={review.reviewId} review={review} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: "4rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-surface)",
                borderRadius: "var(--radius-lg)",
                border: "1px dashed var(--border-strong)",
              }}
            >
              <Star
                size={48}
                style={{ color: "var(--border-strong)", marginBottom: "1rem" }}
              />
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "var(--fg-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                No Reviews Yet
              </h3>
              <p style={{ color: "var(--fg-secondary)" }}>
                Be the first to share your thoughts on this product!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
