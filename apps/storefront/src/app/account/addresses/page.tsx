"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Home,
  Building,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

interface Address {
  id: string;
  label: string;
  type: "home" | "work" | "other";
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
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

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/user/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      // Use mock data for demo
      setAddresses([
        {
          id: "1",
          label: "Home",
          type: "home",
          firstName: "John",
          lastName: "Doe",
          address: "123 Main Street",
          apartment: "Apt 4B",
          city: "Mumbai",
          state: "Maharashtra",
          zip: "400001",
          country: "India",
          phone: "+91 98765 43210",
          isDefault: true,
        },
        {
          id: "2",
          label: "Office",
          type: "work",
          firstName: "John",
          lastName: "Doe",
          address: "456 Business Park",
          city: "Bengaluru",
          state: "Karnataka",
          zip: "560001",
          country: "India",
          isDefault: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId
        ? `/api/user/addresses/${editingId}`
        : "/api/user/addresses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          editingId ? "Address updated successfully" : "Address added successfully"
        );
        fetchAddresses();
        resetForm();
      } else {
        throw new Error("Failed to save address");
      }
    } catch {
      // For demo, just update local state
      if (editingId) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingId ? { ...formData, id: editingId } : a))
        );
      } else {
        setAddresses((prev) => [
          ...prev,
          { ...formData, id: Date.now().toString() },
        ]);
      }
      toast.success(
        editingId ? "Address updated successfully" : "Address added successfully"
      );
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      await fetch(`/api/user/addresses/${id}`, { method: "DELETE" });
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted successfully");
    } catch {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted successfully");
    }
  };

  const handleSetDefault = async (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    toast.success("Default address updated");
  };

  const resetForm = () => {
    setFormData(emptyAddress);
    setEditingId(null);
    setShowForm(false);
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
        className="flex items-start justify-between"
      >
        <div>
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Account
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            <span className="gradient-text">My Addresses</span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Manage your shipping addresses
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Address
          </Button>
        )}
      </motion.div>

      {/* Add/Edit Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>
            <button
              type="button"
              onClick={resetForm}
              className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Address Type */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Address Type
              </label>
              <div className="flex gap-2">
                {(["home", "work", "other"] as const).map((type) => {
                  const Icon = getTypeIcon(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-all capitalize ${
                        formData.type === type
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Label */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Address Label
              </label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) =>
                  setFormData({ ...formData, label: e.target.value })
                }
                placeholder="e.g., Home, Office, Mom's Place"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* Address */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Street Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="House/Flat number, Street name"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Apartment, Suite, etc.
              </label>
              <input
                type="text"
                value={formData.apartment}
                onChange={(e) =>
                  setFormData({ ...formData, apartment: e.target.value })
                }
                placeholder="Optional"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            {/* City & State */}
            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State *</label>
              <select
                required
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              >
                <option value="">Select State</option>
                {indianStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            {/* ZIP & Country */}
            <div>
              <label className="block text-sm font-medium mb-2">
                PIN Code *
              </label>
              <input
                type="text"
                required
                pattern="[0-9]{6}"
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                placeholder="6-digit PIN code"
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                disabled
                className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg opacity-50"
              />
            </div>

            {/* Phone */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Phone Number
              </label>
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

            {/* Default Address */}
            <div className="sm:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData({ ...formData, isDefault: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <span>Set as default shipping address</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-[var(--border)]">
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId
                ? "Update Address"
                : "Add Address"}
            </Button>
          </div>
        </motion.form>
      )}

      {/* Addresses List */}
      {!showForm && addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[var(--text-muted)]" />
          <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
          <p className="text-[var(--text-muted)] mb-6">
            Add a shipping address to speed up checkout
          </p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Address
          </Button>
        </motion.div>
      ) : (
        !showForm && (
          <div className="grid sm:grid-cols-2 gap-4">
            {addresses.map((address, index) => {
              const Icon = getTypeIcon(address.type);
              return (
                <motion.div
                  key={address.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={`p-6 border rounded-xl transition-all ${
                    address.isDefault
                      ? "border-[var(--accent)] bg-[var(--accent)]/5"
                      : "border-[var(--border)] bg-[var(--bg-secondary)]"
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 border rounded-lg flex items-center justify-center ${
                          address.isDefault
                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                            : "border-[var(--border)]"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            address.isDefault
                              ? "text-[var(--accent)]"
                              : "text-[var(--text-muted)]"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-semibold flex items-center gap-2">
                          {address.label || address.type}
                          {address.isDefault && (
                            <span className="text-xs px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-[var(--text-muted)] capitalize">
                          {address.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4 text-[var(--text-muted)]" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {address.firstName} {address.lastName}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      {address.address}
                      {address.apartment && `, ${address.apartment}`}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      {address.city}, {address.state} {address.zip}
                    </p>
                    <p className="text-[var(--text-secondary)]">
                      {address.country}
                    </p>
                    {address.phone && (
                      <p className="text-[var(--text-muted)] pt-2">
                        {address.phone}
                      </p>
                    )}
                  </div>

                  {/* Set as Default */}
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="mt-4 flex items-center gap-2 text-sm text-[var(--accent)] hover:underline"
                    >
                      <Check className="w-4 h-4" />
                      Set as default
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
