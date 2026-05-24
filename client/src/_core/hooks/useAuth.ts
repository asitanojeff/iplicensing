import { useCallback, useEffect, useMemo, useState } from "react";

export type DemoUserRole = "licensor" | "licensee" | "reviewer";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
};

const AUTH_STORAGE_KEY = "demo-auth-user";

function readStoredUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = "/sign-in" } = options ?? {};
  const [user, setUser] = useState<DemoUser | null>(() => readStoredUser());

  useEffect(() => {
    const sync = () => setUser(readStoredUser());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const signIn = useCallback((nextUser: DemoUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  const refresh = useCallback(() => {
    setUser(readStoredUser());
  }, []);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    window.location.href = redirectPath;
  }, [redirectOnUnauthenticated, redirectPath, user]);

  return useMemo(
    () => ({
      user,
      loading: false,
      error: null,
      isAuthenticated: Boolean(user),
      refresh,
      signIn,
      logout,
    }),
    [user, refresh, signIn, logout],
  );
}
