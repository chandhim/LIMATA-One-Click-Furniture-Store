"use client";

import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useAuthBootstrap();
  return <>{children}</>;
}
