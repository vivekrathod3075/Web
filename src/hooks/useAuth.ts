import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: oauthUser,
    isLoading: oauthLoading,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const {
    data: localUser,
    isLoading: localLoading,
  } = trpc.localAuth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("local_auth_token");
    logoutMutation.mutate();
    setTimeout(() => {
      window.location.reload();
    }, 200);
  }, [logoutMutation]);

  const user = oauthUser
    ? {
        id: oauthUser.id,
        name: oauthUser.name || "User",
        email: oauthUser.email,
        avatar: oauthUser.avatar,
        role: oauthUser.role,
        authType: "oauth" as const,
      }
    : localUser
      ? {
          id: localUser.id,
          name: localUser.name || localUser.username,
          email: null,
          avatar: null,
          role: localUser.role,
          authType: "local" as const,
        }
      : null;

  const isLoading = oauthLoading || localLoading;
  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      isAdmin,
      isLoading,
      logout,
    }),
    [user, isAuthenticated, isAdmin, isLoading, logout],
  );
}
