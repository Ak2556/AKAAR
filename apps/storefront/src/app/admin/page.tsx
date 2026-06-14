import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  TrendingUp,
  ShoppingBag,
  Package,
  MessageSquare,
  Users,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const ORDER_STATUS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "Pending",    color: "text-amber-300"  },
  CONFIRMED:  { label: "Confirmed",  color: "text-sky-300"    },
  PROCESSING: { label: "Processing", color: "text-violet-300" },
  SHIPPED:    { label: "Shipped",    color: "text-cyan-300"   },
  DELIVERED:  { label: "Delivered",  color: "text-emerald-300"},
  CANCELLED:  { label: "Cancelled",  color: "text-rose-300"   },
};

const QUOTE_STATUS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: "Pending",   color: "text-amber-300"  },
  REVIEWING: { label: "Reviewing", color: "text-sky-300"    },
  QUOTED:    { label: "Quoted",    color: "text-violet-300" },
  ACCEPTED:  { label: "Accepted",  color: "text-emerald-300"},
  REJECTED:  { label: "Rejected",  color: "text-rose-300"   },
  EXPIRED:   { label: "Expired",   color: "text-[var(--text-muted)]" },
};

function fmt(n: number) {
  return "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/signin?callbackUrl=%2Fadmin");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "ADMIN") redirect("/");

  const db = createAdminClient();

  // Parallel data fetches
  const [
    { data: orders },
    { data: products },
    { data: quotes },
    { data: customers },
    { data: recentOrders },
    { data: recentQuotes },
  ] = await Promise.all([
    db.from("orders").select("id, status, total, payment_status, created_at"),
    db.from("products").select("id, is_active"),
    db.from("quote_requests").select("id, status, created_at"),
    db.from("profiles").select("id, role"),
    db.from("orders")
      .select("id, order_number, email, status, total, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    db.from("quote_requests")
      .select("id, quote_number, name, email, service, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  // Compute stats
  const totalRevenue = (orders ?? [])
    .filter((o) => o.payment_status === "CAPTURED")
    .reduce((s, o) => s + Number(o.total), 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthRevenue = (orders ?? [])
    .filter((o) => o.payment_status === "CAPTURED" && o.created_at >= monthStart)
    .reduce((s, o) => s + Number(o.total), 0);

  const orderCounts = (orders ?? []).reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const pendingOrders    = orderCounts.PENDING    ?? 0;
  const processingOrders = (orderCounts.CONFIRMED ?? 0) + (orderCounts.PROCESSING ?? 0);
  const shippedOrders    = orderCounts.SHIPPED    ?? 0;

  const activeProducts  = (products ?? []).filter((p) => p.is_active).length;
  const draftProducts   = (products ?? []).filter((p) => !p.is_active).length;
  const pendingQuotes   = (quotes ?? []).filter((q) => q.status === "PENDING").length;
  const totalCustomers  = (customers ?? []).filter((c) => c.role === "CUSTOMER").length;

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <p className="luxury-kicker">Merchant Console</p>
        <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Dashboard</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
        {/* Revenue */}
        <div className="luxury-card p-6">
          <div className="flex items-start justify-between">
            <div className="luxury-tile h-10 w-10">
              <TrendingUp className="h-5 w-5" />
            </div>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
              {fmt(monthRevenue)} this month
            </span>
          </div>
          <p className="mt-5 text-3xl font-bold text-[var(--text-primary)]">{fmt(totalRevenue)}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Total GMV (captured)</p>
        </div>

        {/* Orders */}
        <div className="luxury-card p-6">
          <div className="flex items-start justify-between">
            <div className="luxury-tile h-10 w-10">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {pendingOrders > 0 && (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                {pendingOrders} pending
              </span>
            )}
          </div>
          <p className="mt-5 text-3xl font-bold text-[var(--text-primary)]">{(orders ?? []).length}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Total orders</p>
          <div className="mt-3 flex gap-3 text-xs text-[var(--text-muted)]">
            <span className="text-violet-300">{processingOrders} processing</span>
            <span className="text-cyan-300">{shippedOrders} shipped</span>
          </div>
        </div>

        {/* Products */}
        <div className="luxury-card p-6">
          <div className="flex items-start justify-between">
            <div className="luxury-tile h-10 w-10">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-5 text-3xl font-bold text-[var(--text-primary)]">{activeProducts}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Active products</p>
          {draftProducts > 0 && (
            <p className="mt-2 text-xs text-[var(--text-muted)]">{draftProducts} draft</p>
          )}
        </div>

        {/* Quotes + Customers */}
        <div className="luxury-card p-6">
          <div className="flex items-start justify-between">
            <div className="luxury-tile h-10 w-10">
              <MessageSquare className="h-5 w-5" />
            </div>
            {pendingQuotes > 0 && (
              <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[11px] font-medium text-amber-300">
                {pendingQuotes} new
              </span>
            )}
          </div>
          <p className="mt-5 text-3xl font-bold text-[var(--text-primary)]">{(quotes ?? []).length}</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Quote requests</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            <span className="text-[var(--text-secondary)]">{totalCustomers}</span> registered customers
          </p>
        </div>
      </div>

      {/* ── Order status breakdown ──────────────────────────────────────── */}
      <div className="mb-8 luxury-card p-5">
        <p className="mb-4 text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">Orders by Status</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {Object.entries(ORDER_STATUS).map(([key, cfg]) => (
            <Link
              key={key}
              href={`/admin/orders?status=${key}`}
              className="group rounded-[var(--rad-sm)] border border-[var(--border)] bg-[var(--bg-primary)] p-3 text-center transition-colors hover:border-[var(--accent)]/40"
            >
              <p className="text-2xl font-bold text-[var(--text-primary)]">
                {orderCounts[key] ?? 0}
              </p>
              <p className={`mt-0.5 text-[10px] font-medium ${cfg.color}`}>{cfg.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Recent activity ────────────────────────────────────────────── */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Recent Orders */}
        <div className="luxury-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Recent Orders</p>
            <Link
              href="/admin/orders"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              View all →
            </Link>
          </div>
          {(recentOrders ?? []).length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[var(--text-muted)]">No orders yet</div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {(recentOrders ?? []).map((o) => {
                const cfg = ORDER_STATUS[o.status] ?? ORDER_STATUS.PENDING;
                return (
                  <li key={o.id}>
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-[var(--bg-primary)]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-mono text-xs font-medium text-[var(--text-primary)]">
                          {o.order_number}
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                          {o.email} · {fmtDate(o.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {fmt(Number(o.total))}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent Quotes */}
        <div className="luxury-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Recent Quote Requests</p>
            <Link
              href="/admin/quotes"
              className="text-xs text-[var(--accent)] hover:underline"
            >
              View all →
            </Link>
          </div>
          {(recentQuotes ?? []).length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-[var(--text-muted)]">No quote requests yet</div>
          ) : (
            <ul className="divide-y divide-[var(--border)]">
              {(recentQuotes ?? []).map((q) => {
                const cfg = QUOTE_STATUS[q.status] ?? QUOTE_STATUS.PENDING;
                return (
                  <li key={q.id}>
                    <Link
                      href={`/admin/quotes/${q.id}`}
                      className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-[var(--bg-primary)]"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-[var(--text-primary)]">
                          {q.name}
                          <span className="ml-1.5 font-mono text-[var(--text-muted)]">
                            {q.quote_number}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">
                          {q.service} · {fmtDate(q.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* ── Quick links ────────────────────────────────────────────────── */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Link
          href="/admin/products"
          className="luxury-card-interactive flex items-center gap-4 rounded-[var(--rad-lg)] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4"
        >
          <div className="luxury-tile h-10 w-10 shrink-0">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Manage Products</p>
            <p className="text-xs text-[var(--text-muted)]">Create, edit, reorder</p>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </Link>

        <Link
          href="/admin/quotes"
          className="luxury-card-interactive flex items-center gap-4 rounded-[var(--rad-lg)] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4"
        >
          <div className="luxury-tile h-10 w-10 shrink-0">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Review Quotes</p>
            <p className="text-xs text-[var(--text-muted)]">
              {pendingQuotes > 0 ? `${pendingQuotes} awaiting response` : "Respond to requests"}
            </p>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </Link>

        <Link
          href="/admin/customers"
          className="luxury-card-interactive flex items-center gap-4 rounded-[var(--rad-lg)] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4"
        >
          <div className="luxury-tile h-10 w-10 shrink-0">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Customers</p>
            <p className="text-xs text-[var(--text-muted)]">{totalCustomers} registered accounts</p>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        </Link>
      </div>
    </div>
  );
}
