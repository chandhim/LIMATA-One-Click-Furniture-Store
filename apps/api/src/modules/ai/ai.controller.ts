import type { NextFunction, Request, Response } from "express";
import {
  getHealth,
  proxyDetect,
  proxyDepth,
  proxyAnalyze,
  proxyRecommend,
  proxyChat,
  getUserConversations,
  getConversation,
  proxyPlacement,
  proxyVisualRecommendation,
} from "./ai.service";
import { validateFileUpload, validateRecommendRequest, validatePlacementRequest } from "./ai.validation";

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
    validateRecommendRequest(req);
    const result = await proxyRecommend(req.body);
    return sendAiResponse(res, 200, "Recommendation successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function getConversationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const conversations = await getUserConversations(userId);
    return sendAiResponse(res, 200, "Conversations retrieved", { conversations });
  } catch (error) {
    return next(error);
  }
}

export async function getConversationByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.id;
    const conversation = await getConversation(req.params.conversationId, userId);
    return sendAiResponse(res, 200, "Conversation retrieved", { conversation });
  } catch (error) {
    return next(error);
  }
}

export async function chatController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await proxyChat(req.body, req.user);
    return sendAiResponse(res, 200, "Chat response generated", result);
  } catch (error) {
    return next(error);
  }
}

export async function placementController(req: Request, res: Response, next: NextFunction) {
  try {
    validatePlacementRequest(req);
    const result = await proxyPlacement(req.body.productId, req.file!);
    return sendAiResponse(res, 200, "Placement evaluation successful", result);
  } catch (error) {
    return next(error);
  }
}

export async function visualRecommendationController(req: Request, res: Response, next: NextFunction) {
  try {
    validateFileUpload(req);
    const result = await proxyVisualRecommendation(req.file!);
    return sendAiResponse(res, 200, "Visual recommendation successful", result);
  } catch (error) {
    return next(error);
  }
}
