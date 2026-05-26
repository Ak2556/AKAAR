"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Star, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  verifiedPurchase: boolean;
  createdAt: string;
  authorName: string;
}

interface ReviewsPayload {
  average: number;
  total: number;
  distribution: { star: number; count: number }[];
  viewerReviewId: string | null;
  reviews: Review[];
}

interface ProductReviewsProps {
  productSlug: string;
}

function StarRow({ value, onChange, size = 18 }: { value: number; onChange?: (n: number) => void; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={`transition-transform ${onChange ? "hover:scale-110" : "cursor-default"}`}
          aria-label={`${n} star${n === 1 ? "" : "s"}`}
        >
          <Star
            width={size}
            height={size}
            className={n <= value ? "fill-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"}
          />
        </button>
      ))}
    </div>
  );
}

export function ProductReviews({ productSlug }: ProductReviewsProps) {
  const toast = useToast();
  const [data, setData] = useState<ReviewsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, { cache: "no-store" });
      if (!res.ok) {
        setData(null);
        return;
      }
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (rating < 1) {
      toast.error("Pick a rating from 1 to 5 stars");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/products/${productSlug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, title, body }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Could not save review");
      toast.success("Thanks — your review is live");
      setRating(0);
      setTitle("");
      setBody("");
      setFormOpen(false);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="luxury-card mt-14 rounded-[2rem] p-6 sm:p-8">
        <p className="luxury-kicker">Customer reviews</p>
        <p className="mt-4 text-sm text-[var(--text-muted)]">Loading reviews…</p>
      </section>
    );
  }

  if (!data) {
    return null;
  }

  const max = Math.max(1, ...data.distribution.map((d) => d.count));

  return (
    <section className="luxury-card mt-14 rounded-[2rem] p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="luxury-kicker">Customer reviews</p>
          <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)] sm:text-4xl">
            {data.total === 0 ? "Be the first to review" : `${data.average.toFixed(1)} out of 5`}
          </h2>
          <div className="mt-3 flex items-center gap-3">
            <StarRow value={Math.round(data.average)} size={18} />
            <span className="text-sm text-[var(--text-muted)]">
              {data.total} {data.total === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>
        <Button
          variant={formOpen ? "outline" : "primary"}
          onClick={() => setFormOpen((open) => !open)}
        >
          {formOpen ? "Cancel" : data.viewerReviewId ? "Update your review" : "Write a review"}
        </Button>
      </div>

      {/* Distribution bars */}
      {data.total > 0 && (
        <div className="mt-6 space-y-1.5">
          {data.distribution
            .slice()
            .reverse()
            .map((d) => {
              const pct = data.total === 0 ? 0 : Math.round((d.count / max) * 100);
              return (
                <div key={d.star} className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                  <span className="w-14 shrink-0 font-mono">{d.star} star{d.star === 1 ? "" : "s"}</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-tertiary)]">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 shrink-0 text-right font-mono">{d.count}</span>
                </div>
              );
            })}
        </div>
      )}

      {/* Review form */}
      {formOpen && (
        <form onSubmit={submit} className="mt-8 space-y-4 rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
              Your rating
            </label>
            <div className="mt-2"><StarRow value={rating} onChange={setRating} size={24} /></div>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Title</label>
            <input
              type="text"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarise your experience"
              className="luxury-input mt-2 w-full rounded-lg px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">Your review</label>
            <textarea
              value={body}
              rows={4}
              maxLength={2000}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What did you like or dislike? How did the print quality compare to your expectations?"
              className="luxury-input mt-2 w-full rounded-lg px-4 py-2.5 text-sm resize-y"
            />
            <p className="mt-1 text-right text-[10px] text-[var(--text-muted)]">{body.length}/2000</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[11px] text-[var(--text-muted)]">
              You must be signed in. Reviews from past buyers are marked as verified purchases.
            </p>
            <Button type="submit" variant="primary" disabled={submitting || rating < 1}>
              {submitting ? "Submitting…" : data.viewerReviewId ? "Update review" : "Submit review"}
            </Button>
          </div>
        </form>
      )}

      {/* Review list */}
      <div className="mt-8 space-y-5">
        {data.reviews.length === 0 ? (
          <p className="text-sm text-[var(--text-muted)]">No reviews yet — your feedback would help other customers.</p>
        ) : (
          data.reviews.map((review) => (
            <article key={review.id} className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                    <UserIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">{review.authorName}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                {review.verifiedPurchase ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Verified purchase
                  </span>
                ) : null}
              </div>
              <div className="mt-3"><StarRow value={review.rating} size={14} /></div>
              {review.title ? (
                <p className="mt-3 text-base font-semibold text-[var(--text-primary)]">{review.title}</p>
              ) : null}
              {review.body ? (
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[var(--text-secondary)]">{review.body}</p>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
