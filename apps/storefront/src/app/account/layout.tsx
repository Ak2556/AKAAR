"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Settings,
  FileText,
  LogOut,
} from "lucide-react";
import { useEffect } from "react";

import { useAuthState } from "@/components/providers/AuthProvider";
import { useRuntimeCapabilities } from "@/context/RuntimeCapabilitiesContext";

const accountLinks = [
  { href: "/account", label: "Profile", icon: User },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/quotes", label: "Quotes", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, status } = useAuthState();
  const { authAvailable } = useRuntimeCapabilities();

  useEffect(() => {
    if (authAvailable && status !== "loading" && !session) {
      router.replace(`/auth/signin?callbackUrl=${encodeURIComponent(pathname || "/account")}`);
    }
  }, [authAvailable, pathname, router, session, status]);

  if (!authAvailable) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 sm:px-6">
        <div className="luxury-card max-w-2xl rounded-[2rem] px-8 py-12 text-center">
          <h1 className="display-font text-3xl text-[var(--text-primary)]">Account unavailable</h1>
          <p className="mt-4 text-[var(--text-secondary)]">
            Authentication is not configured in this environment yet.
          </p>
        </div>
      </div>
    );
  }

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-28 pb-16 sm:px-6">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[320px_1fr]">
          <motion.aside initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <section className="luxury-card rounded-[2rem] p-6">
              <span className="luxury-kicker">Account</span>
              <div className="mt-5 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--text-primary)] text-xl font-semibold text-[var(--bg-primary)]">
                  {session.user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-medium text-[var(--text-primary)]">
                    {session.user?.name || "User"}
                  </p>
                  <p className="mt-1 truncate text-sm text-[var(--text-muted)]">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </section>

            <nav className="luxury-card rounded-[2rem] p-3">
              <div className="grid gap-2">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/account" && pathname.startsWith(link.href));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  );
                })}

                <div className="my-1 border-t border-[var(--border)]" />

                <button
                  onClick={async () => { const { createClient } = await import("@/lib/supabase/client"); const s = createClient(); await s.auth.signOut(); window.location.href = "/"; }}
                  className="flex items-center gap-3 rounded-[1.2rem] px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.aside>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
