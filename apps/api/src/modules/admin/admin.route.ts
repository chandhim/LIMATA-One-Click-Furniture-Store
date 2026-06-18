import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "@/middleware/authenticate";
import { authorize } from "@/middleware/authorize";
import {
  getAdminStatsController,
  listAdminUsersController,
  updateAdminUserRoleController,
  toggleAdminUserStatusController,
  listAdminReviewsController,
  toggleReviewApprovalController,
  deleteAdminReviewController,
  listAdminCategoriesController,
  createAdminCategoryController,
  deleteAdminCategoryController,
  getAdminSettingsController,
  updateAdminSettingsController,
} from "./admin.controller";

export const adminRouter = Router();

// Require authenticating and admin role for all admin routes
adminRouter.use(authenticate, authorize(Role.ADMIN));

// Overview stats
adminRouter.get("/stats", getAdminStatsController);

// User/Customer management
adminRouter.get("/users", listAdminUsersController);
adminRouter.patch("/users/:userId/role", updateAdminUserRoleController);
adminRouter.patch("/users/:userId/status", toggleAdminUserStatusController);

// Reviews management
adminRouter.get("/reviews", listAdminReviewsController);
adminRouter.patch("/reviews/:reviewId/approve", toggleReviewApprovalController);
adminRouter.delete("/reviews/:reviewId", deleteAdminReviewController);

// Categories CRUD
adminRouter.get("/categories", listAdminCategoriesController);
adminRouter.post("/categories", createAdminCategoryController);
adminRouter.delete("/categories/:categoryId", deleteAdminCategoryController);

// CMS store settings
adminRouter.get("/settings", getAdminSettingsController);
adminRouter.put("/settings", updateAdminSettingsController);
