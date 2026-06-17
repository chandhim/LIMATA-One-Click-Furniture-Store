import { Router } from "express";
import { authenticate } from "@/middleware/authenticate";
import {
  createPaymentParamsController,
  payHereNotifyController,
} from "./payment.controller";

export const paymentsRouter = Router();

// Endpoint for generating client initiation hash and parameters
paymentsRouter.post("/create", authenticate, createPaymentParamsController);

// Public webhook endpoint for PayHere notifications
paymentsRouter.post("/notify", payHereNotifyController);
