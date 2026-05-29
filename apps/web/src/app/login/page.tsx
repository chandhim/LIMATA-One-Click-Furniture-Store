"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-session";

export default function LoginPage() {
  useAuthBootstrap();

  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </section>
    </MainLayout>
  );
}