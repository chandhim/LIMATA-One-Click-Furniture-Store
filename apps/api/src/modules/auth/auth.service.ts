import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { ApiError } from "@/shared/errors/api-error";
import { generateToken } from "@/lib/jwt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "./auth.repository";
import type { AuthPayload, AuthUser, LoginInput, RegisterInput } from "./auth.types";

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
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
    token: generateToken({ id: user.id, role: user.role }),
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
    token: generateToken({ id: user.id, role: user.role }),
  };
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return mapUser(user);
}