"use client";

import { createContext, useContext, useMemo } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthProviderProps {
  children: React.ReactNode;
  enabled: boolean;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthStateValue {
  enabled: boolean;
  session: Session | null;
  status: AuthStatus;
  update: (data?: unknown) => Promise<Session | null>;
}

const noopUpdate = async () => null;

const AuthStateContext = createContext<AuthStateValue>({
  enabled: false,
  session: null,
  status: "unauthenticated",
  update: noopUpdate,
});

function AuthStateBridge({ children }: { children: React.ReactNode }) {
  const { data, status, update } = useSession();

  const value = useMemo<AuthStateValue>(
    () => ({
      enabled: true,
      session: data ?? null,
      status,
      update,
    }),
    [data, status, update]
  );

  return <AuthStateContext.Provider value={value}>{children}</AuthStateContext.Provider>;
}

export function AuthProvider({ children, enabled }: AuthProviderProps) {
  if (!enabled) {
    return (
      <AuthStateContext.Provider
        value={{
          enabled: false,
          session: null,
          status: "unauthenticated",
          update: noopUpdate,
        }}
      >
        {children}
      </AuthStateContext.Provider>
    );
  }

  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <AuthStateBridge>{children}</AuthStateBridge>
    </SessionProvider>
  );
}

export function useAuthState() {
  return useContext(AuthStateContext);
}
