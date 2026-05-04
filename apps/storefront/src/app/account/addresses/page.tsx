"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Building,
  Check,
  Edit2,
  Home,
  MapPin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel, FieldBlock } from "@/components/ui/storefront-primitives";
import { useToast } from "@/context/ToastContext";

interface Address {
  id: string;
  label: string | null;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string | null;
  isDefault: boolean;
}

const emptyAddress: Omit<Address, "id"> = {
  label: "",
  type: "home",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
  phone: "",
  isDefault: false,
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh",
];

export default function AddressesPage() {
  const toast = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, "id">>(emptyAddress);
  const [saving, setSaving] = useState(false);

  const fetchAddresses = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/user/addresses", { cache: "no-store" });
      if (!response.ok) {
        setAddresses([]);
        return;
      }

      const data = await response.json();
      setAddresses(data.addresses || []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const resetForm = () => {
    setFormData(emptyAddress);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? `/api/user/addresses/${editingId}` : "/api/user/addresses";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save address");
      }

      toast.success(editingId ? "Address updated" : "Address added");
      await fetchAddresses();
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label || "",
      type: address.type,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      apartment: address.apartment || "",
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      phone: address.phone || "",
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;

    try {
      const response = await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete address");
      }

      toast.success("Address deleted");
      await fetchAddresses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete address");
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      const response = await fetch(`/api/user/addresses/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...address,
          label: address.label || "",
          apartment: address.apartment || "",
          phone: address.phone || "",
          isDefault: true,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update address");
      }

      toast.success("Default address updated");
      await fetchAddresses();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update address");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return Home;
      case "work":
        return Building;
      default:
        return MapPin;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="luxury-kicker">Addresses</span>
          <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
            Delivery destinations for current and future builds.
          </h1>
          <p className="mt-3 text-[var(--text-secondary)]">
            Manage saved addresses to keep checkout fast and accurate.
          </p>
        </div>
        {!showForm ? (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        ) : null}
      </motion.div>

      {showForm ? (
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="luxury-card rounded-[2rem] p-6 sm:p-7"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="luxury-kicker">{editingId ? "Edit address" : "New address"}</span>
              <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">
                {editingId ? "Update saved destination" : "Add a new destination"}
              </h2>
            </div>
            <button type="button" onClick={resetForm} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <FieldBlock label="Address label">
              <input type="text" value={formData.label || ""} onChange={(event) => setFormData({ ...formData, label: event.target.value })} placeholder="Home, Office, Studio" className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <FieldBlock label="Address type">
              <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value as Address["type"] })} className="luxury-input w-full rounded-full px-5 py-3">
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </FieldBlock>
            <FieldBlock label="First name *">
              <input type="text" required value={formData.firstName} onChange={(event) => setFormData({ ...formData, firstName: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <FieldBlock label="Last name *">
              <input type="text" required value={formData.lastName} onChange={(event) => setFormData({ ...formData, lastName: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <div className="sm:col-span-2">
              <FieldBlock label="Street address *">
                <input type="text" required value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
              </FieldBlock>
            </div>
            <div className="sm:col-span-2">
              <FieldBlock label="Apartment, suite, etc.">
                <input type="text" value={formData.apartment || ""} onChange={(event) => setFormData({ ...formData, apartment: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
              </FieldBlock>
            </div>
            <FieldBlock label="City *">
              <input type="text" required value={formData.city} onChange={(event) => setFormData({ ...formData, city: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <FieldBlock label="State *">
              <select required value={formData.state} onChange={(event) => setFormData({ ...formData, state: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3">
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </FieldBlock>
            <FieldBlock label="PIN code *">
              <input type="text" required pattern="[0-9]{6}" value={formData.zip} onChange={(event) => setFormData({ ...formData, zip: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <FieldBlock label="Phone">
              <input type="tel" value={formData.phone || ""} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} className="luxury-input w-full rounded-full px-5 py-3" />
            </FieldBlock>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 rounded-[1.4rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4">
                <input type="checkbox" checked={formData.isDefault} onChange={(event) => setFormData({ ...formData, isDefault: event.target.checked })} className="h-5 w-5 rounded border-[var(--border)]" />
                <span className="text-sm text-[var(--text-primary)]">Set as default shipping address</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-[var(--border)] pt-6">
            <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? "Saving..." : editingId ? "Update Address" : "Add Address"}</Button>
          </div>
        </motion.form>
      ) : null}

      {!showForm && addresses.length === 0 ? (
        <EmptyStatePanel
          icon={AlertCircle}
          title="No addresses saved"
          description="Add a shipping address to speed up checkout."
          action={<Button onClick={() => setShowForm(true)}><Plus className="mr-2 h-4 w-4" />Add Your First Address</Button>}
        />
      ) : null}

      {!showForm && addresses.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address, index) => {
            const Icon = getTypeIcon(address.type);
            return (
              <motion.article
                key={address.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={`luxury-card rounded-[1.9rem] p-6 ${address.isDefault ? "ring-1 ring-[var(--accent)]/35" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[var(--bg-primary)]">
                      <Icon className={`h-5 w-5 ${address.isDefault ? "text-[var(--accent)]" : "text-[var(--text-muted)]"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {address.label || address.type}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                        {address.isDefault ? "Default address" : address.type}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(address)} className="rounded-full p-2 text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)]">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(address.id)} className="rounded-full p-2 text-red-300 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 space-y-1 text-sm text-[var(--text-secondary)]">
                  <p className="font-medium text-[var(--text-primary)]">{address.firstName} {address.lastName}</p>
                  <p>{address.address}{address.apartment ? `, ${address.apartment}` : ""}</p>
                  <p>{address.city}, {address.state} {address.zip}</p>
                  <p>{address.country}</p>
                  {address.phone ? <p className="pt-2 text-[var(--text-muted)]">{address.phone}</p> : null}
                </div>

                {!address.isDefault ? (
                  <button onClick={() => handleSetDefault(address)} className="mt-5 inline-flex items-center gap-2 text-sm text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]">
                    <Check className="h-4 w-4" />
                    Set as default
                  </button>
                ) : null}
              </motion.article>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
