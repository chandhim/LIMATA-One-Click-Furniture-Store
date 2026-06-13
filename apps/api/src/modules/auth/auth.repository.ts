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
  return prisma.user.findUnique({ where: { id } });
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
