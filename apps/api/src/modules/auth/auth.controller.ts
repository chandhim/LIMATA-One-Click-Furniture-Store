import type { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import { loginSchema, registerSchema, updateProfileSchema } from "./auth.validation";
import { getProfile, loginUser, registerUser, updateUserProfile } from "./auth.service";
import { uploadToR2, makeKey } from "@/lib/storage";
import { createNotification } from "../notifications/notification.service";

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

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const parsedBody = updateProfileSchema.parse(req.body);
    const updatedProfile = await updateUserProfile(req.user.id, parsedBody);

    return sendAuthResponse(res, 200, "Profile updated successfully", {
      user: updatedProfile,
    });
  } catch (error) {
    return next(error);
  }
}

export async function uploadAvatarController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validMimes.includes(req.file.mimetype)) {
      throw new ApiError(400, `Invalid file type: ${req.file.mimetype}`);
    }

    const key = makeKey(`users/${req.user.id}/avatar`, req.file.originalname);
    const url = await uploadToR2(key, req.file.buffer, req.file.mimetype);

    // Save to user profile automatically
    await updateUserProfile(req.user.id, { avatarUrl: url });

    await createNotification({
      userId: req.user.id,
      type: "PROFILE_UPDATED",
      title: "Avatar Updated",
      message: "Your profile picture has been updated successfully.",
    });

    return sendAuthResponse(res, 200, "Avatar uploaded successfully", { url });
  } catch (error) {
    return next(error);
  }
}