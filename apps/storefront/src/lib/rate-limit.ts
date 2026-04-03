import { NextResponse } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// For production, consider using Redis via @upstash/ratelimit
const rateLimitStore = new Map<string, RateLimitStore>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
}

// Presets for different endpoints
export const rateLimitPresets = {
  // Strict: 5 requests per minute (login, password reset)
  strict: { windowMs: 60 * 1000, maxRequests: 5 },
  // Standard: 10 requests per minute (registration)
  standard: { windowMs: 60 * 1000, maxRequests: 10 },
  // Relaxed: 30 requests per minute (general API)
  relaxed: { windowMs: 60 * 1000, maxRequests: 30 },
} as const;

// Clean up expired entries periodically
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now >= value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}

export function getClientIp(request: Request): string {
  // Check various headers for client IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - in production this should never happen
  return "unknown";
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const key = identifier;

  let record = rateLimitStore.get(key);

  // If no record or window expired, create new record
  if (!record || now >= record.resetTime) {
    record = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    };
  }

  // Increment counter
  record.count++;
  rateLimitStore.set(key, record);

  const remaining = Math.max(0, config.maxRequests - record.count);
  const resetIn = Math.ceil((record.resetTime - now) / 1000);

  return {
    allowed: record.count <= config.maxRequests,
    remaining,
    resetIn,
  };
}

export function rateLimitResponse(resetIn: number): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
      retryAfter: resetIn,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(resetIn),
        "X-RateLimit-Remaining": "0",
      },
    }
  );
}

// Helper to apply rate limiting to a route
export async function withRateLimit(
  request: Request,
  config: RateLimitConfig = rateLimitPresets.standard
): Promise<NextResponse | null> {
  const ip = getClientIp(request);
  const endpoint = new URL(request.url).pathname;
  const identifier = `${ip}:${endpoint}`;

  const result = checkRateLimit(identifier, config);

  if (!result.allowed) {
    return rateLimitResponse(result.resetIn);
  }

  return null; // Request allowed
}
