import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Find a user by email address.
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

/**
 * Find a user by their primary key (cuid).
 */
export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { userId: id } });
}

/**
 * Create a new user record.
 */
export async function createUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: Role.CUSTOMER,
    },
  });
}

/**
 * Update a user record.
 */
export async function updateUser(
  id: string,
  data: {
    name?: string;
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
  return prisma.user.update({
    where: { userId: id },
    data,
  });
}
