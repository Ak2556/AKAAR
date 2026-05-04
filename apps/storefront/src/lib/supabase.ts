export type SupabaseService = "auth" | "rest" | "storage" | "functions";

export interface SupabaseBrowserConfig {
  url: string;
  publishableKey: string;
  authUrl: string;
  restUrl: string;
  storageUrl: string;
  functionsUrl: string;
}

export function getSupabaseBrowserConfig(): SupabaseBrowserConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !publishableKey) {
    return null;
  }

  const normalizedUrl = url.replace(/\/+$/, "");

  return {
    url: normalizedUrl,
    publishableKey,
    authUrl: `${normalizedUrl}/auth/v1`,
    restUrl: `${normalizedUrl}/rest/v1`,
    storageUrl: `${normalizedUrl}/storage/v1`,
    functionsUrl: `${normalizedUrl}/functions/v1`,
  };
}

export function createSupabaseHeaders(
  publishableKey: string,
  accessToken?: string | null
): HeadersInit {
  const headers: Record<string, string> = {
    apikey: publishableKey,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else {
    headers.Authorization = `Bearer ${publishableKey}`;
  }

  return headers;
}

export function getSupabaseServiceUrl(
  config: SupabaseBrowserConfig,
  service: SupabaseService
): string {
  switch (service) {
    case "auth":
      return config.authUrl;
    case "storage":
      return config.storageUrl;
    case "functions":
      return config.functionsUrl;
    case "rest":
    default:
      return config.restUrl;
  }
}

export function buildSupabaseUrl(
  config: SupabaseBrowserConfig,
  path: string,
  service: SupabaseService = "rest"
): string {
  const baseUrl = getSupabaseServiceUrl(config, service);
  const normalizedPath = path.replace(/^\/+/, "");
  return `${baseUrl}/${normalizedPath}`;
}

export async function supabaseFetch(
  path: string,
  init: RequestInit = {},
  options: {
    accessToken?: string | null;
    config?: SupabaseBrowserConfig | null;
    service?: SupabaseService;
  } = {}
): Promise<Response> {
  const config = options.config ?? getSupabaseBrowserConfig();

  if (!config) {
    throw new Error("Supabase frontend configuration is missing.");
  }

  const headers = new Headers(init.headers ?? undefined);
  const defaultHeaders = createSupabaseHeaders(
    config.publishableKey,
    options.accessToken
  );

  for (const [key, value] of Object.entries(defaultHeaders)) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }

  return fetch(buildSupabaseUrl(config, path, options.service), {
    ...init,
    headers,
  });
}
