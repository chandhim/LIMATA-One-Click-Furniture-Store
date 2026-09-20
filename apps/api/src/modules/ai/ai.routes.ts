import { Router } from "express";
import multer from "multer";
import { authenticate } from "@/middleware/authenticate";
import { optionalAuthenticate } from "@/middleware/optional-authenticate";
import {
  healthController,
  detectController,
  depthController,
  analyzeController,
  recommendController,
  chatController,
  getConversationsController,
  getConversationByIdController,
  placementController,
  visualRecommendationController,
} from "./ai.controller";

export const aiRouter = Router();

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // Transport-level validation: max 10MB
});

// Note: /api/ai/health is accessible without auth to allow infrastructure health checks
aiRouter.get("/health", healthController);

aiRouter.post("/detect", authenticate, upload.single("image"), detectController);
aiRouter.post("/depth", authenticate, upload.single("image"), depthController);
aiRouter.post("/analyze", authenticate, upload.single("image"), analyzeController);
aiRouter.post("/recommend", authenticate, recommendController);
aiRouter.post("/placement", authenticate, upload.single("image"), placementController);
aiRouter.post("/chat", optionalAuthenticate, chatController);
aiRouter.get("/chat/conversations", authenticate, getConversationsController);
aiRouter.get("/chat/conversations/:conversationId", authenticate, getConversationByIdController);
aiRouter.post("/visual-recommend", authenticate, upload.single("image"), visualRecommendationController);
