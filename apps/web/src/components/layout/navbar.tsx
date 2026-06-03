"use client";

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/features/auth/store/use-auth-store";

export function Navbar() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-semibold tracking-tight text-slate-900">
            LIMATA
          </Link>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-700">
            <Link href="/" className="hover:text-slate-900">
              Home
            </Link>
            <Link href="/products" className="hover:text-slate-900">
              Products
            </Link>
            <a href="#categories" className="hover:text-slate-900">
              Categories
            </a>
            <a href="#about" className="hover:text-slate-900">
              About
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-sm text-slate-700">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-900 px-4 py-2 text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="text-sm text-slate-700 hover:text-slate-900">
                Login
              </Link>
              <Link href="/register" className="rounded-full border border-slate-900 px-3 py-1 text-sm text-slate-900 hover:bg-slate-900 hover:text-white">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white px-6 py-4">
          <div className="flex flex-col gap-3">
            <Link href="/" onClick={() => setOpen(false)}>
              Home
            </Link>
            <Link href="/products" onClick={() => setOpen(false)}>
              Products
            </Link>
            <a href="#categories" onClick={() => setOpen(false)}>
              Categories
            </a>
            <a href="#about" onClick={() => setOpen(false)}>
              About
            </a>
            <div className="pt-2 border-t mt-2 flex gap-2">
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm">
                Login
              </Link>
              <Link href="/register" onClick={() => setOpen(false)} className="ml-2 text-sm font-medium">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}