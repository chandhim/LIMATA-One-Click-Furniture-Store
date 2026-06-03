"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { useAuthGuard, useAuthBootstrap } from "@/features/auth/hooks/use-auth-session";
import { useAuthStore } from "@/features/auth/store/use-auth-store";

export default function DashboardPage() {
  useAuthBootstrap();
  const { isHydrated, isAuthenticated, user } = useAuthGuard();
  const clearSession = useAuthStore((state) => state.clearSession);

  if (!isHydrated) {
    return null;
  }

  return (
    <MainLayout>
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Dashboard</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Welcome{user ? `, ${user.name}` : ""}</h1>
          <p className="mt-4 text-slate-600">
            {isAuthenticated
              ? "Your JWT session is stored locally and attached to API requests automatically."
              : "Redirecting to login..."}
          </p>

          {user ? (
            <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Email</span>
                <p className="mt-1 font-medium text-slate-950">{user.email}</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Role</span>
                <p className="mt-1 font-medium text-slate-950">{user.role}</p>
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={clearSession}
            className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </section>
    </MainLayout>
  );
}