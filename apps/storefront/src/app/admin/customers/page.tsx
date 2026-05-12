"use client";

import { useEffect, useState } from "react";
import {
  Users,
  Search,
  ShoppingBag,
  Shield,
  ChevronUp,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  created_at: string;
  orderCount: number;
  totalSpent: number;
}

type SortKey = "joined" | "orders" | "spent";

const ROLE_CONFIG = {
  ADMIN:    { label: "Admin",    tone: "bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/20" },
  CUSTOMER: { label: "Customer", tone: "bg-[var(--bg-primary)] text-[var(--text-muted)] border-[var(--border)]" },
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "ADMIN" | "CUSTOMER">("all");
  const [sortKey, setSortKey] = useState<SortKey>("joined");
  const [sortAsc, setSortAsc] = useState(false);
  const [promoting, setPromoting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (customer: Customer) => {
    const newRole = customer.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    if (
      !confirm(
        `${newRole === "ADMIN" ? "Promote" : "Demote"} ${customer.name ?? customer.email} to ${newRole}?`
      )
    )
      return;

    setPromoting(customer.id);
    try {
      const res = await fetch("/api/admin/customers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: customer.id, role: newRole }),
      });
      if (res.ok) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, role: newRole } : c))
        );
      }
    } catch {
      // silent
    } finally {
      setPromoting(null);
    }
  };

  const setSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((a) => !a);
    else { setSortKey(key); setSortAsc(false); }
  };

  const filtered = customers
    .filter((c) => {
      const term = search.toLowerCase();
      return (
        (roleFilter === "all" || c.role === roleFilter) &&
        (c.name?.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term))
      );
    })
    .sort((a, b) => {
      let diff = 0;
      if (sortKey === "joined")
        diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === "orders") diff = a.orderCount - b.orderCount;
      else if (sortKey === "spent")  diff = a.totalSpent - b.totalSpent;
      return sortAsc ? diff : -diff;
    });

  const SortButton = ({
    label,
    k,
  }: {
    label: string;
    k: SortKey;
  }) => (
    <button
      onClick={() => setSort(k)}
      className="flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
    >
      {label}
      {sortKey === k ? (
        sortAsc ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : (
        <ChevronDown className="h-3 w-3 opacity-30" />
      )}
    </button>
  );

  const totalRevenue = customers.reduce((s, c) => s + c.totalSpent, 0);

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="luxury-kicker">Admin · Customers</p>
        <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Customers</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          {customers.length} registered accounts · ₹
          {totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })} total spent
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "CUSTOMER", "ADMIN"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                roleFilter === r
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
              }`}
            >
              {r === "all" ? "All" : r === "ADMIN" ? "Admins" : "Customers"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="luxury-card rounded-[1.8rem] p-12 text-center">
          <Users className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]" />
          <p className="text-[var(--text-secondary)]">No customers found.</p>
        </div>
      ) : (
        <div className="luxury-card rounded-[1.8rem] overflow-hidden">
          {/* Table header */}
          <div className="hidden sm:grid grid-cols-[1fr_120px_110px_100px_80px] gap-4 border-b border-[var(--border)] px-6 py-3">
            <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Customer</span>
            <SortButton label="Joined" k="joined" />
            <SortButton label="Orders" k="orders" />
            <SortButton label="Spent"  k="spent"  />
            <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Role</span>
          </div>

          {/* Rows */}
          <ul className="divide-y divide-[var(--border)]">
            {filtered.map((c) => {
              const roleCfg = ROLE_CONFIG[c.role];
              const initials = (c.name?.[0] ?? c.email[0]).toUpperCase();
              return (
                <li
                  key={c.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:grid sm:grid-cols-[1fr_120px_110px_100px_80px] sm:items-center sm:gap-4"
                >
                  {/* Name + email */}
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--bg-primary)] text-xs font-bold text-[var(--text-muted)]">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                        {c.name ?? <span className="text-[var(--text-muted)] italic">No name</span>}
                      </p>
                      <p className="truncate text-xs text-[var(--text-muted)]">{c.email}</p>
                    </div>
                  </div>

                  {/* Joined */}
                  <p className="text-xs text-[var(--text-muted)] sm:text-center">
                    {new Date(c.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>

                  {/* Orders */}
                  <div className="flex items-center gap-1.5 sm:justify-center">
                    <ShoppingBag className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{c.orderCount}</span>
                  </div>

                  {/* Spent */}
                  <p className="text-sm font-medium text-[var(--text-primary)] sm:text-center">
                    {c.totalSpent > 0
                      ? "₹" + c.totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 0 })
                      : "—"}
                  </p>

                  {/* Role + toggle */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${roleCfg.tone}`}
                    >
                      {c.role === "ADMIN" && <Shield className="h-2.5 w-2.5" />}
                      {roleCfg.label}
                    </span>
                    <button
                      onClick={() => handleRoleToggle(c)}
                      disabled={promoting === c.id}
                      title={c.role === "ADMIN" ? "Demote to Customer" : "Promote to Admin"}
                      className="rounded-full p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)] disabled:opacity-40"
                    >
                      {promoting === c.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Shield className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
