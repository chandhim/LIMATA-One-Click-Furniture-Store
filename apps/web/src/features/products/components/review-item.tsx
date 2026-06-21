import { Star, ShieldCheck } from "lucide-react";
import type { Review } from "../types/review.types";
import Image from "next/image";

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{
      padding: "2rem 0",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Avatar */}
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--bg-dark)",
            color: "var(--fg-inverse)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.125rem",
            fontWeight: 600,
            overflow: "hidden",
            position: "relative"
          }}>
            {review.user.avatarUrl ? (
              <Image src={review.user.avatarUrl} alt={review.user.name} fill className="object-cover" />
            ) : (
              review.user.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.25rem" }}>
              {review.user.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", color: "#16a34a", fontSize: "0.75rem", fontWeight: 500 }}>
                <ShieldCheck size={14} style={{ marginRight: "0.25rem" }} />
                Verified Purchase
              </div>
              <span style={{ color: "var(--border-strong)" }}>•</span>
              <span style={{ fontSize: "0.75rem", color: "var(--fg-muted)" }}>{date}</span>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div style={{ display: "flex", gap: "0.125rem" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={16}
              fill={review.rating >= star ? "#f59e0b" : "none"}
              color={review.rating >= star ? "#f59e0b" : "var(--border-strong)"}
            />
          ))}
        </div>
      </div>

      <div>
        <h4 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--fg-primary)", marginBottom: "0.5rem" }}>
          {review.title}
        </h4>
        <p style={{ fontSize: "0.9375rem", color: "var(--fg-secondary)", lineHeight: 1.6 }}>
          {review.comment}
        </p>
      </div>
    </div>
  );
}
