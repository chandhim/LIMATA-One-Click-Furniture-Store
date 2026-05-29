import { MainLayout } from "@/components/layout/main-layout";
import Link from "next/link";

export default function HomePage() {
  return (
    <MainLayout>
      <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-7xl items-center justify-center px-6">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            LIMATA Authentication
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            Simple JWT login for the furniture store.
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Register, log in, persist your session locally, and access protected customer and admin screens.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="rounded-full bg-slate-900 px-6 py-3 text-white transition hover:bg-slate-700">
              Create account
            </Link>
            <Link href="/login" className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 transition hover:border-slate-900">
              Login
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}