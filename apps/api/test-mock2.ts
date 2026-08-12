import { mock } from "node:test";
import { prisma } from "@/lib/prisma";

try {
  const p = prisma as any;
  if (!p.product) p.product = {};
  mock.method(p.product, "findMany", async () => [{ name: "mocked" }]);
  console.log("Mocked prisma.product.findMany successfully");
} catch (e: any) {
  console.error("Failed to mock Prisma:", e.message);
}
