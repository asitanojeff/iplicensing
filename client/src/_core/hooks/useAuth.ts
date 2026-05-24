import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 60_000,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await meQuery.refetch();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    },
  });

  const signIn = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.href = getLoginUrl();
    }
  }, []);

  return useMemo(
    () => ({
      user: meQuery.data ?? null,
      loading: meQuery.isLoading,
      error: meQuery.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
      refresh: meQuery.refetch,
      signIn,
      logout: logoutMutation.mutateAsync,
    }),
    [meQuery.data, meQuery.error, meQuery.isLoading, meQuery.refetch, signIn, logoutMutation.mutateAsync],
  );
}
