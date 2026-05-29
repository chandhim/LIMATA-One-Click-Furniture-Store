"use client";

import { useEffect, useState } from "react";

import { MainLayout } from "@/components/layout/main-layout";
import { getAdminAccess } from "@/features/auth/api/auth";
import { useAuthBootstrap, useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import type { AuthRole } from "@/features/auth/types/auth.types";

export default function AdminPage() {
  useAuthBootstrap();
  const { isHydrated } = useAuthGuard("ADMIN" as AuthRole);
  const [message, setMessage] = useState<string>("Loading admin data...");

  useEffect(() => {
    let active = true;

    async function loadAdminAccess() {
      try {
        const response = await getAdminAccess();

        if (active) {
          setMessage(`Admin access granted for ${response.role}`);
        }
      } catch (error) {
        if (active) {
          setMessage(error instanceof Error ? error.message : "Failed to load admin data");
        }
      }
    }

    if (isHydrated) {
      void loadAdminAccess();
    }

    return () => {
      active = false;
    };
  }, [isHydrated]);

  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Admin</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Restricted area</h1>
          <p className="mt-4 text-slate-600">{message}</p>
        </div>
      </section>
    </MainLayout>
  );
}