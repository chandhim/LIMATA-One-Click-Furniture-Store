import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching historical order statistics...\n");
  
  const stats = await prisma.order.groupBy({
    by: ['orderStatus', 'paymentMethod', 'paymentStatus'],
    _count: {
      orderId: true
    }
  });

  console.log("=== RAW STATS ===");
  console.log(JSON.stringify(stats, null, 2));
  
  console.log("\n=== CANCELLATION_REQUESTED ORDERS ===");
  const cancellationRequested = await prisma.order.findMany({
    where: {
      orderStatus: 'CANCELLATION_REQUESTED'
    },
    select: {
      orderId: true,
      paymentMethod: true,
      paymentStatus: true,
      createdAt: true,
      updatedAt: true
    }
  });
  console.log(JSON.stringify(cancellationRequested, null, 2));

  console.log("\n=== CONFIRMED/PROCESSING ORDERS ===");
  const confirmedProcessing = await prisma.order.findMany({
    where: {
      orderStatus: {
        in: ['CONFIRMED', 'PROCESSING']
      }
    },
    select: {
      orderId: true,
      orderStatus: true,
      paymentMethod: true,
      paymentStatus: true,
      createdAt: true
    }
  });
  console.log(JSON.stringify(confirmedProcessing, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
