import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products in DB`);
  if (products.length > 0) {
    console.log("Sample product:", products[0]);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
