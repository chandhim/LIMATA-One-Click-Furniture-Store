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

export async function login(values: LoginValues) {
  const response = await api.post<ApiResponse<AuthSession>>("/auth/login", values);
  return response.data.data;
}

export async function register(values: RegisterValues) {
  const response = await api.post<ApiResponse<AuthSession>>("/auth/register", values);
  return response.data.data;
}

export async function getProfile() {
  const response = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/profile");
  return response.data.data.user;
}

export async function getAdminAccess() {
  const response = await api.get<ApiResponse<{ userId: string; role: string }>>("/auth/admin");
  return response.data.data;
}