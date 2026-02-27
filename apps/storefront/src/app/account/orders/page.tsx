"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";

interface OrderItem {
  id: string;
  name: string;
  material: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: OrderItem[];
  shippingMethod: string;
  paymentStatus: string;
}

const statusConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  PENDING: { icon: Clock, color: "text-yellow-400 bg-yellow-400/10", label: "Pending" },
  CONFIRMED: { icon: CheckCircle, color: "text-blue-400 bg-blue-400/10", label: "Confirmed" },
  PROCESSING: { icon: Package, color: "text-purple-400 bg-purple-400/10", label: "Processing" },
  SHIPPED: { icon: Truck, color: "text-cyan-400 bg-cyan-400/10", label: "Shipped" },
  DELIVERED: { icon: CheckCircle, color: "text-green-400 bg-green-400/10", label: "Delivered" },
  CANCELLED: { icon: XCircle, color: "text-red-400 bg-red-400/10", label: "Cancelled" },
};

export default function OrdersPage() {
  const { formatPrice } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/user/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3.5 h-3.5" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
          Account
        </span>
        <h1 className="text-3xl md:text-4xl font-bold mt-2">
          <span className="gradient-text">My Orders</span>
        </h1>
        <p className="text-[var(--text-secondary)] mt-2">
          Track and manage your order history
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-all ${
            showFilters || statusFilter !== "all"
              ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
              : "border-[var(--border)] hover:border-[var(--accent)]/50"
          }`}
        >
          <Filter className="w-5 h-5" />
          Filters
          <ChevronDown
            className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
          />
        </button>
      </motion.div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
        >
          <p className="text-sm font-medium mb-3">Filter by Status</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                statusFilter === "all"
                  ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                  : "border border-[var(--border)] hover:border-[var(--accent)]/50"
              }`}
            >
              All
            </button>
            {Object.entries(statusConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                  statusFilter === key
                    ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                    : "border border-[var(--border)] hover:border-[var(--accent)]/50"
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-[var(--text-muted)] mb-6">
            {orders.length === 0
              ? "You haven't placed any orders yet."
              : "No orders match your search criteria."}
          </p>
          {orders.length === 0 && (
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 border border-[var(--border)] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-mono font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-[var(--text-muted)]">
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
                  <span className="text-lg font-bold">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg"
                    >
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                  {order.items.length > 3 && (
                    <span className="px-3 py-1 text-sm text-[var(--text-muted)]">
                      +{order.items.length - 3} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link href={`/account/orders/${order.orderNumber}`}>
                    <Button variant="secondary" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Invoice
                  </Button>
                  {order.status === "SHIPPED" && (
                    <Button variant="secondary" size="sm">
                      <Truck className="w-4 h-4 mr-2" />
                      Track Order
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
