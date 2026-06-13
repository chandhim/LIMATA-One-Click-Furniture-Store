import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
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
  // Zod validation errors
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: error.issues[0]?.message ?? "Validation failed",
    });
  }

  // Prisma — DB unreachable / connection failure
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error("[Prisma] Initialization error:", error.message);
    return res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable. Please try again shortly.",
    });
  }

  // Prisma — known request errors (constraint violations, not found, etc.)
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.error("[Prisma] Request error:", error.code, error.message);

    switch (error.code) {
      case "P2002":
        // Unique constraint violation
        return res.status(409).json({
          success: false,
          message: "A record with that value already exists.",
        });
      case "P2025":
        // Record not found
        return res.status(404).json({
          success: false,
          message: "Record not found.",
        });
      default:
        return res.status(500).json({
          success: false,
          message: "A database error occurred.",
        });
    }
  }

  // Prisma — validation errors from Prisma client
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("[Prisma] Validation error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Invalid data provided.",
    });
  }

  // Generic API errors and unexpected errors
  const typedError = error as ErrorWithStatus;
  const statusCode = typedError.statusCode ?? 500;
  const message = typedError.message ?? "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}
