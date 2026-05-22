export type OAuthProviderId = "google" | "github";

export interface RuntimeCapabilities {
  authAvailable: boolean;
  catalogAvailable: boolean;
  fileUploadsAvailable: boolean;
  quoteSubmissionAvailable: boolean;
  supabaseAvailable: boolean;
  localDataMode: boolean;
  enabledOAuthProviders: OAuthProviderId[];
  isDevelopment: boolean;
  missingConfig: string[];
}

function hasValue(value: string | undefined): boolean {
  return Boolean(value && value.trim().length > 0);
}

export function getRuntimeCapabilities(): RuntimeCapabilities {
  // Read directly from process.env — reliable in both dev and Vercel server components
  const supabaseUrl = hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const supabaseKey = hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  const supabaseAvailable = supabaseUrl && supabaseKey
  const awsAccessKey = hasValue(process.env.AWS_ACCESS_KEY_ID)
  const awsSecretKey = hasValue(process.env.AWS_SECRET_ACCESS_KEY)
  const awsBucket = hasValue(process.env.AWS_S3_BUCKET)
  const fileUploadsAvailable = awsAccessKey && awsSecretKey && awsBucket

  const missingConfig: string[] = []
  if (!supabaseUrl) missingConfig.push("NEXT_PUBLIC_SUPABASE_URL")
  if (!supabaseKey) missingConfig.push("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  if (!hasValue(process.env.SUPABASE_SERVICE_ROLE_KEY)) missingConfig.push("SUPABASE_SERVICE_ROLE_KEY")
  if (!awsAccessKey) missingConfig.push("AWS_ACCESS_KEY_ID")
  if (!awsSecretKey) missingConfig.push("AWS_SECRET_ACCESS_KEY")
  if (!awsBucket) missingConfig.push("AWS_S3_BUCKET")

  const enabledOAuthProviders: OAuthProviderId[] = []
  if (hasValue(process.env.GOOGLE_CLIENT_ID)) enabledOAuthProviders.push("google")
  if (hasValue(process.env.GITHUB_CLIENT_ID)) enabledOAuthProviders.push("github")

  return {
    authAvailable:            supabaseAvailable,
    catalogAvailable:         supabaseAvailable,
    fileUploadsAvailable,
    quoteSubmissionAvailable: supabaseAvailable && fileUploadsAvailable,
    supabaseAvailable,
    localDataMode:            false,
    enabledOAuthProviders:    supabaseAvailable ? enabledOAuthProviders : [],
    isDevelopment:            process.env.NODE_ENV !== "production",
    missingConfig,
  };
}
