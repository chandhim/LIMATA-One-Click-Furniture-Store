import dotenv from "dotenv";
import app from "./app";
import { healthRouter } from "./modules/health/health.route";

dotenv.config();

const port = Number(process.env.API_PORT ?? 4000);

app.use("/api/v1/health", healthRouter);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});