import { useCallback, useMemo, useState } from "react";

const DEMO_SESSION_KEY = "demo-user-session";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: "licensor";
};

const DEFAULT_DEMO_USER: DemoUser = {
  id: "demo-user",
  name: "Demo User",
  email: "demo@iplicensing.local",
  role: "licensor",
};

function readDemoSession(): DemoUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(DEMO_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as DemoUser;
  } catch {
    return null;
  }
}

function writeDemoSession(user: DemoUser) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(user));
  }
}

function clearDemoSession() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export function useAuth() {
  const [user, setUser] = useState<DemoUser | null>(() => readDemoSession());

  const refresh = useCallback(async () => {
    setUser(readDemoSession());
  }, []);

  const signIn = useCallback(() => {
    writeDemoSession(DEFAULT_DEMO_USER);
    setUser(DEFAULT_DEMO_USER);
  }, []);

  const logout = useCallback(async () => {
    clearDemoSession();
    setUser(null);
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }, []);

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
