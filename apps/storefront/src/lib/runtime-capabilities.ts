import {
  hasAuthSecret,
  hasDatabaseUrl,
  hasSupabaseClientConfig,
  getServerEnv,
  hasValue,
  isLocalDataMode,
} from "@/lib/local-runtime";

export type OAuthProviderId = "google" | "github";

export interface RuntimeCapabilities {
  authAvailable: boolean;
  catalogAvailable: boolean;
  quoteSubmissionAvailable: boolean;
  supabaseAvailable: boolean;
  localDataMode: boolean;
  enabledOAuthProviders: OAuthProviderId[];
  isDevelopment: boolean;
  missingConfig: string[];
}

export function getRuntimeCapabilities(): RuntimeCapabilities {
  const localDataMode = isLocalDataMode();
  const databaseConfigured = hasDatabaseUrl();
  const authSecretConfigured = hasAuthSecret();
  const supabaseConfigured = hasSupabaseClientConfig();

  const enabledOAuthProviders: OAuthProviderId[] = [];
  if (
    hasValue(getServerEnv("GOOGLE_CLIENT_ID")) &&
    hasValue(getServerEnv("GOOGLE_CLIENT_SECRET"))
  ) {
    enabledOAuthProviders.push("google");
  }
  if (
    hasValue(getServerEnv("GITHUB_CLIENT_ID")) &&
    hasValue(getServerEnv("GITHUB_CLIENT_SECRET"))
  ) {
    enabledOAuthProviders.push("github");
  }

  const missingConfig: string[] = [];
  if (!localDataMode && !databaseConfigured) {
    missingConfig.push("DATABASE_URL");
  }
  if (!authSecretConfigured) {
    missingConfig.push("AUTH_SECRET or NEXTAUTH_SECRET");
  }
  const supabaseUrlConfigured = hasValue(getServerEnv("NEXT_PUBLIC_SUPABASE_URL"));
  const supabaseKeyConfigured = hasValue(getServerEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
  if (supabaseUrlConfigured !== supabaseKeyConfigured) {
    missingConfig.push(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
    );
  }

  const dataBackendAvailable = localDataMode || databaseConfigured;

  return {
    authAvailable: authSecretConfigured && dataBackendAvailable,
    catalogAvailable: dataBackendAvailable,
    quoteSubmissionAvailable: dataBackendAvailable,
    supabaseAvailable: supabaseConfigured,
    localDataMode,
    enabledOAuthProviders: authSecretConfigured && dataBackendAvailable ? enabledOAuthProviders : [],
    isDevelopment: process.env.NODE_ENV !== "production",
    missingConfig,
  };
}
