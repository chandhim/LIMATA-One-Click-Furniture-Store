"use client";

import { RegisterForm } from "@/features/auth/components/register-form";
import {
  useAuthBootstrap,
  useRedirectIfAuthenticated,
} from "@/features/auth/hooks/use-auth-session";

export default function RegisterPage() {
  useAuthBootstrap();
  useRedirectIfAuthenticated();

  return <RegisterForm />;
}
