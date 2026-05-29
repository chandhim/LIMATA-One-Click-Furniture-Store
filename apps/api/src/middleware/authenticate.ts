import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { verifyToken } from "@/utils/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "Unauthorized"));
  }

  const token = authorizationHeader.slice(7);

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new ApiError(401, "Invalid or expired token"));
  }
}