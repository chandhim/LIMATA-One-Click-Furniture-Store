import { Role } from "@prisma/client";
import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import {
  adminController,
  loginController,
  profileController,
  registerController,
} from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/profile", authenticate, profileController);
authRouter.get("/admin", authenticate, authorize(Role.ADMIN), adminController);