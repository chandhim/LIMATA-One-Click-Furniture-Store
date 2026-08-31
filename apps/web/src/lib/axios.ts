import axios, { AxiosError } from "axios";
import { toast } from "sonner";

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

export interface AppError {
  isAppError: true;
  status: number | null;
  message: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'rate-limit' | 'unknown';
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    let status: number | null = null;
    let type: AppError['type'] = 'unknown';
    let message = "Something went wrong. Please try again.";

    if (error.response) {
      status = error.response.status;
      
      if (status === 401) {
        type = 'auth';
        message = "Your session has expired. Please sign in again.";
        if (typeof window !== "undefined") {
          const state = useAuthStore.getState();
          if (state.token) {
            state.clearSession();
            toast.error(message);
          } else {
            message = "Please sign in to use this feature.";
          }
        }
      } else if (status === 403) {
        type = 'auth';
        message = "You don't have access to this feature.";
      } else if (status === 400 || status === 422) {
        type = 'validation';
        message = "We couldn't process that request.";
        
        // Extract safe backend message if available
        const data = error.response.data as any;
        if (data && typeof data.message === 'string' && data.message.length < 100) {
          message = data.message;
        } else if (data && data.detail && typeof data.detail === 'string' && data.detail.length < 100) {
           message = data.detail;
        }
      } else if (status === 413) {
        type = 'validation';
        message = "That image is a bit too large. Try uploading a smaller file.";
      } else if (status === 429) {
        type = 'rate-limit';
        message = "Take a breath! You're going too fast. Try again shortly.";
      } else if (status === 404) {
         type = 'unknown';
         message = "We couldn't find what you're looking for.";
      } else if (status >= 500) {
        type = 'server';
        message = "We're having trouble connecting right now. Please try again shortly.";
      }
    } else if (error.request) {
      type = 'network';
      message = "Looks like you're offline or unable to connect. Please check your internet connection.";
    }

    const appError: AppError = {
      isAppError: true,
      status,
      message,
      type
    };

    return Promise.reject(appError);
  },
);

export default api;
