import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { listQuerySchema, idParamSchema } from "./product.validation";
import { getProducts, getProductById } from "./product.service";

function sendResponse(res: Response, status: number, data: unknown) {
  return res.status(status).json({ success: true, message: "ok", data });
}

export async function listProductsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = listQuerySchema.parse(req.query);
    const products = await getProducts(query);

    return sendResponse(res, 200, products);
  } catch (error) {
    return next(error);
  }
}

export async function getProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = idParamSchema.parse(req.params);
    const product = await getProductById(params.id);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return sendResponse(res, 200, product);
  } catch (error) {
    return next(error);
  }
}
