"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const STORAGE_KEY = "akaar-settings";

export interface Settings {
  // Display
  currency: "INR" | "USD" | "EUR" | "GBP";
  language: string;
  units: "metric" | "imperial";
  productsPerPage: number;
  defaultView: "grid" | "list";

  // Notifications
  emailMarketing: boolean;
  emailOrders: boolean;
  emailNewsletter: boolean;
  pushNotifications: boolean;

  // Accessibility
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "small" | "medium" | "large";

  // Privacy
  analytics: boolean;
  personalizedAds: boolean;
  cookies: "essential" | "functional" | "all";
}

export const defaultSettings: Settings = {
  currency: "INR",
  language: "en",
  units: "metric",
  productsPerPage: 12,
  defaultView: "grid",
  emailMarketing: false,
  emailOrders: true,
  emailNewsletter: false,
  pushNotifications: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: "medium",
  analytics: true,
  personalizedAds: false,
  cookies: "functional",
};

export const currencies = {
  INR: { symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { symbol: "£", name: "British Pound", locale: "en-GB" },
} as const;

// Approximate exchange rates (INR base)
export const exchangeRates = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
} as const;

interface SettingsContextValue {
  settings: Settings;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
  formatPrice: (priceInINR: number) => string;
  formatDimension: (mm: number) => string;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyAccessibilitySettings(settings: Settings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  // Reduced motion
  if (settings.reducedMotion) {
    root.classList.add("reduce-motion");
  } else {
    root.classList.remove("reduce-motion");
  }

  // High contrast
  if (settings.highContrast) {
    root.classList.add("high-contrast");
  } else {
    root.classList.remove("high-contrast");
  }

  // Font size
  root.setAttribute("data-font-size", settings.fontSize);
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = { ...defaultSettings, ...parsed };
        setSettings(merged);
        applyAccessibilitySettings(merged);
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    }
    setMounted(true);
  }, []);

  // Apply accessibility settings when they change
  useEffect(() => {
    if (mounted) {
      applyAccessibilitySettings(settings);
    }
  }, [settings.reducedMotion, settings.highContrast, settings.fontSize, mounted]);

  // Save settings whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, mounted]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    applyAccessibilitySettings(defaultSettings);
  }, []);

  // Format price based on selected currency
  const formatPrice = useCallback((priceInINR: number): string => {
    const currency = settings.currency;
    const rate = exchangeRates[currency];
    const converted = priceInINR * rate;
    const { locale, symbol } = currencies[currency];

    // Format with proper locale
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: currency === "INR" ? 0 : 2,
      maximumFractionDigits: currency === "INR" ? 0 : 2,
    }).format(converted);

    return `${symbol}${formatted}`;
  }, [settings.currency]);

  // Format dimensions based on selected units
  const formatDimension = useCallback((mm: number): string => {
    if (settings.units === "imperial") {
      const inches = mm / 25.4;
      return `${inches.toFixed(2)} in`;
    }
    if (mm >= 10) {
      return `${(mm / 10).toFixed(1)} cm`;
    }
    return `${mm.toFixed(1)} mm`;
  }, [settings.units]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSetting,
        updateSettings,
        resetSettings,
        formatPrice,
        formatDimension,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
