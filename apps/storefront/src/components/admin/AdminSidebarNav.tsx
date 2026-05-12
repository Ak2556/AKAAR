"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageSquare,
  Users,
  Sprout,
  ExternalLink,
  LogOut,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV_PRIMARY = [
  { href: "/admin",           label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/products",  label: "Products",   icon: Package },
  { href: "/admin/orders",    label: "Orders",     icon: ShoppingBag },
  { href: "/admin/quotes",    label: "Quotes",     icon: MessageSquare },
  { href: "/admin/customers", label: "Customers",  icon: Users },
];

const NAV_SECONDARY = [
  { href: "/admin/seed-products", label: "Seed Products", icon: Sprout },
  { href: "/",                    label: "View Store",    icon: ExternalLink },
];

interface AdminSidebarNavProps {
  user: { name: string | null; email: string };
}

export function AdminSidebarNav({ user }: AdminSidebarNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const initials = (user.name?.[0] ?? user.email[0]).toUpperCase();

  return (
    <>
      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col lg:flex">
        {/* Top spacer fills behind the global navbar (navbar ≈ 80px) */}
        <div className="h-20 shrink-0 border-b border-r border-[var(--border)] bg-[var(--bg-secondary)]">
          <div className="flex h-full items-end px-5 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--accent)]/20">
                <Shield className="h-3.5 w-3.5 text-[var(--accent)]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--accent)] font-mono leading-none">Admin</p>
                <p className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">AKAAR 3D</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable nav body */}
        <div className="flex flex-1 flex-col overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-secondary)]">
          <nav className="flex-1 space-y-0.5 px-3 py-4">
            {NAV_PRIMARY.map(({ href, label, icon: Icon, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-[0.75rem] px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </Link>
              );
            })}

            <div className="my-2 border-t border-[var(--border)]" />

            {NAV_SECONDARY.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-[0.75rem] px-3 py-2 text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User footer */}
          <div className="shrink-0 border-t border-[var(--border)] px-4 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-xs font-bold text-[var(--accent)]">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                  {user.name ?? "Admin"}
                </p>
                <p className="truncate text-[10px] text-[var(--text-muted)]">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-[0.6rem] px-3 py-2 text-xs text-red-300 transition-colors hover:bg-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile: horizontal pill strip ───────────────────────────────── */}
      <div className="fixed inset-x-0 top-20 z-30 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur-sm lg:hidden">
        <div className="flex gap-1 overflow-x-auto px-3 py-2 [scrollbar-width:none]">
          {NAV_PRIMARY.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all ${
                  active
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
