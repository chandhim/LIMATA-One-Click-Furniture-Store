import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import { loginSchema, registerSchema } from "./auth.validation";
import { getProfile, loginUser, registerUser } from "./auth.service";

function sendAuthResponse(
  res: Response,
  statusCode: number,
  message: string,
  data: Record<string, unknown>,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export async function registerController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = registerSchema.parse(req.body);
    const result = await registerUser(parsedBody);

    return sendAuthResponse(res, 201, "Registration successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function loginController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = loginSchema.parse(req.body);
    const result = await loginUser(parsedBody);

    return sendAuthResponse(res, 200, "Login successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function profileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const profile = await getProfile(req.user.id);

    return sendAuthResponse(res, 200, "Profile fetched successfully", {
      user: profile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function adminController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    return sendAuthResponse(res, 200, "Admin access granted", {
      userId: req.user.id,
      role: Role.ADMIN,
    });
  } catch (error) {
    return next(error);
  }
}