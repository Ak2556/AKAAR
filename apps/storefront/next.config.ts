import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@akaar/db"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  async redirects() {
    return [
      { source: '/team/mohit-sheravat', destination: '/team/mohit-sherawat', permanent: true },
      { source: '/team/tarveen-sheravat', destination: '/team/tarveen-sherawat', permanent: true },
      // Legacy OG image path — now served by the programmatic /og route
      { source: '/og-default.jpg', destination: '/og', permanent: false },
    ]
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Source-map upload and release creation only make sense when an auth token is
// configured (CI / production deploys). Without one the Sentry plugin would
// print "No auth token provided" warnings on every local build.
const hasSentryToken = Boolean(process.env.SENTRY_AUTH_TOKEN);

export default bundleAnalyzer(withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Suppress all non-error Sentry output when there is no auth token
  silent: !hasSentryToken,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Skip source-map upload and release creation when no token is present
  sourcemaps: { disable: !hasSentryToken },
  release: { create: hasSentryToken, finalize: hasSentryToken },

  // Vercel Cron monitoring requires an authenticated release
  automaticVercelMonitors: hasSentryToken,
}));
