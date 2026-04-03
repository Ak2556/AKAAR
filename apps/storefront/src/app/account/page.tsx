"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Building,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function AccountPage() {
  const { data: session, update } = useSession();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    phone: "",
    company: "",
  });

  // Mock recent orders - in production, fetch from API
  const recentOrders = [
    {
      id: "AKR-ABC123-X1",
      date: "2024-02-20",
      status: "DELIVERED",
      total: 4999,
    },
    {
      id: "AKR-DEF456-Y2",
      date: "2024-02-15",
      status: "SHIPPED",
      total: 12499,
    },
    {
      id: "AKR-GHI789-Z3",
      date: "2024-02-10",
      status: "PROCESSING",
      total: 7999,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-400 bg-green-400/10";
      case "SHIPPED":
        return "text-blue-400 bg-blue-400/10";
      case "PROCESSING":
        return "text-yellow-400 bg-yellow-400/10";
      case "CANCELLED":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-[var(--text-muted)] bg-[var(--bg-secondary)]";
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await update({ name: formData.name });
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

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
          <span className="gradient-text">My Profile</span>
        </h1>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-[var(--accent)]" />
            Personal Information
          </h2>
          {!isEditing ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Email cannot be changed
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Your company name"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Name</p>
                <p className="font-medium">{session?.user?.name || "Not set"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Email</p>
                <p className="font-medium">{session?.user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Phone</p>
                <p className="font-medium text-[var(--text-secondary)]">
                  Not set
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm text-[var(--text-muted)]">Company</p>
                <p className="font-medium text-[var(--text-secondary)]">
                  Not set
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid sm:grid-cols-3 gap-4"
      >
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-5 h-5 text-[var(--accent)]" />
            <span className="text-sm text-[var(--text-muted)]">Total Orders</span>
          </div>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-sm text-[var(--text-muted)]">In Progress</span>
          </div>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-sm text-[var(--text-muted)]">Completed</span>
          </div>
          <p className="text-3xl font-bold">10</p>
        </div>
      </motion.div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Package className="w-5 h-5 text-[var(--accent)]" />
            Recent Orders
          </h2>
          <a
            href="/account/orders"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View all orders
          </a>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
            <p className="text-[var(--text-muted)]">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <a
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center group-hover:border-[var(--accent)]/50 transition-colors">
                    <Package className="w-5 h-5 text-[var(--text-muted)]" />
                  </div>
                  <div>
                    <p className="font-mono text-sm">{order.id}</p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {new Date(order.date).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold">
                    ₹{order.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
