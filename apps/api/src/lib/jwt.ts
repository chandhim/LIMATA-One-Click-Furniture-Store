import type { Role } from "@prisma/client";
import jwt from "jsonwebtoken";

export type AuthTokenPayload = {
  id: string;
  role: Role;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return secret;
}

export function generateToken(payload: AuthTokenPayload) {
  // Generate a signed JSON Web Token (JWT) that encodes the user's ID and role, valid for 7 days
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "30d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as AuthTokenPayload;
}
