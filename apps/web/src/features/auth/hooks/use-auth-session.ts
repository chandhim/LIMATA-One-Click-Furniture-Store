"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { AuthRole } from "../types/auth.types";
import { useAuthStore } from "../store/use-auth-store";

export function useAuthBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}

export function useAuthGuard(requiredRole?: AuthRole) {
  const router = useRouter();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRole && user?.role !== requiredRole) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, requiredRole, router, user]);

  return {
    isHydrated,
    isAuthenticated,
    user,
  };
}