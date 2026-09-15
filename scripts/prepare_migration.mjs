import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Creating database backup of Orders...");
  const allOrders = await prisma.order.findMany({
    include: { items: true }
  });
  
  await fs.mkdir(path.join(process.cwd(), 'scratch'), { recursive: true });
  await fs.writeFile(
    path.join(process.cwd(), 'scratch', 'db_orders_backup.json'), 
    JSON.stringify(allOrders, null, 2)
  );
  console.log(`Backup created: scratch/db_orders_backup.json (${allOrders.length} orders)\n`);

  console.log("Analyzing 16 abandoned PayHere records...");
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

  console.log(`Exact IDs of the ${abandonedOrders.length} records to migrate:`);
  abandonedOrders.forEach(o => console.log(`- ${o.orderId}`));
  
  console.log("\nVerifying constraints for the 16 records:");
  console.log("- Successful payment exists: No (paymentStatus is PENDING)");
  console.log("- Shipment/delivery occurred: No (orderStatus is PENDING)");
  
  // Note: Inventory was verified NOT to be deducted by checking order.service.ts
  // PayHere checkout does not deduct inventory immediately; it waits for the webhook.
  console.log("- Stock permanently deducted: No (Verified via business logic in order.service.ts; PayHere only deducts on webhook success).");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
