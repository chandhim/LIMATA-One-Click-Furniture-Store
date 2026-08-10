import { aiClient } from "@/lib/ai-client";
import { ApiError } from "@/shared/errors/api-error";
import { AxiosError } from "axios";

function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      throw new ApiError(504, "Gateway Timeout: AI Service took too long to respond.");
    }
    if (!error.response) {
      throw new ApiError(503, "Service Unavailable: AI Service is unreachable.");
    }
    
    // Forward the standard error payload from FastAPI
    const message = error.response.data?.detail || "AI Service Error";
    throw new ApiError(error.response.status, message);
  }
  
  throw error; // Let the global error handler catch unexpected internal errors
}

export async function getHealth() {
  try {
    const response = await aiClient.get("/health");
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyDetect(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/detect", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyDepth(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/depth", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyAnalyze(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/analyze", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

import { getProducts, getProductById } from "../products/product.service";

export async function proxyRecommend(payload: Record<string, unknown>) {
  try {
    const products = await getProducts({ includeDetails: true });

    // Map strictly to the fields expected by the Python RecommendationService
    const available_products = products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      description: p.description,
      category: p.category,
      material: p.material,
      price: p.price,
      stock: p.stock
    }));

    const aiPayload = {
      preferences: payload.preferences,
      available_products
    };

    const response = await aiClient.post("/recommend", aiPayload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyChat(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/chat", payload);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyPlacement(productId: string, file: Express.Multer.File) {
  try {
    const product = await getProductById(productId);
    if (!product) {
      throw new ApiError(404, `Product with ID ${productId} not found.`);
    }

    const furnitureMetadata = {
      width: product.width ?? 1.0,
      depth: product.depth ?? 1.0,
      height: product.height ?? 1.0,
      category: product.category,
      rotatable: true
    };

    const formData = new FormData();
    // Use Blob or Buffer. Axios supports native FormData in Node 18+, but standard way with Multer is appending Buffer.
    // If native FormData is used, we might need a Blob. 
    // Using standard Blob for native FormData (if axios > 1.x) or just pass buffer if using form-data package.
    // We will append a Blob constructed from the buffer.
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("image", blob, file.originalname);
    formData.append("furniture_metadata", JSON.stringify(furnitureMetadata));

    const response = await aiClient.post("/placement", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    });
    
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

export async function proxyVisualRecommendation(file: Express.Multer.File) {
  try {
    const products = await getProducts({ includeDetails: true });

    // Map strictly to the fields expected by the Python RecommendationService
    const available_products = products.map((p: any) => ({
      productId: p.productId,
      name: p.name,
      description: p.description,
      category: p.category,
      material: p.material,
      price: p.price,
      stock: p.stock
    }));

    const formData = new FormData();
    const blob = new Blob([file.buffer], { type: file.mimetype });
    formData.append("image", blob, file.originalname);
    formData.append("available_products", JSON.stringify(available_products));

    const response = await aiClient.post("/visual-recommend", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      },
    });
    
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
