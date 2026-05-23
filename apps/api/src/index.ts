import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { healthRouter } from "./features/health/health.route";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(cors());
app.use(express.json());
app.use("/api/v1/health", healthRouter);

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
