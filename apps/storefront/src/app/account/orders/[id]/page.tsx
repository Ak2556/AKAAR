"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
  Package,
  RotateCcw,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

interface OrderItem {
  id: string;
  productId: string | null;
  name: string;
  slug: string | null;
  material: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ShippingAddress {
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingMethod: string;
  shippingAddress: ShippingAddress | null;
  email: string;
  phone: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

interface TimelineStep {
  key: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const TIMELINE: TimelineStep[] = [
  { key: "PENDING",    label: "Order placed",        icon: Clock,        description: "We have received your order" },
  { key: "CONFIRMED",  label: "Payment confirmed",   icon: CheckCircle,  description: "Payment captured by Razorpay" },
  { key: "PROCESSING", label: "Printing in studio",  icon: Package,      description: "Your part is being printed and finished" },
  { key: "SHIPPED",    label: "Shipped",             icon: Truck,        description: "Handed off to the courier partner" },
  { key: "DELIVERED",  label: "Delivered",           icon: CheckCircle2, description: "Marked as delivered" },
];

function statusRank(status: string): number {
  const idx = TIMELINE.findIndex((step) => step.key === status);
  return idx === -1 ? 0 : idx;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { formatPrice } = useSettings();
  const { addItem } = useCart();
  const toast = useToast();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/user/orders/${params.id}`, { cache: "no-store" });
        if (!res.ok) {
          if (res.status === 401) {
            router.push("/auth/signin");
            return;
          }
          throw new Error("Could not load this order");
        }
        const data = await res.json();
        if (!cancelled) setOrder(data.order);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load order");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [params.id, router]);

  const handleReorder = () => {
    if (!order) return;
    let added = 0;
    for (const item of order.items) {
      if (!item.productId || !item.slug) continue;
      addItem(
        {
          id: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.unitPrice,
        },
        item.quantity
      );
      added += 1;
    }
    if (added === 0) {
      toast.error("None of the items in this order can be reordered right now");
      return;
    }
    toast.success(`Added ${added} item${added === 1 ? "" : "s"} to your cart`);
    router.push("/cart");
  };

  const cancelled = order?.status === "CANCELLED";
  const currentRank = order ? statusRank(order.status) : 0;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
        <div className="luxury-card rounded-[1.8rem] p-8 text-center">
          <XCircle className="mx-auto h-10 w-10 text-rose-400" />
          <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
            {error ?? "Order not found"}
          </h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            The order may have been removed, or you may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="luxury-kicker">Order</span>
          <h1 className="display-font mt-3 text-4xl text-[var(--text-primary)] sm:text-5xl">
            {order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <Button variant="outline" size="lg" onClick={handleReorder}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reorder
        </Button>
      </div>

      {/* Timeline */}
      <section className="luxury-card rounded-[1.8rem] p-6 sm:p-8">
        <p className="luxury-metric-label">Production timeline</p>
        {cancelled ? (
          <div className="mt-6 rounded-[1.2rem] border border-rose-500/30 bg-rose-500/10 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-rose-200">
              <XCircle className="h-4 w-4" />
              This order was cancelled.
            </p>
          </div>
        ) : (
          <ol className="mt-6 space-y-5">
            {TIMELINE.map((step, idx) => {
              const reached = idx <= currentRank;
              const active = idx === currentRank;
              const Icon = step.icon;
              return (
                <li key={step.key} className="flex items-start gap-4">
                  <div
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors ${
                      reached
                        ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                        : "border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        reached ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                      }`}
                    >
                      {step.label}
                      {active ? (
                        <span className="ml-2 inline-flex items-center rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">
                          Current
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        )}

        {order.trackingNumber ? (
          <div className="mt-6 rounded-[1.2rem] border border-cyan-500/20 bg-cyan-500/8 px-5 py-4">
            <p className="text-[10px] uppercase tracking-wider text-cyan-400">Courier tracking</p>
            <p className="mt-1 font-mono text-sm text-[var(--text-primary)]">
              {order.trackingNumber}
            </p>
            {order.trackingUrl ? (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:underline"
              >
                Track on courier site
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}
          </div>
        ) : null}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Items */}
        <section className="luxury-card rounded-[1.8rem] p-6 sm:p-8">
          <p className="luxury-metric-label">Items in this order</p>
          <ul className="mt-6 divide-y divide-[var(--border)]">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="min-w-0 flex-1">
                  {item.slug ? (
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--accent)]"
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-[var(--text-primary)]">{item.name}</span>
                  )}
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {item.material ? `${item.material} · ` : ""}
                    {item.quantity} × {formatPrice(item.unitPrice)}
                  </p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-[var(--text-primary)]">
                  {formatPrice(item.totalPrice)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-6 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal)} />
            <Row label={`Shipping · ${order.shippingMethod}`} value={formatPrice(order.shippingCost)} />
            {order.tax > 0 ? <Row label="Tax" value={formatPrice(order.tax)} /> : null}
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-3 text-base font-semibold text-[var(--text-primary)]">
              <span>Total paid</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </section>

        {/* Delivery info */}
        <section className="luxury-card rounded-[1.8rem] p-6 sm:p-8">
          <p className="luxury-metric-label">Shipping to</p>
          {order.shippingAddress ? (
            <div className="mt-4 space-y-1 text-sm text-[var(--text-primary)]">
              <p className="font-medium">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </p>
              <p className="text-[var(--text-secondary)]">{order.shippingAddress.address}</p>
              <p className="text-[var(--text-secondary)]">
                {[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              {order.shippingAddress.country ? (
                <p className="text-[var(--text-secondary)]">{order.shippingAddress.country}</p>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm text-[var(--text-muted)]">No address on file.</p>
          )}

          <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-6 text-sm">
            <Row label="Email" value={order.email} />
            {order.phone ? <Row label="Phone" value={order.phone} /> : null}
            <Row label="Payment" value={order.paymentStatus} />
          </div>

          <div className="mt-6 space-y-3 text-xs text-[var(--text-muted)]">
            <p>
              Need help with this order? Email{" "}
              <a href="mailto:hello@akaar3d.in" className="text-[var(--accent)] hover:underline">
                hello@akaar3d.in
              </a>{" "}
              with this order number.
            </p>
            <p>
              See our{" "}
              <Link href="/shipping-policy" className="text-[var(--accent)] hover:underline">
                shipping policy
              </Link>{" "}
              and{" "}
              <Link href="/refund-policy" className="text-[var(--accent)] hover:underline">
                refund policy
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="text-right font-medium text-[var(--text-primary)]">{value}</span>
    </div>
  );
}
