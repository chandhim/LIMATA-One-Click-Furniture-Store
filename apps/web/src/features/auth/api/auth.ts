import axios from "axios";
import api from "@/lib/axios";

import type {
  AuthSession,
  AuthUser,
  LoginValues,
  RegisterValues,
} from "../types/auth.types";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    // Try to get message from response data
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    // Fallback to status text
    return error.response?.statusText || "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
}

export async function login(values: LoginValues) {
  try {
    const response = await api.post<ApiResponse<AuthSession>>("/auth/login", values);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function register(values: RegisterValues) {
  try {
    const response = await api.post<ApiResponse<AuthSession>>("/auth/register", values);
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getProfile() {
  try {
    const response = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/profile");
    return response.data.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getAdminAccess() {
  try {
    const response = await api.get<ApiResponse<{ userId: string; role: string }>>("/auth/admin");
    return response.data.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function updateProfile(values: Partial<AuthUser>) {
  try {
    const response = await api.put<ApiResponse<{ user: AuthUser }>>("/auth/profile", values);
    return response.data.data.user;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function uploadAvatar(file: File) {
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post<ApiResponse<{ url: string }>>("/auth/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data.url;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}