"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { themes, defaultTheme, type ThemeId, type Theme } from "@/config/themes";

const STORAGE_KEY = "akaar-theme";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setTheme: (themeId: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  // Apply color variables
  root.style.setProperty("--bg-primary", theme.colors.bgPrimary);
  root.style.setProperty("--bg-secondary", theme.colors.bgSecondary);
  root.style.setProperty("--bg-tertiary", theme.colors.bgTertiary);
  root.style.setProperty("--text-primary", theme.colors.textPrimary);
  root.style.setProperty("--text-secondary", theme.colors.textSecondary);
  root.style.setProperty("--text-muted", theme.colors.textMuted);
  root.style.setProperty("--accent", theme.colors.accent);
  root.style.setProperty("--accent-secondary", theme.colors.accentSecondary);
  root.style.setProperty("--accent-glow", theme.colors.accentGlow);
  root.style.setProperty("--border", theme.colors.border);
  root.style.setProperty("--border-accent", theme.colors.borderAccent);
  root.style.setProperty("--grid", theme.colors.grid);

  // Legacy support
  root.style.setProperty("--background", theme.colors.bgPrimary);
  root.style.setProperty("--foreground", theme.colors.textPrimary);

  // Set theme data attribute for effect classes
  root.setAttribute("data-theme", theme.id);

  // Toggle effect classes based on theme settings
  root.classList.toggle("theme-glow", theme.effects.enableGlow);
  root.classList.toggle("theme-scanlines", theme.effects.enableScanlines);
  root.classList.toggle("theme-grid", theme.effects.enableGrid);
  root.classList.toggle("theme-noise", theme.effects.enableNoise);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && themes[saved]) {
      setThemeId(saved);
    }
    setMounted(true);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(themes[themeId]);
    }
  }, [themeId, mounted]);

  const setTheme = useCallback((newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem(STORAGE_KEY, newThemeId);
  }, []);

  const theme = themes[themeId];

  return (
    <ThemeContext.Provider value={{ theme, themeId, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
