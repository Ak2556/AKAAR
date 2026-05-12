"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  FileText,
  Loader2,
  CheckCircle,
  Package,
  ExternalLink,
} from "lucide-react";

interface QuoteFile {
  id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  s3_key: string;
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
  notes: string | null;
  status: string;
  quoted_price: number | null;
  response_notes: string | null;
  responded_at: string | null;
  created_at: string;
  quote_files: QuoteFile[];
}

const STATUSES = ["PENDING", "REVIEWING", "QUOTED", "ACCEPTED", "REJECTED", "EXPIRED"];

const STATUS_CONFIG: Record<string, { label: string; tone: string }> = {
  PENDING:   { label: "Pending",   tone: "bg-amber-500/10   text-amber-200   border-amber-500/20"   },
  REVIEWING: { label: "Reviewing", tone: "bg-sky-500/10     text-sky-200     border-sky-500/20"     },
  QUOTED:    { label: "Quoted",    tone: "bg-violet-500/10  text-violet-200  border-violet-500/20"  },
  ACCEPTED:  { label: "Accepted",  tone: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20" },
  REJECTED:  { label: "Rejected",  tone: "bg-rose-500/10    text-rose-200    border-rose-500/20"    },
  EXPIRED:   { label: "Expired",   tone: "bg-zinc-500/10    text-zinc-400    border-zinc-500/20"    },
};

function fmtBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function AdminQuoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [responseNotes, setResponseNotes] = useState("");

  useEffect(() => {
    // Use the user-facing quotes API — admin can read via service role
    fetch(`/api/quotes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.quote) {
          setQuote(d.quote);
          setStatus(d.quote.status);
          setQuotedPrice(d.quote.quoted_price != null ? String(d.quote.quoted_price) : "");
          setResponseNotes(d.quote.response_notes ?? "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          quotedPrice: quotedPrice ? Number(quotedPrice) : null,
          responseNotes: responseNotes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update");
      setQuote((prev) => (prev ? { ...prev, ...data.quote } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-28">
        <p className="text-[var(--text-secondary)]">Quote not found.</p>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[quote.status] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <Link
        href="/admin/quotes"
        className="mb-8 inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
      >
        <ArrowLeft className="h-4 w-4" /> All Quotes
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="luxury-kicker">Quote Detail</p>
          <h1 className="display-font mt-2 text-3xl text-[var(--text-primary)]">
            {quote.name}
          </h1>
          <p className="mt-1 font-mono text-sm text-[var(--text-muted)]">
            {quote.quote_number} ·{" "}
            {new Date(quote.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-sm font-medium ${cfg.tone}`}
        >
          {cfg.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left — request details */}
        <div className="space-y-5">
          {/* Print specification */}
          <div className="luxury-card rounded-[1.6rem] overflow-hidden">
            <div className="border-b border-[var(--border)] px-6 py-4">
              <p className="luxury-kicker">Print Specification</p>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Service</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{quote.service}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Material</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{quote.material}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">Quantity</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-primary)]">{quote.quantity}</p>
              </div>
            </div>
            {quote.notes && (
              <div className="border-t border-[var(--border)] px-6 py-4">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--text-muted)] mb-2">Customer Notes</p>
                <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{quote.notes}</p>
              </div>
            )}
          </div>

          {/* Customer info */}
          <div className="luxury-card rounded-[1.6rem] p-6">
            <p className="luxury-kicker mb-4">Customer</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                <a
                  href={`mailto:${quote.email}`}
                  className="text-[var(--accent)] hover:underline"
                >
                  {quote.email}
                </a>
              </div>
              {quote.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{quote.phone}</span>
                </div>
              )}
              {quote.company && (
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
                  <span className="text-[var(--text-secondary)]">{quote.company}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attached files */}
          {quote.quote_files?.length > 0 && (
            <div className="luxury-card rounded-[1.6rem] overflow-hidden">
              <div className="border-b border-[var(--border)] px-6 py-4">
                <p className="luxury-kicker">
                  Attached Files ({quote.quote_files.length})
                </p>
              </div>
              <ul className="divide-y divide-[var(--border)]">
                {quote.quote_files.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center gap-3 px-6 py-3.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-[var(--bg-primary)]">
                      <FileText className="h-4 w-4 text-[var(--accent)]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-[var(--text-primary)]">
                        {f.original_filename}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {fmtBytes(f.file_size)} · {f.file_type}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right — respond panel */}
        <div className="space-y-5">
          <div className="luxury-card rounded-[1.6rem] p-6 space-y-5">
            <p className="luxury-kicker">Respond to Quote</p>

            {/* Status picker */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Status
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STATUSES.map((s) => {
                  const c = STATUS_CONFIG[s];
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-full border px-3 py-2 text-xs font-medium transition-all ${
                        status === s
                          ? c.tone
                          : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                      }`}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quoted price */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Quoted Price (₹)
              </label>
              <input
                type="number"
                value={quotedPrice}
                onChange={(e) => setQuotedPrice(e.target.value)}
                placeholder="e.g. 4500"
                min="0"
                step="0.01"
                className="luxury-input w-full rounded-full py-3 px-4 text-sm"
              />
              <p className="mt-1 text-xs text-[var(--text-muted)]">
                Leave blank if not yet priced. Customer sees this when status is "Quoted".
              </p>
            </div>

            {/* Response notes */}
            <div>
              <label className="mb-2 block text-xs uppercase tracking-wider text-[var(--text-muted)]">
                Response Message
              </label>
              <textarea
                value={responseNotes}
                onChange={(e) => setResponseNotes(e.target.value)}
                placeholder="Tell the customer what you need, your lead time, or why it was declined…"
                rows={4}
                className="luxury-input w-full rounded-[1rem] py-3 px-4 text-sm resize-none"
              />
            </div>

            {error && (
              <p className="rounded-[1rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex w-full items-center justify-center rounded-full bg-[var(--text-primary)] px-6 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
                  Saved
                </>
              ) : (
                "Save Response"
              )}
            </button>
          </div>

          {/* Quick actions */}
          <div className="luxury-card rounded-[1.6rem] p-5 space-y-2">
            <p className="luxury-kicker mb-3">Quick Actions</p>
            <a
              href={`mailto:${quote.email}?subject=Re: Quote Request ${quote.quote_number}&body=Hi ${quote.name},%0A%0ARegarding your quote request for ${quote.service}...`}
              className="flex items-center gap-3 rounded-[0.8rem] border border-[var(--border)] px-4 py-3 text-sm transition-colors hover:border-[var(--accent)]/40"
            >
              <Mail className="h-4 w-4 shrink-0 text-[var(--accent)]" />
              <span className="text-[var(--text-secondary)]">Email customer</span>
              <ExternalLink className="ml-auto h-3.5 w-3.5 shrink-0 text-[var(--text-muted)]" />
            </a>
            <Link
              href="/admin/quotes"
              className="flex items-center gap-3 rounded-[0.8rem] border border-[var(--border)] px-4 py-3 text-sm transition-colors hover:border-[var(--accent)]/40"
            >
              <Package className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
              <span className="text-[var(--text-secondary)]">Back to all quotes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
