"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRuntimeCapabilities } from "@/context/RuntimeCapabilitiesContext";
import { Logo } from "@/components/ui/Logo";
import { FieldBlock, MetricTile } from "@/components/ui/storefront-primitives";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authAvailable, enabledOAuthProviders } = useRuntimeCapabilities();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!authAvailable) {
      setFormError("Authentication is unavailable in this environment.");
      return;
    }

    setIsLoading(true);
    setFormError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setFormError(error.message === "Invalid login credentials" ? "Invalid email or password" : error.message);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: string) => {
    if (!authAvailable) {
      setFormError("Authentication is unavailable in this environment.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: provider as "google" | "github",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${callbackUrl}` },
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-5xl">
      <div className="luxury-card overflow-hidden rounded-[2.3rem]">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="luxury-stage flex flex-col justify-between px-8 py-10 sm:px-10">
            <div>
              <Logo size="lg" />
              <span className="luxury-kicker mt-10 block">Member access</span>
              <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                Return to your production workspace.
              </h1>
              <p className="mt-5 max-w-md text-[var(--text-secondary)]">
                Review quotes, manage orders, and continue builds from the same account used across the collection, wishlist, and checkout flow.
              </p>
            </div>

            <div className="mt-12 grid gap-px overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              <MetricTile label="Quotes" value="Tracked" />
              <MetricTile label="Orders" value="Live status" />
            </div>
          </div>

          <div className="px-8 py-10 sm:px-10">
            <span className="luxury-kicker">Sign in</span>
            <h2 className="display-font mt-4 text-3xl text-[var(--text-primary)] sm:text-4xl">Welcome back</h2>
            <p className="mt-3 text-[var(--text-secondary)]">Use your AKAAR account to continue with builds, saved products, and checkout.</p>

            {error || formError ? (
              <div className="mt-6 rounded-[1.5rem] border border-red-500/35 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                {formError || "Authentication failed. Please try again."}
              </div>
            ) : null}

            {!authAvailable ? (
              <div className="mt-6 rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
                Authentication is unavailable in this environment. Add database and auth secrets to enable sign-in.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FieldBlock label="Email">
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    required
                    className="luxury-input w-full rounded-full py-3 pl-11 pr-4"
                  />
                </div>
              </FieldBlock>

              <FieldBlock label="Password" action={<Link href="/auth/forgot-password" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">Forgot password?</Link>}>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    className="luxury-input w-full rounded-full py-3 pl-11 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </FieldBlock>

              <button
                type="submit"
                disabled={isLoading || !authAvailable}
                className="inline-flex w-full items-center justify-center rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {enabledOAuthProviders.length > 0 ? (
              <>
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border)]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[var(--bg-secondary)] px-4 text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {enabledOAuthProviders.includes("google") ? (
                    <OAuthButton label="Google" onClick={() => handleOAuthSignIn("google")} />
                  ) : null}
                  {enabledOAuthProviders.includes("github") ? (
                    <OAuthButton label="GitHub" onClick={() => handleOAuthSignIn("github")} />
                  ) : null}
                </div>
              </>
            ) : null}

            <p className="mt-8 text-sm text-[var(--text-secondary)]">
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-[var(--text-primary)] hover:text-[var(--accent)]">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-12 pt-28 sm:px-6">
      <Suspense
        fallback={
          <div className="w-full max-w-md">
            <div className="luxury-card rounded-[2rem] p-8 flex items-center justify-center">
              <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
            </div>
          </div>
        }
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}

function InfoMetric({ label, value }: { label: string; value: string }) {
  return (
    <MetricTile label={label} value={value} />
  );
}

function OAuthButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[var(--border-accent)] px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-highlight)]"
    >
      {label}
    </button>
  );
}
