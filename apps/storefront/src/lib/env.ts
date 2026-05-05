import { z } from "zod";

const envSchema = z.object({
  // Supabase (required)
  NEXT_PUBLIC_SUPABASE_URL:      z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY:     z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // Payment (Razorpay)
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_ID:             z.string().optional(),
  RAZORPAY_KEY_SECRET:         z.string().optional(),

  // AWS S3
  AWS_ACCESS_KEY_ID:     z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION:            z.string().default("ap-south-1"),
  AWS_S3_BUCKET:         z.string().optional(),

  // Email
  SMTP_HOST:  z.string().optional(),
  SMTP_PORT:  z.string().transform((v) => parseInt(v, 10)).optional(),
  SMTP_USER:  z.string().optional(),
  SMTP_PASS:  z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),

  // App
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),

  // OAuth (configured via Supabase dashboard, but kept for detection)
  GOOGLE_CLIENT_ID:     z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GITHUB_CLIENT_ID:     z.string().optional(),
  GITHUB_CLIENT_SECRET: z.string().optional(),

  // Sentry (optional)
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  SENTRY_DSN:             z.string().url().optional(),
  SENTRY_ORG:             z.string().optional(),
  SENTRY_PROJECT:         z.string().optional(),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
    if (process.env.NODE_ENV === "production") {
      throw new Error("Invalid environment variables. Check server logs.");
    }
    console.warn("Continuing with potentially invalid environment in development mode.");
  }
  return parsed.data as Env;
}

export const env = validateEnv();

export function isPaymentConfigured()  { return !!(env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) }
export function isS3Configured()       { return !!(env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET) }
export function isEmailConfigured()    { return !!(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS) }
export function isSentryConfigured()   { return !!(env.NEXT_PUBLIC_SENTRY_DSN || env.SENTRY_DSN) }
export function isSupabaseConfigured() { return !!(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY) }
