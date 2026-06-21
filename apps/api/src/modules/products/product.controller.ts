import type { NextFunction, Request, Response } from "express";
import { ApiError } from "@/shared/errors/api-error";
import { listQuerySchema, idParamSchema, productCreateSchema, productUpdateSchema } from "./product.validation";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from "./product.service";
import { uploadToR2, makeKey } from "@/lib/storage";

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
    const product = await getProductById(params.productId);

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return sendResponse(res, 200, product);
  } catch (error) {
    return next(error);
  }
}

export async function createProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = productCreateSchema.parse(req.body);
    const product = await createProduct(data);

    return sendResponse(res, 201, product);
  } catch (error) {
    return next(error);
  }
}

export async function updateProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = idParamSchema.parse(req.params);
    const data = productUpdateSchema.parse(req.body);

    const product = await updateProduct(params.productId, data);

    return sendResponse(res, 200, product);
  } catch (error) {
    return next(error);
  }
}

export async function deleteProductController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = idParamSchema.parse(req.params);

    await deleteProduct(params.productId);

    return sendResponse(res, 200, { productId: params.productId });
  } catch (error) {
    return next(error);
  }
}

export async function uploadImagesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      throw new ApiError(400, "No files uploaded");
    }

    const urls: string[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      const validMimes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
      if (!validMimes.includes(file.mimetype)) {
        throw new ApiError(400, `Invalid file type: ${file.mimetype}`);
      }

      const key = makeKey("products/images", file.originalname);
      const url = await uploadToR2(key, file.buffer, file.mimetype);
      urls.push(url);
    }

    return sendResponse(res, 200, { urls });
  } catch (error) {
    return next(error);
  }
}

export async function uploadModelController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file) {
      throw new ApiError(400, "No file uploaded");
    }

    const validMimes = ["model/gltf-binary", "application/octet-stream"];
    const isValidExt = req.file.originalname.toLowerCase().endsWith(".glb");

    if (!isValidExt || !validMimes.includes(req.file.mimetype)) {
      throw new ApiError(400, "Only .glb files are allowed");
    }

    const key = makeKey("models", req.file.originalname);
    const url = await uploadToR2(key, req.file.buffer, req.file.mimetype);

    return sendResponse(res, 200, { url });
  } catch (error) {
    return next(error);
  }
}

