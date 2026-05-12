"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, Search, Filter, ChevronRight, FileText } from "lucide-react";

interface QuoteFile {
  id: string;
  original_filename: string;
  file_size: number;
}

interface Quote {
  id: string;
  quote_number: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  service: string;
  material: string;
  quantity: number;
  status: string;
  quoted_price: number | null;
  created_at: string;
  quote_files: QuoteFile[];
}

const STATUS_CONFIG: Record<string, { label: string; tone: string }> = {
  PENDING:   { label: "Pending",   tone: "bg-amber-500/10   text-amber-200   border-amber-500/20"   },
  REVIEWING: { label: "Reviewing", tone: "bg-sky-500/10     text-sky-200     border-sky-500/20"     },
  QUOTED:    { label: "Quoted",    tone: "bg-violet-500/10  text-violet-200  border-violet-500/20"  },
  ACCEPTED:  { label: "Accepted",  tone: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20" },
  REJECTED:  { label: "Rejected",  tone: "bg-rose-500/10    text-rose-200    border-rose-500/20"    },
  EXPIRED:   { label: "Expired",   tone: "bg-zinc-500/10    text-zinc-400    border-zinc-500/20"    },
};

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/quotes")
      .then((r) => r.json())
      .then((d) => setQuotes(d.quotes ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = quotes.filter((q) => {
    const term = search.toLowerCase();
    const matchSearch =
      q.name.toLowerCase().includes(term) ||
      q.email.toLowerCase().includes(term) ||
      q.quote_number.toLowerCase().includes(term) ||
      q.service.toLowerCase().includes(term);
    const matchStatus = statusFilter === "all" || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusCounts = quotes.reduce<Record<string, number>>((acc, q) => {
    acc[q.status] = (acc[q.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <p className="luxury-kicker">Admin · Quotes</p>
        <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)]">Quote Requests</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          Review custom 3D print requests, set prices, and respond to customers.
        </p>
      </div>

      {/* Status filter pills */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
            statusFilter === "all"
              ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent"
              : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
          }`}
        >
          All ({quotes.length})
        </button>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
              statusFilter === key
                ? cfg.tone
                : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
            }`}
          >
            {cfg.label} {statusCounts[key] ? `(${statusCounts[key]})` : ""}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6 relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search name, email, service…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="luxury-card rounded-[1.8rem] p-12 text-center">
          <MessageSquare className="mx-auto mb-4 h-10 w-10 text-[var(--text-muted)]" />
          <p className="text-[var(--text-secondary)]">No quote requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => {
            const cfg = STATUS_CONFIG[q.status] ?? STATUS_CONFIG.PENDING;
            return (
              <Link
                key={q.id}
                href={`/admin/quotes/${q.id}`}
                className="luxury-card flex flex-col gap-3 rounded-[1.4rem] p-5 hover:border-[var(--accent)]/40 transition-colors sm:flex-row sm:items-center"
              >
                {/* Icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.9rem] bg-[var(--bg-primary)]">
                  <MessageSquare className="h-5 w-5 text-[var(--accent)]" />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-[var(--text-primary)]">{q.name}</p>
                    <span className="font-mono text-xs text-[var(--text-muted)]">{q.quote_number}</span>
                    {q.quote_files?.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                        <FileText className="h-2.5 w-2.5" />
                        {q.quote_files.length} file{q.quote_files.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {q.service} · {q.material} · qty {q.quantity}
                    {q.company ? ` · ${q.company}` : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                    {q.email}
                    {q.phone ? ` · ${q.phone}` : ""} ·{" "}
                    {new Date(q.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 shrink-0">
                  {q.quoted_price != null && (
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      ₹{Number(q.quoted_price).toLocaleString("en-IN")}
                    </span>
                  )}
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${cfg.tone}`}>
                    {cfg.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
