import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Analyzing 16 abandoned PayHere records...\n");
  
  const abandonedOrders = await prisma.order.findMany({
    where: {
      orderStatus: 'PENDING',
      paymentMethod: 'PAYHERE',
      paymentStatus: 'PENDING'
    },
    include: {
      items: true
    }
  });

  console.log(`Found ${abandonedOrders.length} abandoned PayHere orders.`);
  
  if (abandonedOrders.length > 0) {
    console.log("Sample abandoned order:");
    console.log(JSON.stringify(abandonedOrders[0], null, 2));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
