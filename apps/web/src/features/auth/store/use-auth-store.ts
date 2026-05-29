import { create } from "zustand";

import type { AuthRole, AuthSession, AuthUser } from "../types/auth.types";

const storageKey = "limata-auth-session";

type AuthStore = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  hydrate: () => void;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  hasRole: (role: AuthRole) => boolean;
};

function readStoredSession() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedSession = window.localStorage.getItem(storageKey);

  if (!storedSession) {
    return null;
  }

  try {
    return JSON.parse(storedSession) as AuthSession;
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(storageKey);
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  hydrate: () => {
    const session = readStoredSession();

    if (session) {
      set({
        user: session.user,
        token: session.token,
        isAuthenticated: true,
        isHydrated: true,
      });
      return;
    }

    set({ isHydrated: true });
  },
  setSession: (session) => {
    persistSession(session);
    set({
      user: session.user,
      token: session.token,
      isAuthenticated: true,
      isHydrated: true,
    });
  },
  clearSession: () => {
    persistSession(null);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },
  hasRole: (role) => get().user?.role === role,
}));