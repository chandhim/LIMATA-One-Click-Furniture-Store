"use client";

import { LoginForm } from "@/features/auth/components/login-form";
import {
  useAuthBootstrap,
  useRedirectIfAuthenticated,
} from "@/features/auth/hooks/use-auth-session";

export default function LoginPage() {
  useAuthBootstrap();
  useRedirectIfAuthenticated();

  return <LoginForm />;
}
