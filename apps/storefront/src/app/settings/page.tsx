"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Palette, Check, Globe, Bell, Eye, Shield,
  Monitor, MousePointer, Type, Sun,
  Mail, Smartphone, Package, CreditCard, Trash2, RotateCcw, Info
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { themeList } from "@/config/themes";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { useSettings, currencies, defaultSettings, type Settings } from "@/context/SettingsContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSession } from "next-auth/react";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
];

export default function SettingsPage() {
  const { themeId, setTheme } = useTheme();
  const { settings, updateSetting, resetSettings } = useSettings();
  const { clearCart } = useCart();
  const { clearWishlist } = useWishlist();
  const { data: session } = useSession();
  const toast = useToast();

  const handleUpdateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    updateSetting(key, value);
    toast.success("Setting saved");
  };

  // Push notifications — request actual browser permission
  const handlePushNotifications = async (enable: boolean) => {
    if (!enable) {
      updateSetting("pushNotifications", false);
      toast.info("Push notifications disabled");
      return;
    }

    if (!("Notification" in window)) {
      toast.error("Your browser does not support push notifications");
      return;
    }

    if (Notification.permission === "granted") {
      updateSetting("pushNotifications", true);
      toast.success("Push notifications enabled");
      return;
    }

    if (Notification.permission === "denied") {
      toast.error("Notifications are blocked. Please allow them in your browser settings.");
      return;
    }

    // Ask for permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      updateSetting("pushNotifications", true);
      // Send a test notification
      new Notification("Akaar Notifications Enabled", {
        body: "You'll now receive updates about your orders.",
        icon: "/logo.svg",
      });
      toast.success("Push notifications enabled");
    } else {
      toast.error("Notification permission denied");
    }
  };

  const handleReset = () => {
    resetSettings();
    toast.info("Settings reset to defaults");
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success("Wishlist cleared");
  };

  const handleClearHistory = () => {
    localStorage.removeItem("akaar-recent");
    toast.success("Browsing history cleared");
  };

  const handleClearAllData = () => {
    if (confirm("This will reset ALL settings and clear all local data. Are you sure?")) {
      clearCart();
      clearWishlist();
      localStorage.clear();
      toast.success("All data cleared");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mb-12"
        >
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Preferences
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            <span className="gradient-text">Settings</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)]">
            Customize your Akaar experience. Changes are saved automatically.
          </p>
        </motion.div>

        <div className="max-w-4xl space-y-8">

          {/* ============ THEME ============ */}
          <SettingsSection
            icon={Palette}
            title="Theme"
            description="Choose your preferred visual style"
            delay={0.1}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {themeList.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={`group relative p-4 border rounded-xl transition-all text-left ${
                    themeId === theme.id
                      ? "border-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)] hover:border-[var(--accent)]/50 bg-[var(--bg-secondary)]"
                  }`}
                >
                  {themeId === theme.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-[var(--accent)] rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-[var(--bg-primary)]" />
                    </div>
                  )}
                  <div className="flex gap-1 mb-3">
                    <div className="w-6 h-6 rounded border border-[var(--border)]" style={{ background: theme.colors.bgPrimary }} />
                    <div className="w-6 h-6 rounded border border-[var(--border)]" style={{ background: theme.colors.accent }} />
                    <div className="w-6 h-6 rounded border border-[var(--border)]" style={{ background: theme.colors.accentSecondary }} />
                  </div>
                  <h3 className="font-semibold text-sm">{theme.name}</h3>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{theme.description}</p>
                </button>
              ))}
            </div>
          </SettingsSection>

          {/* ============ DISPLAY ============ */}
          <SettingsSection
            icon={Monitor}
            title="Display"
            description="Configure how content is displayed"
            delay={0.15}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Currency */}
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleUpdateSetting("currency", e.target.value as Settings["currency"])}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                >
                  {Object.entries(currencies).map(([code, { symbol, name }]) => (
                    <option key={code} value={code}>{symbol} {name}</option>
                  ))}
                </select>
                <p className="text-xs text-[var(--text-muted)] mt-1">Prices will be converted automatically</p>
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleUpdateSetting("language", e.target.value)}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              {/* Units */}
              <div>
                <label className="block text-sm font-medium mb-2">Measurement Units</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSetting("units", "metric")}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-all ${
                      settings.units === "metric"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    Metric (mm, cm)
                  </button>
                  <button
                    onClick={() => handleUpdateSetting("units", "imperial")}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-all ${
                      settings.units === "imperial"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    Imperial (in, ft)
                  </button>
                </div>
              </div>

              {/* Products per page */}
              <div>
                <label className="block text-sm font-medium mb-2">Products Per Page</label>
                <select
                  value={settings.productsPerPage}
                  onChange={(e) => handleUpdateSetting("productsPerPage", parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value={12}>12 products</option>
                  <option value={24}>24 products</option>
                  <option value={48}>48 products</option>
                  <option value={96}>96 products</option>
                </select>
              </div>

              {/* Default View */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-2">Default Product View</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateSetting("defaultView", "grid")}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-all flex items-center justify-center gap-2 ${
                      settings.defaultView === "grid"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid View
                  </button>
                  <button
                    onClick={() => handleUpdateSetting("defaultView", "list")}
                    className={`flex-1 px-4 py-3 border rounded-lg transition-all flex items-center justify-center gap-2 ${
                      settings.defaultView === "list"
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border)] hover:border-[var(--accent)]/50"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                    List View
                  </button>
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ============ NOTIFICATIONS ============ */}
          <SettingsSection
            icon={Bell}
            title="Notifications"
            description="Manage how you receive updates"
            delay={0.2}
          >
            <div className="space-y-4">
              {!session && (
                <div className="flex items-start gap-3 p-3 border border-[var(--accent)]/20 rounded-lg bg-[var(--accent)]/5 text-sm text-[var(--text-secondary)]">
                  <Info className="w-4 h-4 text-[var(--accent)] mt-0.5 flex-shrink-0" />
                  <span>Email preferences are saved locally. Sign in to sync them with your account.</span>
                </div>
              )}
              <ToggleSetting
                icon={Mail}
                title="Order Updates"
                description="Receive emails about your order status"
                checked={settings.emailOrders}
                onChange={(v) => handleUpdateSetting("emailOrders", v)}
              />
              <ToggleSetting
                icon={Package}
                title="Marketing Emails"
                description="Get notified about new products and offers"
                checked={settings.emailMarketing}
                onChange={(v) => handleUpdateSetting("emailMarketing", v)}
              />
              <ToggleSetting
                icon={Mail}
                title="Newsletter"
                description="Weekly digest of engineering updates"
                checked={settings.emailNewsletter}
                onChange={(v) => handleUpdateSetting("emailNewsletter", v)}
              />
              <ToggleSetting
                icon={Smartphone}
                title="Push Notifications"
                description="Browser notifications for important order updates"
                checked={settings.pushNotifications}
                onChange={handlePushNotifications}
              />
            </div>
          </SettingsSection>

          {/* ============ ACCESSIBILITY ============ */}
          <SettingsSection
            icon={Eye}
            title="Accessibility"
            description="Make the site easier to use"
            delay={0.25}
          >
            <div className="space-y-6">
              <ToggleSetting
                icon={MousePointer}
                title="Reduced Motion"
                description="Minimize animations and transitions"
                checked={settings.reducedMotion}
                onChange={(v) => handleUpdateSetting("reducedMotion", v)}
              />
              <ToggleSetting
                icon={Sun}
                title="High Contrast"
                description="Increase contrast for better readability"
                checked={settings.highContrast}
                onChange={(v) => handleUpdateSetting("highContrast", v)}
              />

              {/* Font Size */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Type className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="font-medium">Font Size</p>
                    <p className="text-sm text-[var(--text-muted)]">Adjust text size across the site</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {(["small", "medium", "large"] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleUpdateSetting("fontSize", size)}
                      className={`flex-1 px-4 py-3 border rounded-lg transition-all capitalize ${
                        settings.fontSize === size
                          ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <span className={size === "small" ? "text-sm" : size === "large" ? "text-lg" : ""}>
                        {size}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ============ PRIVACY ============ */}
          <SettingsSection
            icon={Shield}
            title="Privacy"
            description="Control your data and privacy settings"
            delay={0.3}
          >
            <div className="space-y-6">
              <ToggleSetting
                icon={Eye}
                title="Analytics"
                description="Help us improve by sharing anonymous usage data"
                checked={settings.analytics}
                onChange={(v) => handleUpdateSetting("analytics", v)}
              />
              <ToggleSetting
                icon={CreditCard}
                title="Personalized Ads"
                description="Show ads based on your browsing history"
                checked={settings.personalizedAds}
                onChange={(v) => handleUpdateSetting("personalizedAds", v)}
              />

              {/* Cookie Preferences */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Globe className="w-5 h-5 text-[var(--text-muted)]" />
                  <div>
                    <p className="font-medium">Cookie Preferences</p>
                    <p className="text-sm text-[var(--text-muted)]">Control which cookies we can use</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {([
                    { value: "essential", label: "Essential Only", desc: "Required for site functionality only", gatesAnalytics: true, gatesAds: true },
                    { value: "functional", label: "Functional", desc: "Essential + preferences & anonymous analytics", gatesAnalytics: false, gatesAds: true },
                    { value: "all", label: "All Cookies", desc: "Include marketing and personalization", gatesAnalytics: false, gatesAds: false },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        handleUpdateSetting("cookies", option.value);
                        // Enforce analytics gating based on cookie level
                        if (option.gatesAnalytics) {
                          updateSetting("analytics", false);
                          updateSetting("personalizedAds", false);
                        } else if (option.gatesAds) {
                          updateSetting("personalizedAds", false);
                        }
                      }}
                      className={`w-full p-4 border rounded-lg transition-all text-left ${
                        settings.cookies === option.value
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] hover:border-[var(--accent)]/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{option.label}</p>
                          <p className="text-sm text-[var(--text-muted)]">{option.desc}</p>
                        </div>
                        {settings.cookies === option.value && (
                          <Check className="w-5 h-5 text-[var(--accent)]" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SettingsSection>

          {/* ============ DANGER ZONE ============ */}
          <SettingsSection
            icon={Trash2}
            title="Data Management"
            description="Manage your stored data"
            delay={0.35}
            danger
          >
            <div className="space-y-4">
              <button
                onClick={handleClearCart}
                className="w-full p-4 border border-[var(--border)] rounded-lg hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left"
              >
                <p className="font-medium">Clear Cart</p>
                <p className="text-sm text-[var(--text-muted)]">Remove all items from your cart</p>
              </button>
              <button
                onClick={handleClearWishlist}
                className="w-full p-4 border border-[var(--border)] rounded-lg hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left"
              >
                <p className="font-medium">Clear Wishlist</p>
                <p className="text-sm text-[var(--text-muted)]">Remove all saved items</p>
              </button>
              <button
                onClick={handleClearHistory}
                className="w-full p-4 border border-[var(--border)] rounded-lg hover:border-red-500/50 hover:bg-red-500/5 transition-all text-left"
              >
                <p className="font-medium">Clear Browsing History</p>
                <p className="text-sm text-[var(--text-muted)]">Remove recently viewed products</p>
              </button>
              <button
                onClick={handleClearAllData}
                className="w-full p-4 border border-red-500/30 rounded-lg hover:border-red-500 hover:bg-red-500/10 transition-all text-left text-red-400"
              >
                <p className="font-medium">Clear All Data</p>
                <p className="text-sm opacity-70">Remove all local data and reset to defaults</p>
              </button>
            </div>
          </SettingsSection>

          {/* ============ RESET BUTTON ============ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-between pt-8 border-t border-[var(--border)]"
          >
            <p className="text-sm text-[var(--text-muted)]">
              Settings are saved automatically
            </p>
            <Button
              variant="secondary"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset All Settings
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Settings Section Component
function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  delay = 0,
  danger = false,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  delay?: number;
  danger?: boolean;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`p-6 border rounded-xl ${danger ? "border-red-500/20 bg-red-500/5" : "border-[var(--border)] bg-[var(--bg-secondary)]"}`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${danger ? "border-red-500/30" : "border-[var(--accent)]/30"}`}>
          <Icon className={`w-5 h-5 ${danger ? "text-red-400" : "text-[var(--accent)]"}`} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

// Toggle Setting Component
function ToggleSetting({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 border border-[var(--border)] rounded-lg">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-[var(--text-muted)]" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          checked ? "bg-[var(--accent)]" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
