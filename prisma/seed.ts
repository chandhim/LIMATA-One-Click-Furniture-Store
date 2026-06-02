import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Modern Sofa",
      description: "Comfortable modern sofa for living room.",
      price: 45000,
      stock: 10,
      category: "Sofas",
      material: "Leather",
      images: ["/images/sofa1.jpg"],
    },
    {
      name: "Dining Table",
      description: "Solid wood dining table.",
      price: 30000,
      stock: 5,
      category: "Tables",
      material: "Wood",
      images: ["/images/dining1.jpg"],
    },
    {
      name: "Office Chair",
      description: "Ergonomic office chair.",
      price: 8000,
      stock: 20,
      category: "Chairs",
      material: "Mesh",
      images: ["/images/chair1.jpg"],
    },
    {
      name: "TV Stand",
      description: "Stylish TV stand with storage.",
      price: 12000,
      stock: 7,
      category: "Storage",
      material: "MDF",
      images: ["/images/tvstand1.jpg"],
    },
    {
      name: "Queen Bed",
      description: "Comfortable queen size bed.",
      price: 40000,
      stock: 3,
      category: "Beds",
      material: "Wood",
      images: ["/images/bed1.jpg"],
    },
    {
      name: "Wardrobe",
      description: "Spacious wardrobe for bedroom.",
      price: 25000,
      stock: 4,
      category: "Storage",
      material: "Wood",
      images: ["/images/wardrobe1.jpg"],
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
