import { prisma } from "../apps/api/src/lib/prisma";
import { placeOrder, updateOrderStatusByAdmin, cancelOrder, confirmPayherePaymentClientSide } from "../apps/api/src/modules/orders/order.service";

async function expectError(fn: () => Promise<any>, expectedMessagePart?: string) {
  try {
    await fn();
    throw new Error("Expected an error but function succeeded");
  } catch (err: any) {
    if (expectedMessagePart && !err.message.includes(expectedMessagePart)) {
      console.error(`Expected error containing "${expectedMessagePart}" but got "${err.message}"`);
      throw err;
    }
    console.log(`[PASS] Caught expected error: ${err.message}`);
  }
}

async function main() {
  console.log("Starting verification...");

  // Get a test user and product
  const user = await prisma.user.findFirst({ where: { role: "CUSTOMER" } });
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  
  if (!user || !admin) {
    console.error("Test users not found");
    return;
  }

  const product = await prisma.product.findFirst({ where: { stock: { gt: 10 } } });
  
  if (!product) {
    console.error("No product with stock found");
    return;
  }

  let currentStock = product.stock;
  console.log(`Initial stock for ${product.name}: ${currentStock}`);

  // Setup cart
  const cart = await prisma.cart.upsert({
    where: { userId: user.userId },
    update: {},
    create: { userId: user.userId }
  });
  
  const addToCart = async (qty = 1) => {
    await prisma.cartItem.create({
      data: { cartId: cart.cartId, productId: product.productId, quantity: qty }
    });
  };

  // --- COD FLOW ---
  console.log("\n--- TEST: COD ACCEPTED -> SHIPPED -> DELIVERED + PAID ---");
  await addToCart(1);
  const codOrder = await placeOrder(user.userId, {
    paymentMethod: "COD", deliveryMethod: "STANDARD", shippingName: "Test", shippingEmail: "test@example.com", shippingPhone: "123", shippingAddress: "123", shippingCity: "Colombo"
  });
  console.log(`Placed COD Order: ${codOrder.orderId} - Status: ${codOrder.orderStatus}, Payment: ${codOrder.paymentStatus}`);
  
  const shippedCod = await updateOrderStatusByAdmin(codOrder.orderId, "SHIPPED", admin.userId);
  console.log(`Updated to SHIPPED - Status: ${shippedCod.orderStatus}, Payment: ${shippedCod.paymentStatus}`);

  const deliveredCod = await updateOrderStatusByAdmin(codOrder.orderId, "DELIVERED", admin.userId);
  console.log(`Updated to DELIVERED - Status: ${deliveredCod.orderStatus}, Payment: ${deliveredCod.paymentStatus}`);

  console.log("\n--- TEST: COD ACCEPTED -> CANCELLED ---");
  await addToCart(1);
  const codOrder2 = await placeOrder(user.userId, {
    paymentMethod: "COD", deliveryMethod: "STANDARD", shippingName: "Test", shippingEmail: "test@example.com", shippingPhone: "123", shippingAddress: "123", shippingCity: "Colombo"
  });
  const cancelledCod = await cancelOrder(codOrder2.orderId, user.userId);
  console.log(`Cancelled COD Order - Status: ${cancelledCod?.orderStatus}`);

  // --- PAYHERE FLOW ---
  console.log("\n--- TEST: PayHere incomplete CheckoutAttempt ---");
  await addToCart(2);
  const pStock1 = (await prisma.product.findUnique({ where: { productId: product.productId } }))?.stock;
  const payHereAttempt = await placeOrder(user.userId, {
    paymentMethod: "PAYHERE", deliveryMethod: "STANDARD", shippingName: "Test", shippingEmail: "test@example.com", shippingPhone: "123", shippingAddress: "123", shippingCity: "Colombo"
  });
  const pStock2 = (await prisma.product.findUnique({ where: { productId: product.productId } }))?.stock;
  console.log(`Stock before attempt: ${pStock1}, after attempt: ${pStock2} (should be equal)`);

  console.log("\n--- TEST: PayHere successful payment -> ACCEPTED + PAID ---");
  const confirmedOrder = await confirmPayherePaymentClientSide(payHereAttempt.orderId, user.userId);
  console.log(`Converted to Order - Status: ${confirmedOrder.orderStatus}, Payment: ${confirmedOrder.paymentStatus}`);

  console.log("\n--- TEST: PayHere ACCEPTED -> SHIPPED -> DELIVERED ---");
  const shippedPayHere = await updateOrderStatusByAdmin(confirmedOrder.orderId, "SHIPPED", admin.userId);
  console.log(`Updated to SHIPPED - Status: ${shippedPayHere.orderStatus}, Payment: ${shippedPayHere.paymentStatus}`);
  
  const deliveredPayHere = await updateOrderStatusByAdmin(confirmedOrder.orderId, "DELIVERED", admin.userId);
  console.log(`Updated to DELIVERED - Status: ${deliveredPayHere.orderStatus}, Payment: ${deliveredPayHere.paymentStatus}`);

  console.log("\n--- TEST: PayHere ACCEPTED -> CANCELLED + PAID ---");
  await addToCart(1);
  const payHereAttempt2 = await placeOrder(user.userId, {
    paymentMethod: "PAYHERE", deliveryMethod: "STANDARD", shippingName: "Test", shippingEmail: "test@example.com", shippingPhone: "123", shippingAddress: "123", shippingCity: "Colombo"
  });
  const confirmedOrder2 = await confirmPayherePaymentClientSide(payHereAttempt2.orderId, user.userId);
  const cancelledPayHere = await cancelOrder(confirmedOrder2.orderId, user.userId);
  console.log(`Cancelled PayHere Order - Status: ${cancelledPayHere?.orderStatus}, Payment: ${cancelledPayHere?.paymentStatus}`);

  // --- REJECTION FLOWS ---
  console.log("\n--- TEST: Customer cancellation attempt while SHIPPED -> rejected ---");
  await expectError(() => cancelOrder(shippedPayHere.orderId, user.userId), "Cannot cancel order in its current status");

  console.log("\n--- TEST: Customer cancellation attempt while DELIVERED -> rejected ---");
  await expectError(() => cancelOrder(deliveredPayHere.orderId, user.userId), "Cannot cancel order in its current status");

  console.log("\n--- TEST: Attempted backward transition -> rejected ---");
  await expectError(() => updateOrderStatusByAdmin(deliveredPayHere.orderId, "SHIPPED", admin.userId), "Invalid state transition");
  
  console.log("\n--- TEST: Attempted arbitrary transition -> rejected ---");
  await expectError(() => updateOrderStatusByAdmin(confirmedOrder2.orderId, "SHIPPED", admin.userId), "Invalid state transition"); // confirmedOrder2 is CANCELLED
  await expectError(() => updateOrderStatusByAdmin(deliveredPayHere.orderId, "CANCELLED", admin.userId), "Invalid state transition");

  console.log("\nAll Verification Tests Completed Successfully!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
