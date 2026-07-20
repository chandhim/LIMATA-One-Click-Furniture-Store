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

export async function proxyRecommend(payload: Record<string, unknown>) {
  try {
    const response = await aiClient.post("/recommend", payload);
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
