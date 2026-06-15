import { PrismaClient } from "@prisma/client";

declare global {
  var __prisma: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["info", "error", "warn"]
        : ["error"],
  });
}

/**
 * Lazy singleton — the client is only instantiated on first access,
 * which guarantees that loadProjectEnv() has already populated
 * process.env.DATABASE_URL before PrismaClient reads it.
 */
export function getPrisma(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    // In production always use a fresh reference (no global needed).
    if (!global.__prisma) {
      global.__prisma = createPrismaClient();
    }
    return global.__prisma;
  }

  // In development reuse across hot-reloads to avoid connection exhaustion.
  if (!global.__prisma) {
    global.__prisma = createPrismaClient();
  }

  return global.__prisma;
}

/**
 * Convenience proxy — callers can still write `prisma.user.findUnique()`
 * but the underlying client is only created when the first property is
 * accessed (i.e. after env is loaded).
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
