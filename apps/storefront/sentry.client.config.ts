import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry
  debug: false,

  // Enable replay only in production
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  // Ignore specific errors
  ignoreErrors: [
    // Random plugins/extensions
    "top.GLOBALS",
    // See: http://blog.errorception.com/2012/03/tale-of-unfindable-js-error.html
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.telecharge.com/",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "http://loading.retry.widdit.com/",
    "atomicFindClose",
    // Other common errors to ignore
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  // Filter out transactions from health checks
  beforeSendTransaction(event) {
    if (event.transaction === "GET /api/health") {
      return null;
    }
    return event;
  },
});
