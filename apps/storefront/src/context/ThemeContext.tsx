"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  themes,
  themeStyles,
  themesByStyle,
  defaultStyle,
  defaultMode,
  defaultTheme,
  type ThemeId,
  type ThemeStyle,
  type ThemeMode,
  type Theme,
} from "@/config/themes";

const STYLE_STORAGE_KEY = "akaar-theme-style";
const MODE_STORAGE_KEY = "akaar-theme-mode";

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  style: ThemeStyle;
  mode: ThemeMode;
  isDark: boolean;
  setStyle: (style: ThemeStyle) => void;
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

  // Set theme data attributes for CSS targeting
  root.setAttribute("data-theme", theme.styleId);
  root.setAttribute("data-mode", theme.mode);

  // Toggle effect classes based on theme settings
  root.classList.toggle("theme-glow", theme.effects.enableGlow);
  root.classList.toggle("theme-scanlines", theme.effects.enableScanlines);
  root.classList.toggle("theme-grid", theme.effects.enableGrid);
  root.classList.toggle("theme-noise", theme.effects.enableNoise);
}

function getThemeId(style: ThemeStyle, mode: ThemeMode): ThemeId {
  return `${style}-${mode}` as ThemeId;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<ThemeStyle>(defaultStyle);
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [mounted, setMounted] = useState(false);

  // Load saved theme and mode on mount
  useEffect(() => {
    const savedStyle = localStorage.getItem(STYLE_STORAGE_KEY) as ThemeStyle | null;
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) as ThemeMode | null;

    // Validate saved values
    const validStyle = savedStyle && themeStyles[savedStyle] ? savedStyle : defaultStyle;
    const validMode = savedMode && (savedMode === 'light' || savedMode === 'dark') ? savedMode : defaultMode;

    setStyleState(validStyle);
    setModeState(validMode);
    setMounted(true);
  }, []);

  // Apply theme when style or mode changes
  useEffect(() => {
    if (mounted) {
      const themeId = getThemeId(style, mode);
      const theme = themes[themeId];
      if (theme) {
        applyTheme(theme);
      }
    }
  }, [style, mode, mounted]);

  const setStyle = useCallback((newStyle: ThemeStyle) => {
    setStyleState(newStyle);
    localStorage.setItem(STYLE_STORAGE_KEY, newStyle);
  }, []);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(MODE_STORAGE_KEY, newMode);
  }, []);

  const toggleMode = useCallback(() => {
    const newMode: ThemeMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
  }, [mode, setMode]);

  const themeId = getThemeId(style, mode);
  const theme = themes[themeId] || themes[defaultTheme];
  const isDark = mode === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, themeId, style, mode, isDark, setStyle, setMode, toggleMode }}>
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
