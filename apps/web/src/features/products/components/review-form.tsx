import { useState } from "react";
import { Star } from "lucide-react";
import { useSubmitReview } from "../hooks/use-reviews";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutate: submitReview, isPending, error } = useSubmitReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    submitReview(
      { productId, rating, title, comment },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      },
    );
  };

  if (isSubmitted) {
    return (
      <div
        style={{
          background: "rgba(34, 197, 94, 0.05)",
          border: "1px solid rgba(34, 197, 94, 0.2)",
          borderRadius: "var(--radius-lg)",
          padding: "2rem",
          textAlign: "center",
          color: "var(--fg-primary)",
        }}
      >
        <div style={{ color: "#16a34a", marginBottom: "0.5rem" }}>
          <Star size={32} fill="#16a34a" />
        </div>
        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 600,
            marginBottom: "0.5rem",
          }}
        >
          Review Submitted
        </h3>
        <p style={{ color: "var(--fg-secondary)", fontSize: "0.9375rem" }}>
          Thank you for sharing your experience! Your review is pending approval
          and will be visible shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Write a Review
        </h3>
        <p style={{ fontSize: "0.875rem", color: "var(--fg-secondary)" }}>
          Share your thoughts with other customers.
        </p>
      </div>

      {error && (
        <div
          style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            background: "rgba(239, 68, 68, 0.1)",
            padding: "0.75rem",
            borderRadius: "var(--radius-md)",
          }}
        >
          {error instanceof Error
            ? error.message
            : "Failed to submit review. Please try again."}
        </div>
      )}

      <div>
        <label
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Overall Rating *
        </label>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
                color:
                  (hoverRating || rating) >= star
                    ? "#f59e0b"
                    : "var(--border-strong)",
                transition: "color 0.2s",
              }}
            >
              <Star
                size={28}
                fill={(hoverRating || rating) >= star ? "#f59e0b" : "none"}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="title"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Review Title *
        </label>
        <input
          id="title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum up your experience"
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-strong)",
            background: "var(--bg-base)",
            color: "var(--fg-primary)",
            fontSize: "0.9375rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent-dark)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
        />
      </div>

      <div>
        <label
          htmlFor="comment"
          style={{
            display: "block",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--fg-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Your Review *
        </label>
        <textarea
          id="comment"
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us what you liked or disliked about this product"
          rows={4}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-strong)",
            background: "var(--bg-base)",
            color: "var(--fg-primary)",
            fontSize: "0.9375rem",
            outline: "none",
            resize: "vertical",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent-dark)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0 || !title || !comment || isPending}
        style={{
          background: "var(--bg-dark)",
          color: "var(--accent-light)",
          border: "none",
          borderRadius: "var(--radius-full)",
          padding: "0.875rem 2rem",
          fontSize: "0.9375rem",
          fontWeight: 600,
          cursor:
            rating === 0 || !title || !comment || isPending
              ? "not-allowed"
              : "pointer",
          opacity: rating === 0 || !title || !comment || isPending ? 0.6 : 1,
          transition: "opacity 0.2s",
          alignSelf: "flex-start",
        }}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
