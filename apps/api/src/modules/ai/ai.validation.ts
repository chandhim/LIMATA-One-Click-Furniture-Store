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
