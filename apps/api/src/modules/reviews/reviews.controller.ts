import type { NextFunction, Request, Response } from "express";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/shared/errors/api-error";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

export async function getProductReviewsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const { sort = "recent" } = req.query; // recent, highest, lowest

    const orderBy: any = {};
    if (sort === "highest") {
      orderBy.rating = "desc";
    } else if (sort === "lowest") {
      orderBy.rating = "asc";
    } else {
      orderBy.createdAt = "desc";
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      orderBy,
      include: {
        user: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    const totalReviews = await prisma.review.count({
      where: {
        productId,
        isApproved: true,
      },
    });

    const averageRatingRaw = await prisma.review.aggregate({
      where: { productId, isApproved: true },
      _avg: { rating: true },
    });

    const averageRating = averageRatingRaw._avg.rating || 0;

    return sendResponse(res, 200, {
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReviewEligibilityController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    // 1. Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      return sendResponse(res, 200, { isEligible: false, reason: "ALREADY_REVIEWED" });
    }

    // 2. Check if user has purchased the product and order is DELIVERED
    const orderWithProduct = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          orderStatus: "DELIVERED",
        },
      },
    });

    if (!orderWithProduct) {
      return sendResponse(res, 200, { isEligible: false, reason: "NOT_PURCHASED" });
    }

    return sendResponse(res, 200, { isEligible: true });
  } catch (error) {
    return next(error);
  }
}

export async function createReviewController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { productId } = req.params;
    const userId = req.user?.userId;
    const { rating, title, comment } = req.body;

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    if (!rating || !title || !comment) {
      throw new ApiError(400, "Rating, title, and comment are required");
    }

    if (rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    // 1. Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    });

    if (existingReview) {
      throw new ApiError(400, "You have already reviewed this product");
    }

    // 2. Check if user has purchased the product and order is DELIVERED
    const orderWithProduct = await prisma.orderItem.findFirst({
      where: {
        productId,
        order: {
          userId,
          orderStatus: "DELIVERED",
        },
      },
    });

    if (!orderWithProduct) {
      throw new ApiError(403, "You must purchase and receive this product to review it");
    }

    // 3. Create Review
    const newReview = await prisma.review.create({
      data: {
        productId,
        userId,
        rating: Number(rating),
        title,
        comment,
        isApproved: false, // requires admin approval
      },
    });

    return sendResponse(res, 201, newReview);
  } catch (error) {
    return next(error);
  }
}
