import { mock } from "node:test";
import { prisma } from "@/lib/prisma";
import { findProducts } from "@/modules/products/product.repository";

try {
  const p = prisma as any;
  p.product = { findMany: async () => [] };
  mock.method(p.product, "findMany", async () => [{ name: "mocked" }]);
  console.log("Mocked prisma.product.findMany successfully");
  
  findProducts({}).then(res => console.log("findProducts output:", res));
} catch (e: any) {
  console.error("Failed to mock Prisma:", e.message);
}
