-- DropForeignKey if exists
ALTER TABLE IF EXISTS "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_cartId_fkey";
ALTER TABLE IF EXISTS "CartItem" DROP CONSTRAINT IF EXISTS "CartItem_productId_fkey";
ALTER TABLE IF EXISTS "Message" DROP CONSTRAINT IF EXISTS "Message_conversationId_fkey";
ALTER TABLE IF EXISTS "Order" DROP CONSTRAINT IF EXISTS "Order_userId_fkey";
ALTER TABLE IF EXISTS "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_orderId_fkey";
ALTER TABLE IF EXISTS "OrderItem" DROP CONSTRAINT IF EXISTS "OrderItem_productId_fkey";
ALTER TABLE IF EXISTS "Review" DROP CONSTRAINT IF EXISTS "Review_productId_fkey";
ALTER TABLE IF EXISTS "Review" DROP CONSTRAINT IF EXISTS "Review_userId_fkey";

-- Safely rename columns in PL/pgSQL
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='User' AND column_name='id') THEN
        ALTER TABLE "User" RENAME COLUMN "id" TO "userId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Product' AND column_name='id') THEN
        ALTER TABLE "Product" RENAME COLUMN "id" TO "productId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Conversation' AND column_name='id') THEN
        ALTER TABLE "Conversation" RENAME COLUMN "id" TO "conversationId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Message' AND column_name='id') THEN
        ALTER TABLE "Message" RENAME COLUMN "id" TO "messageId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Notification' AND column_name='id') THEN
        ALTER TABLE "Notification" RENAME COLUMN "id" TO "notificationId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Cart' AND column_name='id') THEN
        ALTER TABLE "Cart" RENAME COLUMN "id" TO "cartId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='CartItem' AND column_name='id') THEN
        ALTER TABLE "CartItem" RENAME COLUMN "id" TO "cartItemId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Order' AND column_name='id') THEN
        ALTER TABLE "Order" RENAME COLUMN "id" TO "orderId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='OrderItem' AND column_name='id') THEN
        ALTER TABLE "OrderItem" RENAME COLUMN "id" TO "orderItemId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Review' AND column_name='id') THEN
        ALTER TABLE "Review" RENAME COLUMN "id" TO "reviewId";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Category' AND column_name='id') THEN
        ALTER TABLE "Category" RENAME COLUMN "id" TO "categoryId";
    END IF;
END $$;

-- Add isActive column to User table if it does not exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- Create Category table if it does not exist (for fresh/clean installations)
CREATE TABLE IF NOT EXISTS "Category" (
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "image" TEXT,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("categoryId")
);

-- Create Review table if it does not exist (for fresh/clean installations)
CREATE TABLE IF NOT EXISTS "Review" (
    "reviewId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("reviewId")
);

-- Create StoreSetting table if it does not exist (for fresh/clean installations)
CREATE TABLE IF NOT EXISTS "StoreSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreSetting_pkey" PRIMARY KEY ("key")
);

-- Create unique Category index safely
CREATE UNIQUE INDEX IF NOT EXISTS "Category_name_key" ON "Category"("name");

-- Create Review indices safely
CREATE INDEX IF NOT EXISTS "Review_productId_idx" ON "Review"("productId");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");

-- Re-add Foreign Keys
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("conversationId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("cartId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
