import { Router } from "express";
import { listProductsController, getProductController } from "./product.controller";

export const productsRouter = Router();

productsRouter.get("/", listProductsController);
productsRouter.get("/:id", getProductController);
