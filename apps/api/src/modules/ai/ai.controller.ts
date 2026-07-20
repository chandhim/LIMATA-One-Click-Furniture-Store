import type { NextFunction, Request, Response } from "express";
import {
  getHealth,
  proxyDetect,
  proxyDepth,
  proxyAnalyze,
  proxyRecommend,
  proxyChat,
} from "./ai.service";
import { validateFileUpload } from "./ai.validation";

function sendAiResponse(
  res: Response,
  statusCode: number,
  message: string,
  data?: Record<string, unknown>,
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export async function healthController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getHealth();
    return sendAiResponse(res, 200, "AI Service is healthy", result);
  } catch (error) {
    return next(error);
  }
}

export async function detectController(req: Request, res: Response, next: NextFunction) {
  try {
    validateFileUpload(req);
    // At this architectural stage, we pass req.body, but in future iterations 
    // the image URL / payload generation logic will be placed here or in the service.
    const result = await proxyDetect(req.body);
    return sendAiResponse(res, 200, "Detection successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function depthController(req: Request, res: Response, next: NextFunction) {
  try {
    validateFileUpload(req);
    const result = await proxyDepth(req.body);
    return sendAiResponse(res, 200, "Depth estimation successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function analyzeController(req: Request, res: Response, next: NextFunction) {
  try {
    validateFileUpload(req);
    const result = await proxyAnalyze(req.body);
    return sendAiResponse(res, 200, "Spatial analysis successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function recommendController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await proxyRecommend(req.body);
    return sendAiResponse(res, 200, "Recommendation successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function chatController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await proxyChat(req.body);
    return sendAiResponse(res, 200, "Chat response generated", result);
  } catch (error) {
    return next(error);
  }
}
