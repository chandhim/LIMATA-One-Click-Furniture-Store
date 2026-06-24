import { Role } from "@prisma/client";
import { Router } from "express";
import multer from "multer";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import {
  adminController,
  loginController,
  profileController,
  registerController,
  updateProfileController,
  uploadAvatarController,
} from "./auth.controller";

export const authRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/profile", authenticate, profileController);
authRouter.put("/profile", authenticate, updateProfileController);
authRouter.post(
  "/profile/avatar",
  authenticate,
  upload.single("avatar"),
  uploadAvatarController,
);
authRouter.get("/admin", authenticate, authorize(Role.ADMIN), adminController);
