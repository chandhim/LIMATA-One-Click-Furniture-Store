import { Router } from "express";
import multer from "multer";
import { authenticate } from "@/middleware/authenticate";
import {
  healthController,
  detectController,
  depthController,
  analyzeController,
  recommendController,
  chatController,
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
aiRouter.post("/chat", authenticate, chatController);
