import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorWithStatus = Error & {
  statusCode?: number;
};

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues[0]?.message ?? "Validation failed",
    });
  }

  const typedError = error as ErrorWithStatus;
  const statusCode = typedError.statusCode ?? 500;
  const message = typedError.message ?? "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}