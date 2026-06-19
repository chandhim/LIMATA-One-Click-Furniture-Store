import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import { generateToken } from "@/lib/jwt";
import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
} from "./auth.repository";
import type { AuthPayload, AuthUser, LoginInput, RegisterInput } from "./auth.types";

function mapUser(user: User): AuthUser {
  return {
    userId: user.userId,
    name: user.name,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    phoneNumber: user.phoneNumber,
    avatarUrl: user.avatarUrl,
    addressLine1: user.addressLine1,
    addressLine2: user.addressLine2,
    city: user.city,
    district: user.district,
    province: user.province,
    postalCode: user.postalCode,
    dateOfBirth: user.dateOfBirth,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthPayload> {
  const email = input.email.toLowerCase();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    name: input.name.trim(),
    email,
    password: hashedPassword,
  });

  return {
    user: mapUser(user),
    token: generateToken({ id: user.userId, role: user.role }),
  };
}

export async function loginUser(input: LoginInput): Promise<AuthPayload> {
  const email = input.email.toLowerCase();
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (user.isActive === false) {
    throw new ApiError(403, "Your account has been disabled. Please contact support.");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid credentials");
  }

  return {
    user: mapUser(user),
    token: generateToken({ id: user.userId, role: user.role }),
  };
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return mapUser(user);
}

export async function updateUserProfile(
  userId: string,
  data: {
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
    addressLine1?: string | null;
    addressLine2?: string | null;
    city?: string | null;
    district?: string | null;
    province?: string | null;
    postalCode?: string | null;
    dateOfBirth?: string | null;
  },
) {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let name = user.name;
  const newFirstName = data.firstName !== undefined ? data.firstName : user.firstName;
  const newLastName = data.lastName !== undefined ? data.lastName : user.lastName;

  if (newFirstName || newLastName) {
    name = `${newFirstName || ""} ${newLastName || ""}`.trim() || user.name;
  }

  const updated = await updateUser(userId, {
    ...data,
    name,
  });

  return mapUser(updated);
}