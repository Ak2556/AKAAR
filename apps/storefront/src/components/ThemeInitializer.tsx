import { themes, defaultTheme, darkThemes, lightThemes } from "@/config/themes";

// Generate the inline script that runs before React hydration
const themeScript = `
(function() {
  const STORAGE_KEY = 'akaar-theme';
  const MODE_STORAGE_KEY = 'akaar-theme-mode';
  const themes = ${JSON.stringify(themes)};
  const defaultTheme = '${defaultTheme}';
  const darkThemes = ${JSON.stringify(darkThemes)};
  const lightThemes = ${JSON.stringify(lightThemes)};

  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    const savedMode = localStorage.getItem(MODE_STORAGE_KEY) || 'system';

    // Resolve theme based on mode
    let themeId;
    if (savedMode === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        themeId = (savedTheme && darkThemes.includes(savedTheme)) ? savedTheme : 'cyberpunk';
      } else {
        themeId = (savedTheme && lightThemes.includes(savedTheme)) ? savedTheme : 'light';
      }
    } else if (savedMode === 'dark') {
      themeId = (savedTheme && darkThemes.includes(savedTheme)) ? savedTheme : 'cyberpunk';
    } else {
      themeId = (savedTheme && lightThemes.includes(savedTheme)) ? savedTheme : 'light';
    }

    const theme = themes[themeId] || themes[defaultTheme];
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

    // Set theme attribute
    root.setAttribute('data-theme', theme.id);

    // Toggle effect classes
    if (theme.effects.enableGlow) root.classList.add('theme-glow');
    if (theme.effects.enableScanlines) root.classList.add('theme-scanlines');
    if (theme.effects.enableGrid) root.classList.add('theme-grid');
    if (theme.effects.enableNoise) root.classList.add('theme-noise');
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
