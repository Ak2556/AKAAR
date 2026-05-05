import { existsSync, readFileSync } from "fs";
import path from "path";

export function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

function readEnvFile(): string {
  const envPath = path.join(process.cwd(), ".env");
  if (!existsSync(envPath)) return "";
  try {
    return readFileSync(envPath, "utf8");
  } catch {
    return "";
  }
}

function parseEnvValue(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

export function getServerEnv(name: string): string | undefined {
  const runtimeValue = process.env[name];
  if (hasValue(runtimeValue)) return runtimeValue;

  const envContents = readEnvFile();
  if (!envContents) return undefined;

  const pattern = new RegExp(`^${name}=(.*)$`, "m");
  const match = envContents.match(pattern);
  if (!match) return undefined;

  const value = parseEnvValue(match[1]);
  return hasValue(value) ? value : undefined;
}

// Legacy shims — kept so old imports don't break
export function isLocalDataMode(): boolean { return false; }
export function hasDatabaseUrl(): boolean  { return false; }
export function hasAuthSecret(): boolean   { return hasSupabaseClientConfig(); }
export function hasRazorpayCredentials(): boolean {
  return hasValue(getServerEnv("RAZORPAY_KEY_ID")) && hasValue(getServerEnv("RAZORPAY_KEY_SECRET"));
}
export function hasSupabaseClientConfig(): boolean {
  return (
    hasValue(getServerEnv("NEXT_PUBLIC_SUPABASE_URL")) &&
    hasValue(getServerEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"))
  );
}
