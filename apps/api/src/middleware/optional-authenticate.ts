import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { verifyToken } from "@/lib/jwt";

export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction) {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    // Missing header, allow request as guest
    return next();
  }

  const token = authorizationHeader.slice(7);

  try {
    req.user = verifyToken(token);
    return next();
  } catch {
    // Invalid/expired/malformed JWT
    return next(new ApiError(401, "Invalid or expired token"));
  }
}
