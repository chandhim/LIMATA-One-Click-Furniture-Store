import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting transaction to migrate abandoned PayHere orders to CheckoutAttempt...\n");
  
  // Use a transaction with increased timeout
  await prisma.$transaction(async (tx) => {
    // 1. Fetch the 16 abandoned PayHere orders
    const abandonedOrders = await tx.order.findMany({
      where: {
        orderStatus: 'PENDING',
        paymentMethod: 'PAYHERE',
        paymentStatus: 'PENDING'
      },
      include: {
        items: true
      }
    });

    console.log(`Found ${abandonedOrders.length} records to migrate.`);

    if (abandonedOrders.length === 0) {
      console.log("No records to migrate.");
      return;
    }

    // 2. Insert them into CheckoutAttempt
    for (const order of abandonedOrders) {
      const { items, orderId, orderStatus, ...orderData } = order;
      
      const attempt = await tx.checkoutAttempt.create({
        data: {
          attemptId: orderId, // Retain original ID for traceability
          userId: orderData.userId,
          paymentMethod: orderData.paymentMethod,
          paymentStatus: orderData.paymentStatus,
          totalAmount: orderData.totalAmount,
          shippingName: orderData.shippingName,
          shippingEmail: orderData.shippingEmail,
          shippingPhone: orderData.shippingPhone,
          shippingAddress: orderData.shippingAddress,
          shippingCity: orderData.shippingCity,
          deliveryMethod: orderData.deliveryMethod,
          deliveryCharge: orderData.deliveryCharge,
          createdAt: orderData.createdAt,
          updatedAt: orderData.updatedAt,
          items: {
            create: items.map(item => ({
              attemptItemId: item.orderItemId, // Retain original item ID
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              createdAt: item.createdAt
            }))
          }
        }
      });
      console.log(`Migrated Order ${orderId} -> CheckoutAttempt ${attempt.attemptId}`);
    }

    // 3. Delete from Order table
    // (This automatically deletes OrderItem due to cascade)
    const deleteResult = await tx.order.deleteMany({
      where: {
        orderStatus: 'PENDING',
        paymentMethod: 'PAYHERE',
        paymentStatus: 'PENDING'
      }
    });

    console.log(`\nDeleted ${deleteResult.count} abandoned orders from Order table.`);

    // 4. Update the historical active COD orders (PENDING -> ACCEPTED)
    const updateResult = await tx.order.updateMany({
      where: {
        orderStatus: 'PENDING',
        paymentMethod: 'COD'
      },
      data: {
        orderStatus: 'ACCEPTED'
      }
    });
    console.log(`Updated ${updateResult.count} COD PENDING orders to ACCEPTED.`);
    
    // Check if any PENDING records are left
    const remainingPending = await tx.order.count({
      where: {
        orderStatus: 'PENDING'
      }
    });
    
    if (remainingPending > 0) {
      throw new Error(`Migration safety check failed: ${remainingPending} PENDING orders still exist! Rolling back.`);
    }

  }, { maxWait: 15000, timeout: 60000 });
  
  console.log("\nMigration completed successfully. Transaction committed.");
}

main()
  .catch(e => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
