export interface Review {
  reviewId: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string | null;
  };
}

export interface GetReviewsResponse {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export interface ReviewEligibilityResponse {
  isEligible: boolean;
  reason?: string;
}
