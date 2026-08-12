export interface ReviewUser {
  name: string;
  avatarUrl: string | null;
}

export interface Review {
  reviewId: string;
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: ReviewUser;
}

export interface GetReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export interface ReviewEligibilityResponse {
  isEligible: boolean;
  reason?: "NOT_PURCHASED" | "ALREADY_REVIEWED";
}
