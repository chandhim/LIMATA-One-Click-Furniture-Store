import axios from "axios";

import { getApiBaseUrl } from "./env";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = useAuthStore.getState().token;

    if (token) {
      if (typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }

  if (config.data instanceof FormData && config.headers) {
    if (typeof config.headers.delete === "function") {
      config.headers.delete("Content-Type");
      config.headers.delete("content-type");
    } else {
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }

    return Promise.reject(error);
  },
);

export default api;
