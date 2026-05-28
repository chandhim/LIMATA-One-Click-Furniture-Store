import express from "express";
import cors from "cors";
import { errorHandler } from "./shared/middleware/error-handler";

const app = express();

// app.use(cors());

app.use(
  cors({
    origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  }),
);



app.use(express.json());

app.use(errorHandler);

export default app;