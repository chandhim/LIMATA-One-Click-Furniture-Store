"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/features/auth/store/use-auth-store";

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <nav className="border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
          LIMATA
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link href="/profile" className="hover:text-slate-900">
            Profile
          </Link>
          <Link href="/admin" className="hover:text-slate-900">
            Admin
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-900 px-4 py-2 text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Logout{user ? ` (${user.name})` : ""}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-slate-900 px-4 py-2 text-slate-900 transition hover:bg-slate-900 hover:text-white"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}