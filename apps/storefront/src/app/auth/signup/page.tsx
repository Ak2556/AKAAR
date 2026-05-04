"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useRuntimeCapabilities } from "@/context/RuntimeCapabilitiesContext";
import { Logo } from "@/components/ui/Logo";
import { FieldBlock, MetricTile } from "@/components/ui/storefront-primitives";

export default function SignUpPage() {
  const router = useRouter();
  const { authAvailable, enabledOAuthProviders } = useRuntimeCapabilities();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const passwordRequirements = [
    { met: password.length >= 8, text: "At least 8 characters" },
    { met: /[A-Z]/.test(password), text: "One uppercase letter" },
    { met: /[a-z]/.test(password), text: "One lowercase letter" },
    { met: /[0-9]/.test(password), text: "One number" },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!authAvailable) {
      setError("Authentication is unavailable in this environment.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!passwordRequirements.every((requirement) => requirement.met)) {
      setError("Password does not meet requirements");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create account");
        return;
      }

      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    if (!authAvailable) {
      setError("Authentication is unavailable in this environment.");
      return;
    }
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-12 pt-28 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-6xl">
        <div className="luxury-card overflow-hidden rounded-[2.3rem]">
          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <div className="luxury-stage flex flex-col justify-between px-8 py-10 sm:px-10">
              <div>
                <Logo size="lg" />
                <span className="luxury-kicker mt-10 block">Create an account</span>
                <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                  Join the workspace used for custom parts, quotes, and orders.
                </h1>
                <p className="mt-5 max-w-md text-[var(--text-secondary)]">
                  Your AKAAR account keeps build requests, saved products, and production orders in one place so the process stays traceable from the first upload onward.
                </p>
              </div>

              <div className="mt-12 grid gap-px overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                <MetricTile label="Quotes" value="Saved to account" />
                <MetricTile label="Previews" value="Ready for revisit" />
              </div>
            </div>

            <div className="px-8 py-10 sm:px-10">
              <span className="luxury-kicker">Register</span>
              <h2 className="display-font mt-4 text-3xl text-[var(--text-primary)] sm:text-4xl">Create your AKAAR login</h2>
              <p className="mt-3 text-[var(--text-secondary)]">Use one account for custom builds, product orders, and production follow-up.</p>

              {error ? (
                <div className="mt-6 rounded-[1.5rem] border border-red-500/35 bg-red-500/10 px-5 py-4 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {!authAvailable ? (
                <div className="mt-6 rounded-[1.5rem] border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
                  Authentication is unavailable in this environment. Add database and auth secrets to enable registration.
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <FieldBlock label="Full name">
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="John Doe" required className="luxury-input w-full rounded-full py-3 pl-11 pr-4" />
                  </div>
                </FieldBlock>

                <FieldBlock label="Email">
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required className="luxury-input w-full rounded-full py-3 pl-11 pr-4" />
                  </div>
                </FieldBlock>

                <FieldBlock label="Password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Create a password" required className="luxury-input w-full rounded-full py-3 pl-11 pr-12" />
                    <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FieldBlock>

                {password ? (
                  <div className="grid gap-2 rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4 sm:grid-cols-2">
                    {passwordRequirements.map((requirement) => (
                      <div key={requirement.text} className={`flex items-center gap-2 text-xs ${requirement.met ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>
                        <CheckCircle className={`h-3.5 w-3.5 ${requirement.met ? "text-[var(--accent)]" : "opacity-40"}`} />
                        {requirement.text}
                      </div>
                    ))}
                  </div>
                ) : null}

                <FieldBlock label="Confirm password">
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm your password" required className="luxury-input w-full rounded-full py-3 pl-11 pr-4" />
                  </div>
                  {confirmPassword && password !== confirmPassword ? (
                    <p className="mt-2 text-xs text-red-200">Passwords do not match</p>
                  ) : null}
                </FieldBlock>

                <button
                  type="submit"
                  disabled={isLoading || !authAvailable}
                  className="inline-flex w-full items-center justify-center rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
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
                Already have an account?{" "}
                <Link href="/auth/signin" className="text-[var(--text-primary)] hover:text-[var(--accent)]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
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
