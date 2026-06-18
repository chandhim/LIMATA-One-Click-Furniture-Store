import { Router } from "express";
import multer from "multer";
import {
  listProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
  uploadImagesController,
  uploadModelController,
} from "./product.controller";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import { Role } from "@prisma/client";

export const productsRouter = Router();

const upload = multer({ storage: multer.memoryStorage() });

// Public routes
productsRouter.get("/", listProductsController);
productsRouter.get("/:productId", getProductController);

// Protected admin routes
productsRouter.post("/", authenticate, authorize(Role.ADMIN), createProductController);
productsRouter.put("/:productId", authenticate, authorize(Role.ADMIN), updateProductController);
productsRouter.delete("/:productId", authenticate, authorize(Role.ADMIN), deleteProductController);
productsRouter.post("/upload-images", authenticate, authorize(Role.ADMIN), upload.array("images", 10), uploadImagesController);
productsRouter.post("/upload-model", authenticate, authorize(Role.ADMIN), upload.single("model"), uploadModelController);
