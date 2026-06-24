import type { Role } from "@prisma/client";

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type AuthUser = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  district: string | null;
  province: string | null;
  postalCode: string | null;
  dateOfBirth: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthPayload = {
  user: AuthUser;
  token: string;
};
