"use client";

import { useEffect, useState } from "react";

import { MainLayout } from "@/components/layout/main-layout";
import { getProfile } from "@/features/auth/api/auth";
import { useAuthBootstrap, useAuthGuard } from "@/features/auth/hooks/use-auth-session";
import type { AuthUser } from "@/features/auth/types/auth.types";

export default function ProfilePage() {
  useAuthBootstrap();
  const { isHydrated } = useAuthGuard();
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const response = await getProfile();

        if (active) {
          setProfile(response);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error instanceof Error ? error.message : "Failed to load profile");
        }
      }
    }

    if (isHydrated) {
      void loadProfile();
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Profile</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Account details</h1>

          {errorMessage ? (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</p>
          ) : null}

          {profile ? (
            <div className="mt-6 grid gap-3 rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 sm:grid-cols-2">
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Name</span>
                <p className="mt-1 font-medium text-slate-950">{profile.name}</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Email</span>
                <p className="mt-1 font-medium text-slate-950">{profile.email}</p>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Role</span>
                <p className="mt-1 font-medium text-slate-950">{profile.role}</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </MainLayout>
  );
}