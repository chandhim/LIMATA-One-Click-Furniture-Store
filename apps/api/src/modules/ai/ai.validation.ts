import { ApiError } from "@/shared/errors/api-error";
import type { Request } from "express";

/**
 * Transport-level validation to ensure file presence and correct MIME types 
 * for endpoints requiring image uploads.
 */
export function validateFileUpload(req: Request) {
  if (!req.file) {
    throw new ApiError(400, "No file uploaded.");
  }
  
  const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validMimes.includes(req.file.mimetype)) {
    throw new ApiError(400, `Invalid file type: ${req.file.mimetype}. Allowed types: JPEG, PNG, WEBP.`);
  }
}

export function validateRecommendRequest(req: Request) {
  if (!req.body || typeof req.body !== 'object') {
    throw new ApiError(400, "Invalid request body.");
  }
  if (!req.body.preferences || typeof req.body.preferences !== 'object') {
    throw new ApiError(400, "Missing or invalid 'preferences' in request body.");
  }
}

export function validatePlacementRequest(req: Request) {
  validateFileUpload(req);
  if (!req.body.productId || typeof req.body.productId !== 'string') {
    throw new ApiError(400, "Missing or invalid 'productId' in request body.");
  }
}
