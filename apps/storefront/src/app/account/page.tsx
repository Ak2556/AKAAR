"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, Edit2, Mail, Package, Save, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel, FieldBlock } from "@/components/ui/storefront-primitives";
import { useToast } from "@/context/ToastContext";
import { useAuthState } from "@/components/providers/AuthProvider";

interface ProfileResponse {
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number | string;
}

export default function AccountPage() {
  const { session, update } = useAuthState();
  const toast = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({ name: session?.user?.name || "" });

  useEffect(() => {
    async function loadAccount() {
      setLoading(true);

      try {
        const [profileResponse, ordersResponse] = await Promise.all([
          fetch("/api/user/profile", { cache: "no-store" }),
          fetch("/api/user/orders", { cache: "no-store" }),
        ]);

        if (profileResponse.ok) {
          const profileData: ProfileResponse = await profileResponse.json();
          setFormData({ name: profileData.user.name || "" });
        }

        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json();
          setRecentOrders((ordersData.orders || []).slice(0, 4));
        } else {
          setRecentOrders([]);
        }
      } catch {
        setRecentOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await update?.({ name: formData.name.trim() });
      toast.success("Profile updated");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <span className="luxury-kicker">Profile</span>
        <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
          Your AKAAR workspace.
        </h1>
        <p className="mt-3 max-w-2xl text-[var(--text-secondary)]">
          Keep your profile current and monitor the most recent production activity tied to this account.
        </p>
      </motion.div>

      <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="luxury-kicker">Identity</span>
            <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Personal information</h2>
          </div>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        ) : isEditing ? (
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <FieldBlock label="Full name">
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData({ name: event.target.value })}
                className="luxury-input w-full rounded-full px-5 py-3"
              />
            </FieldBlock>
            <FieldBlock label="Email">
              <input
                type="email"
                value={session?.user?.email || ""}
                disabled
                className="luxury-input w-full rounded-full px-5 py-3 opacity-50"
              />
            </FieldBlock>
          </div>
        ) : (
          <div className="mt-8 grid gap-px overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
            <InfoRow icon={User} label="Name" value={formData.name || "Not set"} />
            <InfoRow icon={Mail} label="Email" value={session?.user?.email || "Not available"} />
          </div>
        )}
      </section>

      <section className="luxury-card rounded-[2rem] p-6 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="luxury-kicker">Recent activity</span>
            <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Latest orders</h2>
          </div>
          <Link href="/account/orders" className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
            View all orders
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="mt-8">
            <EmptyStatePanel
              icon={AlertCircle}
              title="No orders yet"
              description="Completed purchases will appear here with the latest production status."
            />
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--bg-primary)]">
                    <Package className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="font-mono text-sm text-[var(--text-primary)]">{order.orderNumber}</p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-[var(--text-secondary)]">{order.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--bg-secondary)] px-5 py-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--bg-primary)]">
          <Icon className="h-4 w-4 text-[var(--text-muted)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="luxury-metric-label">{label}</p>
          <p className="luxury-summary-value mt-2 truncate">{value}</p>
        </div>
      </div>
    </div>
  );
}
