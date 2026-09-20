const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const badOrders = await prisma.order.findMany({
    where: {
      paymentMethod: 'PAYHERE',
      paymentStatus: 'PENDING',
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Recent bad orders:", badOrders);

  const attempts = await prisma.checkoutAttempt.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log("Recent CheckoutAttempts:", attempts);
}

check().catch(console.error).finally(() => prisma.$disconnect());
