"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { useAuthBootstrap } from "@/features/auth/hooks/use-auth-session";

export default function RegisterPage() {
  useAuthBootstrap();

  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </section>
    </MainLayout>
  );
}