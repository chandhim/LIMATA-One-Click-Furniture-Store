"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { register } from "../api/auth";
import { registerSchema, type RegisterSchema } from "../schemas/auth.schemas";
import { useAuthStore } from "../store/use-auth-store";

export function RegisterForm() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const session = await register(values);
      setSession(session);
      router.replace("/dashboard");
    } catch (error) {
      form.setError("root", {
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-2 text-sm text-slate-600">Register to start your LIMATA session.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Name</span>
        <input
          {...form.register("name")}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          type="text"
          placeholder="Your name"
        />
        {form.formState.errors.name ? (
          <span className="text-sm text-rose-600">{form.formState.errors.name.message}</span>
        ) : null}
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Email</span>
        <input
          {...form.register("email")}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          type="email"
          placeholder="you@example.com"
        />
        {form.formState.errors.email ? (
          <span className="text-sm text-rose-600">{form.formState.errors.email.message}</span>
        ) : null}
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Password</span>
        <input
          {...form.register("password")}
          className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-slate-900"
          type="password"
          placeholder="Choose a password"
        />
        {form.formState.errors.password ? (
          <span className="text-sm text-rose-600">{form.formState.errors.password.message}</span>
        ) : null}
      </label>

      {form.formState.errors.root ? (
        <p className="text-sm text-rose-600">{form.formState.errors.root.message}</p>
      ) : null}

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-slate-900 underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </form>
  );
}