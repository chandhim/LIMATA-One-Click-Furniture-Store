import cors from "cors";
import express from "express";
import { resolve } from "node:path";
import { loadProjectEnv } from "./config/load-env";
import { authRouter } from "./modules/auth/auth.route";
import { productsRouter } from "./modules/products/product.route";
import { healthRouter } from "./modules/health/health.route";
import { errorHandler } from "./middleware/error-handler";
import { chatRouter } from "./modules/chat/chat.route";
import { notificationRouter } from "./modules/notifications/notification.route";
import { cartRouter } from "./modules/cart/cart.routes";
import { ordersRouter } from "./modules/orders";
import { paymentsRouter } from "./modules/payments";
import { adminRouter } from "./modules/admin/admin.route";
import { wishlistRouter } from "./modules/wishlist";
import { publicSettingsRouter } from "./modules/admin/public-settings.route";
import { reviewsRouter } from "./modules/reviews/reviews.route";

loadProjectEnv();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((value) => value.trim())
      : true,
    credentials: true,
  }),
);

app.use(express.json());
app.use("/uploads", express.static(resolve(process.cwd(), "uploads")));

app.use("/api/v1/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/products/:productId/reviews", reviewsRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/payment", paymentsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/public", publicSettingsRouter);
app.use("/api/wishlist", wishlistRouter);

app.use(errorHandler);

export default app;
