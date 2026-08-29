-- CreateEnum
CREATE TYPE "DeliveryMethodEnum" AS ENUM ('STANDARD', 'FAST_COURIER');

-- CreateTable
CREATE TABLE "DeliveryConfiguration" (
    "id" TEXT NOT NULL,
    "method" "DeliveryMethodEnum" NOT NULL,
    "thresholdAmount" DOUBLE PRECISION NOT NULL,
    "belowThresholdCharge" DOUBLE PRECISION NOT NULL,
    "aboveThresholdCharge" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryConfiguration_method_key" ON "DeliveryConfiguration"("method");

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "deliveryCharge" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Custom Migration: Reconstruct Historical Delivery Charge
-- We calculate the delivery charge by subtracting the sum of the snapshot OrderItem prices from the Order totalAmount.
UPDATE "Order"
SET "deliveryCharge" = CASE
  WHEN EXISTS (
    SELECT 1
    FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."orderId"
  )
  THEN "totalAmount" - (
    SELECT SUM("price" * "quantity")
    FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."orderId"
  )
  ELSE 0
END;

-- Custom Migration: Migrate legacy string methods to new Enum
UPDATE "Order"
SET "deliveryMethod" = 'FAST_COURIER'
WHERE "deliveryMethod" = 'Express';

UPDATE "Order"
SET "deliveryMethod" = 'STANDARD'
WHERE "deliveryMethod" = 'Standard';

-- AlterTable Order deliveryMethod column cast to enum
ALTER TABLE "Order" ALTER COLUMN "deliveryMethod" TYPE "DeliveryMethodEnum" USING "deliveryMethod"::text::"DeliveryMethodEnum";
