import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = [
    {
      name: "Living Room",
      desc: "Furniture for living room",
      alt: "🛋️",
      image: "/images/categories/living_room.png",
    },
    {
      name: "Bedroom",
      desc: "Furniture for bedroom",
      alt: "🛏️",
      image: "/images/categories/bedroom.png",
    },
    {
      name: "Dining Room",
      desc: "Furniture for dining room",
      alt: "🍽️",
      image: "/images/categories/dining_room.png",
    },
    {
      name: "Office",
      desc: "Office furniture",
      alt: "💼",
      image: "/images/categories/office.png",
    },
    {
      name: "Outdoor",
      desc: "Outdoor furniture",
      alt: "🌿",
      image: "/images/categories/outdoor.png",
    },
    {
      name: "Kitchen",
      desc: "Kitchen items",
      alt: "🍳",
      image: "/images/categories/kitchen.png",
    },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: c,
      create: c,
    });
  }

  const products = [
    {
      name: "Modern Sofa",
      description: "Comfortable modern sofa for living room.",
      price: 45000,
      stock: 10,
      category: "Living Room",
      material: "Leather",
      images: [
        "/images/sofa1.png",
        "/images/tvstand1.png",
        "/images/wardrobe1.png",
      ],
    },
    {
      name: "Dining Table",
      description: "Solid wood dining table.",
      price: 30000,
      stock: 5,
      category: "Dining Room",
      material: "Wood",
      images: ["/images/dining1.png"],
    },
    {
      name: "Office Chair",
      description: "Ergonomic office chair.",
      price: 8000,
      stock: 20,
      category: "Office",
      material: "Mesh",
      images: ["/images/chair1.png", "/images/bed1.png", "/images/dining1.png"],
    },
    {
      name: "TV Stand",
      description: "Stylish TV stand with storage.",
      price: 12000,
      stock: 7,
      category: "Living Room",
      material: "MDF",
      images: ["/images/tvstand1.png"],
    },
    {
      name: "Queen Bed",
      description: "Comfortable queen size bed.",
      price: 40000,
      stock: 3,
      category: "Bedroom",
      material: "Wood",
      images: ["/images/bed1.png"],
    },
    {
      name: "Wardrobe",
      description: "Spacious wardrobe for bedroom.",
      price: 25000,
      stock: 4,
      category: "Bedroom",
      material: "Wood",
      images: ["/images/wardrobe1.png"],
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });
    if (existing) {
      await prisma.product.update({
        where: { productId: existing.productId },
        data: p,
      });
    } else {
      await prisma.product.create({
        data: p,
      });
    }
  }

  // --- 1. Create Mock Users with Sri Lankan Names ---
  const mockUsers = [
    {
      name: "Kamal Perera",
      email: "kamal.perera@example.com",
      password: "password123", // Using plain for seed, normally hashed
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamal",
    },
    {
      name: "Nimali Silva",
      email: "nimali.silva@example.com",
      password: "password123",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nimali",
    },
    {
      name: "Kasun Fernando",
      email: "kasun.fernando@example.com",
      password: "password123",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kasun",
    },
    {
      name: "Sanduni Weerasinghe",
      email: "sanduni.w@example.com",
      password: "password123",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanduni",
    },
    {
      name: "Amila Jayasuriya",
      email: "amila.j@example.com",
      password: "password123",
      avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amila",
    },
  ];

  const createdUsers = [];
  for (const u of mockUsers) {
    const existingUser = await prisma.user.findUnique({
      where: { email: u.email },
    });
    if (existingUser) {
      createdUsers.push(existingUser);
    } else {
      const newUser = await prisma.user.create({
        data: u,
      });
      createdUsers.push(newUser);
    }
  }

  // --- 2. Create Reviews for Products ---
  const allProducts = await prisma.product.findMany();

  const reviewTitles = [
    "Great quality!",
    "Highly recommended",
    "Good value for money",
    "Looks beautiful in my home",
    "Average quality, but okay",
    "Absolutely stunning furniture",
  ];

  const reviewComments = [
    "I am very impressed with the build quality. The delivery was fast and the team was professional.",
    "This perfectly matches my interior. The finish is exactly as shown in the pictures.",
    "Good product. The assembly took a bit of time but it is very sturdy once built.",
    "Excellent customer service and the product exceeds expectations. Highly recommended!",
    "It's decent for the price. Not the absolute best material but it gets the job done.",
    "Beautiful piece of furniture. Brought elegance to my living space.",
  ];

  // For each product, create 2-4 reviews
  for (const prod of allProducts) {
    const numReviews = Math.floor(Math.random() * 3) + 2; // 2 to 4 reviews

    // Pick random users
    const shuffledUsers = [...createdUsers].sort(() => 0.5 - Math.random());
    const selectedUsers = shuffledUsers.slice(0, numReviews);

    for (const user of selectedUsers) {
      // Check if review already exists
      const existingReview = await prisma.review.findFirst({
        where: {
          productId: prod.productId,
          userId: user.userId,
        },
      });

      if (!existingReview) {
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly
        const title =
          reviewTitles[Math.floor(Math.random() * reviewTitles.length)];
        const comment =
          reviewComments[Math.floor(Math.random() * reviewComments.length)];

        await prisma.review.create({
          data: {
            productId: prod.productId,
            userId: user.userId,
            rating,
            title,
            comment,
          },
        });
      }
    }
  }

  console.log("Seeding completed successfully.");
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
