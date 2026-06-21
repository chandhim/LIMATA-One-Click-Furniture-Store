import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  getProductReviewsController,
  getReviewEligibilityController,
  createReviewController,
} from "./reviews.controller";

export const reviewsRouter = Router({ mergeParams: true });

// Mounted at: /api/products/:productId/reviews
reviewsRouter.get("/", getProductReviewsController);
reviewsRouter.get("/eligibility", authenticate, getReviewEligibilityController);
reviewsRouter.post("/", authenticate, createReviewController);
