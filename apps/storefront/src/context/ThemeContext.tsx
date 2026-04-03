"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { themes, defaultTheme, darkThemes, lightThemes, type ThemeId, type Theme, type ThemeMode } from "@/config/themes";

const STORAGE_KEY = "akaar-theme";
const MODE_STORAGE_KEY = "akaar-theme-mode";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  mode: ThemeMode;
  isDark: boolean;
  setTheme: (themeId: ThemeId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
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

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveThemeFromMode(mode: ThemeMode, savedThemeId: ThemeId): ThemeId {
  if (mode === "system") {
    const prefersDark = getSystemPrefersDark();
    // Use saved theme if it matches preference, otherwise use default for that mode
    if (prefersDark) {
      return darkThemes.includes(savedThemeId) ? savedThemeId : "cyberpunk";
    } else {
      return lightThemes.includes(savedThemeId) ? savedThemeId : "light";
    }
  }
  if (mode === "dark") {
    return darkThemes.includes(savedThemeId) ? savedThemeId : "cyberpunk";
  }
  return lightThemes.includes(savedThemeId) ? savedThemeId : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultTheme);
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [mounted, setMounted] = useState(false);

  // Load saved theme and mode on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;

    const currentMode = savedMode || "system";
    const baseTheme = savedTheme && themes[savedTheme] ? savedTheme : defaultTheme;

    setModeState(currentMode);
    setThemeId(resolveThemeFromMode(currentMode, baseTheme));
    setMounted(true);
  }, []);

  // Listen for system preference changes when in system mode
  useEffect(() => {
    if (!mounted || mode !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      setThemeId(resolveThemeFromMode("system", savedTheme || defaultTheme));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, mode]);

  // Apply theme when it changes
  useEffect(() => {
    if (mounted) {
      applyTheme(themes[themeId]);
    }
  }, [themeId, mounted]);

  const setTheme = useCallback((newThemeId: ThemeId) => {
    setThemeId(newThemeId);
    localStorage.setItem(STORAGE_KEY, newThemeId);
    // Update mode based on theme type
    const newMode = darkThemes.includes(newThemeId) ? "dark" : "light";
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
    const savedTheme = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    setThemeId(resolveThemeFromMode(newMode, savedTheme || defaultTheme));
  }, []);

  const toggleMode = useCallback(() => {
    const isDark = darkThemes.includes(themeId);
    const newMode: ThemeMode = isDark ? "light" : "dark";
    setMode(newMode);
  }, [themeId, setMode]);

  const theme = themes[themeId];
  const isDark = darkThemes.includes(themeId);

  return (
    <ThemeContext.Provider value={{ theme, themeId, mode, isDark, setTheme, setMode, toggleMode }}>
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
