"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface AuthProviderProps {
  children: React.ReactNode;
  enabled: boolean;
}

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

// Shape compatible with existing consumers
interface CompatSession {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role?: "CUSTOMER" | "ADMIN";
  };
}

interface AuthStateValue {
  enabled: boolean;
  session: CompatSession | null;
  supabaseSession: Session | null;
  user: User | null;
  status: AuthStatus;
  update: (data?: unknown) => Promise<CompatSession | null>;
  signOut: () => Promise<void>;
}

const noopUpdate = async () => null;
const noopSignOut = async () => {};

const AuthStateContext = createContext<AuthStateValue>({
  enabled: false,
  session: null,
  supabaseSession: null,
  user: null,
  status: "unauthenticated",
  update: noopUpdate,
  signOut: noopSignOut,
});

function toCompatSession(
  supabaseSession: Session | null,
  profile?: { name?: string | null; image?: string | null; role?: "CUSTOMER" | "ADMIN" } | null
): CompatSession | null {
  if (!supabaseSession?.user) return null;
  const u = supabaseSession.user;
  return {
    user: {
      id: u.id,
      name: profile?.name ?? u.user_metadata?.name ?? u.user_metadata?.full_name ?? null,
      email: u.email ?? null,
      image: profile?.image ?? u.user_metadata?.avatar_url ?? null,
      role: profile?.role ?? "CUSTOMER",
    },
  };
}

function AuthStateBridge({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ name?: string | null; image?: string | null; role?: "CUSTOMER" | "ADMIN" } | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("name, image, role")
      .eq("id", userId)
      .single();
    setProfile(data);
  }, [supabase]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSupabaseSession(session);
      setStatus(session ? "authenticated" : "unauthenticated");
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSupabaseSession(session);
        setStatus(session ? "authenticated" : "unauthenticated");
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const update = useCallback(async (data?: unknown): Promise<CompatSession | null> => {
    if (data && typeof data === "object" && "name" in data) {
      setProfile((prev) => ({ ...prev, name: (data as { name: string }).name }));
    }
    const { data: { session } } = await supabase.auth.getSession();
    return toCompatSession(session, profile);
  }, [supabase, profile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, [supabase]);

  const session = toCompatSession(supabaseSession, profile);

  return (
    <AuthStateContext.Provider
      value={{
        enabled: true,
        session,
        supabaseSession,
        user: supabaseSession?.user ?? null,
        status,
        update,
        signOut,
      }}
    >
      {children}
    </AuthStateContext.Provider>
  );
}

export function AuthProvider({ children, enabled }: AuthProviderProps) {
  if (!enabled) {
    return (
      <AuthStateContext.Provider
        value={{
          enabled: false,
          session: null,
          supabaseSession: null,
          user: null,
          status: "unauthenticated",
          update: noopUpdate,
          signOut: noopSignOut,
        }}
      >
        {children}
      </AuthStateContext.Provider>
    );
  }

  return <AuthStateBridge>{children}</AuthStateBridge>;
}

export function useAuthState() {
  return useContext(AuthStateContext);
}
