"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  Package,
  Search,
  Truck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel } from "@/components/ui/storefront-primitives";
import { useSettings } from "@/context/SettingsContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "next/navigation";

interface OrderItem {
  id: string;
  productId?: string | null;
  slug?: string | null;
  name: string;
  material: string | null;
  quantity: number;
  unitPrice?: number | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
  trackingNumber?: string | null;
  trackingUrl?: string | null;
}

const statusConfig: Record<string, { icon: LucideIcon; tone: string; label: string }> = {
  PENDING: { icon: Clock, tone: "bg-amber-500/10 text-amber-200", label: "Pending" },
  CONFIRMED: { icon: CheckCircle, tone: "bg-sky-500/10 text-sky-200", label: "Confirmed" },
  PROCESSING: { icon: Package, tone: "bg-violet-500/10 text-violet-200", label: "Processing" },
  SHIPPED: { icon: Truck, tone: "bg-cyan-500/10 text-cyan-200", label: "Shipped" },
  DELIVERED: { icon: CheckCircle, tone: "bg-emerald-500/10 text-emerald-200", label: "Delivered" },
  CANCELLED: { icon: XCircle, tone: "bg-rose-500/10 text-rose-200", label: "Cancelled" },
};

export default function OrdersPage() {
  const { formatPrice } = useSettings();
  const { addItem } = useCart();
  const toast = useToast();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleReorder = (order: Order) => {
    let added = 0;
    for (const item of order.items) {
      if (!item.productId || !item.slug || item.unitPrice == null) continue;
      addItem(
        {
          id: item.productId,
          name: item.name,
          slug: item.slug,
          price: Number(item.unitPrice) || 0,
        },
        item.quantity
      );
      added += 1;
    }
    if (added === 0) {
      toast.error("These items can't be reordered right now");
      return;
    }
    toast.success(`Added ${added} item${added === 1 ? "" : "s"} to your cart`);
    router.push("/cart");
  };

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);

      try {
        const response = await fetch("/api/user/orders", { cache: "no-store" });
        if (!response.ok) {
          setOrders([]);
          return;
        }

        const data = await response.json();
        setOrders(
          (data.orders || []).map((order: Order & { total: number | string }) => ({
            ...order,
            total: Number(order.total) || 0,
          }))
        );
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchQuery, statusFilter]
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
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <span className="luxury-kicker">Orders</span>
        <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
          Production orders and delivery state.
        </h1>
        <p className="mt-3 text-[var(--text-secondary)]">
          Track every order from confirmation through dispatch.
        </p>
      </motion.div>

      <div className="luxury-card rounded-[1.8rem] p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search by order number"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
            />
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
            <Filter className="h-4 w-4 text-[var(--text-muted)]" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="bg-transparent text-sm text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All statuses</option>
              {Object.entries(statusConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyStatePanel
          icon={AlertCircle}
          title="No orders found"
          description={orders.length === 0 ? "You haven’t placed any orders yet." : "No orders match the current filters."}
          action={orders.length === 0 ? <Link href="/"><Button>Browse Products</Button></Link> : undefined}
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.article
              key={order.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="luxury-card overflow-hidden rounded-[1.9rem]"
            >
              <div className="flex flex-col gap-4 border-b border-[var(--border)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[var(--bg-primary)]">
                    <Package className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-[var(--text-primary)]">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <span className="text-sm font-medium text-[var(--text-primary)]">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="grid gap-px bg-[var(--border)] sm:grid-cols-[1.25fr_0.75fr]">
                <div className="bg-[var(--bg-secondary)] px-5 py-5">
                  <p className="luxury-metric-label">Items</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="rounded-full border border-[var(--border)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs text-[var(--text-secondary)]">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-[var(--bg-secondary)] px-5 py-5">
                  <p className="luxury-metric-label">State</p>
                  <p className="mt-4 text-sm text-[var(--text-primary)]">{statusConfig[order.status]?.label || order.status}</p>
                  {order.trackingNumber && (
                    <div className="mt-4 rounded-[1rem] border border-cyan-500/20 bg-cyan-500/5 px-4 py-3">
                      <p className="text-xs uppercase tracking-wider text-cyan-400 mb-1">Tracking</p>
                      <p className="font-mono text-sm text-[var(--text-primary)]">{order.trackingNumber}</p>
                      {order.trackingUrl && (
                        <a
                          href={order.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline"
                        >
                          Track package →
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReorder(order)}
                  disabled={order.status === "CANCELLED" || order.items.every((it) => !it.productId || !it.slug)}
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reorder
                </Button>
                <Link href={`/account/orders/${order.id}`}>
                  <Button variant="primary" size="sm">
                    View details
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
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
