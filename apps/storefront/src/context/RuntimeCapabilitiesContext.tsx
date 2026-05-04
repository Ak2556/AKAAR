"use client";

import { createContext, useContext } from "react";
import type { RuntimeCapabilities } from "@/lib/runtime-capabilities";

const RuntimeCapabilitiesContext = createContext<RuntimeCapabilities | null>(null);

export function RuntimeCapabilitiesProvider({
  capabilities,
  children,
}: {
  capabilities: RuntimeCapabilities;
  children: React.ReactNode;
}) {
  return (
    <RuntimeCapabilitiesContext.Provider value={capabilities}>
      {children}
    </RuntimeCapabilitiesContext.Provider>
  );
}

export function useRuntimeCapabilities() {
  const context = useContext(RuntimeCapabilitiesContext);
  if (!context) {
    throw new Error("useRuntimeCapabilities must be used within a RuntimeCapabilitiesProvider");
  }
  return context;
}
