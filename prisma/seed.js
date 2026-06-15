const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Modern Sofa',
      description: 'Comfortable modern sofa for living room.',
      price: 45000,
      stock: 10,
      category: 'Sofas',
      material: 'Leather',
      images: ['/images/sofa1.png'],
    },
    {
      name: 'Dining Table',
      description: 'Solid wood dining table.',
      price: 30000,
      stock: 5,
      category: 'Tables',
      material: 'Wood',
      images: ['/images/dining1.png'],
    },
    {
      name: 'Office Chair',
      description: 'Ergonomic office chair.',
      price: 8000,
      stock: 20,
      category: 'Chairs',
      material: 'Mesh',
      images: ['/images/chair1.png'],
    },
    {
      name: 'TV Stand',
      description: 'Stylish TV stand with storage.',
      price: 12000,
      stock: 7,
      category: 'Storage',
      material: 'MDF',
      images: ['/images/tvstand1.png'],
    },
    {
      name: 'Queen Bed',
      description: 'Comfortable queen size bed.',
      price: 40000,
      stock: 3,
      category: 'Beds',
      material: 'Wood',
      images: ['/images/bed1.png'],
    },
    {
      name: 'Wardrobe',
      description: 'Spacious wardrobe for bedroom.',
      price: 25000,
      stock: 4,
      category: 'Storage',
      material: 'Wood',
      images: ['/images/wardrobe1.png'],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: p,
      });
    } else {
      await prisma.product.create({
        data: p,
      });
    }
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
