"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Plus,
  Search,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel, SummaryRow } from "@/components/ui/storefront-primitives";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Quote {
  id: string;
  quoteNumber: string;
  createdAt: string;
  status: string;
  service: string;
  material: string;
  quantity: number;
  quotedPrice?: number | string | null;
  notes?: string | null;
}

const statusConfig: Record<string, { icon: LucideIcon; tone: string; label: string }> = {
  PENDING: { icon: Clock, tone: "bg-amber-500/10 text-amber-200", label: "Pending Review" },
  REVIEWING: { icon: FileText, tone: "bg-sky-500/10 text-sky-200", label: "Under Review" },
  QUOTED: { icon: CheckCircle, tone: "bg-emerald-500/10 text-emerald-200", label: "Quote Ready" },
  ACCEPTED: { icon: CheckCircle, tone: "bg-cyan-500/10 text-cyan-200", label: "Accepted" },
  REJECTED: { icon: XCircle, tone: "bg-rose-500/10 text-rose-200", label: "Declined" },
  EXPIRED: { icon: AlertCircle, tone: "bg-zinc-500/10 text-zinc-300", label: "Expired" },
};

export default function QuotesPage() {
  const { formatPrice } = useSettings();
  const toast = useToast();
  const router = useRouter();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const payQuote = async (quote: Quote) => {
    if (typeof window === "undefined" || !window.Razorpay) {
      toast.error("Payment SDK is still loading — try again in a moment");
      return;
    }
    setPayingId(quote.id);
    try {
      const res = await fetch(`/api/quotes/${quote.id}/pay`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not start payment");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: "AKAAR 3D",
        description: `Quote ${quote.quoteNumber}`,
        prefill: {
          name: data.customer?.name ?? "",
          email: data.customer?.email ?? "",
          contact: data.customer?.phone ?? "",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const confirm = await fetch(`/api/quotes/${quote.id}/confirm`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const confirmData = await confirm.json();
            if (!confirm.ok) throw new Error(confirmData.error || "Could not confirm payment");
            toast.success(`Order ${confirmData.orderNumber} confirmed`);
            router.push(`/account/orders/${confirmData.orderId}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not confirm payment");
          } finally {
            setPayingId(null);
          }
        },
        modal: {
          ondismiss: () => setPayingId(null),
        },
        theme: { color: "#d6b272" },
      });
      rzp.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start payment");
      setPayingId(null);
    }
  };

  useEffect(() => {
    async function fetchQuotes() {
      setLoading(true);

      try {
        const response = await fetch("/api/user/quotes", { cache: "no-store" });
        if (!response.ok) {
          setQuotes([]);
          return;
        }

        const data = await response.json();
        setQuotes(data.quotes || []);
      } catch {
        setQuotes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  const filteredQuotes = useMemo(
    () =>
      quotes.filter((quote) =>
        quote.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.service.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [quotes, searchQuery]
  );

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
      />
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="luxury-kicker">Quotes</span>
          <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
            Build requests under review.
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Track quote status, quoted prices, and the service configuration for each request.
          </p>
        </div>
        <Link href="/quote">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Quote Request
          </Button>
        </Link>
      </motion.div>

      <div className="luxury-card rounded-[1.8rem] p-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by quote number or service"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
          />
        </div>
      </div>

      {filteredQuotes.length === 0 ? (
        <EmptyStatePanel
          icon={FileText}
          title="No quotes found"
          description={quotes.length === 0 ? "You haven’t requested any quotes yet." : "No quote requests match your search."}
          action={quotes.length === 0 ? <Link href="/quote"><Button><Plus className="mr-2 h-4 w-4" />Request a Quote</Button></Link> : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredQuotes.map((quote, index) => (
            <motion.article
              key={quote.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="luxury-card overflow-hidden rounded-[1.9rem]"
            >
              <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--bg-primary)]">
                    <FileText className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-[var(--text-primary)]">{quote.quoteNumber}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {new Date(quote.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={quote.status} />
                  {quote.quotedPrice ? (
                    <span className="text-sm font-medium text-[var(--text-primary)]">
                      {formatPrice(Number(quote.quotedPrice))}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
                <SummaryCell label="Service" value={quote.service} />
                <SummaryCell label="Material" value={quote.material} />
                <SummaryCell label="Quantity" value={`${quote.quantity} units`} />
              </div>

              {quote.notes ? (
                <div className="bg-[var(--bg-secondary)] px-5 py-5 text-sm leading-7 text-[var(--text-secondary)]">
                  {quote.notes}
                </div>
              ) : null}

              {quote.status === "QUOTED" && quote.quotedPrice ? (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4">
                  <div className="text-sm text-[var(--text-secondary)]">
                    <p>
                      Quote ready ·{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {formatPrice(Number(quote.quotedPrice))}
                      </span>
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Includes the agreed build only — shipping is free for quoted orders.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => payQuote(quote)}
                    disabled={!razorpayLoaded || payingId === quote.id}
                  >
                    <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                    {payingId === quote.id ? "Opening payment…" : "Pay this quote"}
                  </Button>
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${config.tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return <SummaryRow label={label} value={value} />;
}
