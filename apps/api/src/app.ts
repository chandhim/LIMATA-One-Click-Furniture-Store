import cors from "cors";
import express from "express";
import { loadProjectEnv } from "./config/load-env";
import { authRouter } from "./modules/auth/auth.routes";
import { healthRouter } from "./modules/health/health.route";
import { errorHandler } from "./shared/middleware/error-handler";

loadProjectEnv();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL
      ? process.env.FRONTEND_URL.split(",").map((value) => value.trim())
      : true,
  }),
);

app.use(express.json());

app.use("/api/v1/health", healthRouter);
app.use("/api/auth", authRouter);

app.use(errorHandler);

export default app;