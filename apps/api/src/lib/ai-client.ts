import axios from "axios";

const AI_SERVICE_HOST = process.env.AI_SERVICE_HOST || "localhost";
const AI_SERVICE_PORT = process.env.AI_SERVICE_PORT || "8000";
const AI_SERVICE_TIMEOUT = parseInt(process.env.AI_SERVICE_TIMEOUT || "5000", 10);

const baseURL = `http://${AI_SERVICE_HOST}:${AI_SERVICE_PORT}`;

export const aiClient = axios.create({
  baseURL,
  timeout: AI_SERVICE_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// Future interceptors can be configured here
