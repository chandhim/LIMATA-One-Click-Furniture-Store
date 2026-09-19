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
      message: error.issues[0]?.message ?? "Some of the information you entered is invalid. Please check your details and try again.",
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
          message: "This information is already in use. Please try a different value.",
        });
      case "P2025":
        // Record not found
        return res.status(404).json({
          success: false,
          message: "The item you are looking for could not be found.",
        });
      default:
        return res.status(500).json({
          success: false,
          message: "Something went wrong on our end. Please try again later.",
        });
    }
  }

  // Prisma — validation errors from Prisma client
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("[Prisma] Validation error:", error.message);
    return res.status(400).json({
      success: false,
      message: "Some of the information you submitted is invalid. Please check and try again.",
    });
  }

  // Generic API errors and unexpected errors
  const typedError = error as ErrorWithStatus;
  const statusCode = typedError.statusCode ?? 500;
  const message = typedError.message ?? "Something went wrong on our end. Please try again, or contact support if the problem persists."

  res.status(statusCode).json({
    success: false,
    message,
  });
}
