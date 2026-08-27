import { Router } from "express";
import { getDeliveryConfigurations, updateDeliveryConfigurations } from "./delivery.controller";
import { authenticate } from "../../middleware/auth";
import { authorize } from "../../middleware/role";
import { Role } from "@prisma/client";

const router = Router();

// Public route for checkout page
router.get("/rates", getDeliveryConfigurations);

// Admin route to update rates
router.put("/rates", authenticate, authorize(Role.ADMIN), updateDeliveryConfigurations);

export default router;
