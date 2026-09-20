import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { verifyToken } from "@/lib/jwt";

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    return next(new ApiError(401, "You need to be logged in to access this page. Please sign in and try again."));
  }

  const token = authorizationHeader.slice(7);

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    return next(new ApiError(401, "Your session has expired. Please sign in again to continue."));
  }
}
