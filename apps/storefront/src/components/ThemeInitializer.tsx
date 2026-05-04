import { themes, defaultTheme, defaultStyle, defaultMode, themeStyleList } from "@/config/themes";

// Generate the inline script that runs before React hydration
const themeScript = `
(function() {
  const STYLE_STORAGE_KEY = 'akaar-theme-style';
  const MODE_STORAGE_KEY = 'akaar-theme-mode';
  const themes = ${JSON.stringify(themes)};
  const defaultStyle = '${defaultStyle}';
  const defaultMode = '${defaultMode}';
  const validStyles = ${JSON.stringify(themeStyleList.map((style) => style.id))};

  try {
    const savedStyle = localStorage.getItem(STYLE_STORAGE_KEY);
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY);

    // Validate saved values
    const style = (savedStyle && validStyles.includes(savedStyle)) ? savedStyle : defaultStyle;
    const mode = (savedMode === 'light' || savedMode === 'dark') ? savedMode : defaultMode;

    // Build theme ID
    const themeId = style + '-' + mode;
    const theme = themes[themeId] || themes['${defaultTheme}'];
    const root = document.documentElement;

    // Apply colors
    root.style.setProperty('--bg-primary', theme.colors.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.colors.bgSecondary);
    root.style.setProperty('--bg-tertiary', theme.colors.bgTertiary);
    root.style.setProperty('--text-primary', theme.colors.textPrimary);
    root.style.setProperty('--text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--text-muted', theme.colors.textMuted);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-secondary', theme.colors.accentSecondary);
    root.style.setProperty('--accent-glow', theme.colors.accentGlow);
    root.style.setProperty('--border', theme.colors.border);
    root.style.setProperty('--border-accent', theme.colors.borderAccent);
    root.style.setProperty('--grid', theme.colors.grid);
    root.style.setProperty('--background', theme.colors.bgPrimary);
    root.style.setProperty('--foreground', theme.colors.textPrimary);

    // Set theme and mode attributes
    root.setAttribute('data-theme', theme.styleId);
    root.setAttribute('data-mode', theme.mode);

  } catch (e) {}
})();
`;

export function ThemeInitializer() {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
