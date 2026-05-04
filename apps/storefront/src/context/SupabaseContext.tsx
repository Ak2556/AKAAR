"use client";

import { createContext, useContext, useMemo } from "react";
import {
  buildSupabaseUrl,
  getSupabaseBrowserConfig,
  supabaseFetch,
  type SupabaseBrowserConfig,
  type SupabaseService,
} from "@/lib/supabase";

interface SupabaseContextValue {
  configured: boolean;
  config: SupabaseBrowserConfig | null;
  buildUrl: (path: string, service?: SupabaseService) => string | null;
  fetchFromSupabase: (
    path: string,
    init?: RequestInit,
    options?: {
      accessToken?: string | null;
      service?: SupabaseService;
    }
  ) => Promise<Response>;
}

const missingConfigError = "Supabase frontend configuration is missing.";

const SupabaseContext = createContext<SupabaseContextValue | null>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo<SupabaseContextValue>(() => {
    const config = getSupabaseBrowserConfig();

    return {
      configured: Boolean(config),
      config,
      buildUrl: (path, service = "rest") => {
        if (!config) {
          return null;
        }

        return buildSupabaseUrl(config, path, service);
      },
      fetchFromSupabase: async (path, init = {}, options = {}) => {
        if (!config) {
          throw new Error(missingConfigError);
        }

        return supabaseFetch(path, init, {
          accessToken: options.accessToken,
          config,
          service: options.service,
        });
      },
    };
  }, []);

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);

  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }

  return context;
}
