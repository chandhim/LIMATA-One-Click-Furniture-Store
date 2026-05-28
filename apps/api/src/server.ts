import app from "./app";
import { loadProjectEnv } from "./config/load-env";
import { healthRouter } from "./modules/health/health.route";
import { errorHandler } from "./shared/middleware/error-handler";

app.use(errorHandler);

loadProjectEnv();

// const port = Number(process.env.API_PORT ?? 4000);

const port = Number(process.env.PORT ?? process.env.API_PORT ?? 4000);


app.use("/api/v1/health", healthRouter);

app.listen(port, () => {
  console.log(`API running on port ${port}`);
});