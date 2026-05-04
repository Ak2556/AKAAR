import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";

export async function getOptionalSession(): Promise<Session | null> {
  if (!getRuntimeCapabilities().authAvailable) {
    return null;
  }

  try {
    return await auth();
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session | null> {
  return getOptionalSession();
}
