export type ThemeStyle = 'cyberpunk' | 'minimal' | 'industrial' | 'nothing';
export type ThemeMode = 'light' | 'dark';

// For backwards compatibility
export type ThemeId = `${ThemeStyle}-${ThemeMode}`;

interface BaseColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderAccent: string;
  grid: string;
}

interface AccentColors {
  accent: string;
  accentSecondary: string;
  accentGlow: string;
}

export interface ThemeStyleConfig {
  id: ThemeStyle;
  name: string;
  description: string;
  accents: AccentColors;
  effects: {
    enableGlow: boolean;
    enableScanlines: boolean;
    enableGrid: boolean;
    enableNoise: boolean;
  };
  dark: BaseColors;
  light: BaseColors;
}

export interface Theme {
  id: ThemeId;
  styleId: ThemeStyle;
  mode: ThemeMode;
  name: string;
  description: string;
  colors: BaseColors & AccentColors;
  effects: {
    enableGlow: boolean;
    enableScanlines: boolean;
    enableGrid: boolean;
    enableNoise: boolean;
  };
}

// Theme style definitions with both light and dark variants
export const themeStyles: Record<ThemeStyle, ThemeStyleConfig> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Electric neon with glowing effects',
    accents: {
      accent: '#00fff5',
      accentSecondary: '#ff00ff',
      accentGlow: 'rgba(0, 255, 245, 0.5)',
    },
    effects: {
      enableGlow: true,
      enableScanlines: true,
      enableGrid: true,
      enableNoise: true,
    },
    dark: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#111111',
      bgTertiary: '#1a1a1a',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#555555',
      border: '#222222',
      borderAccent: '#333333',
      grid: '#1a1a1a',
    },
    light: {
      bgPrimary: '#f0fdfa',
      bgSecondary: '#ccfbf1',
      bgTertiary: '#99f6e4',
      textPrimary: '#042f2e',
      textSecondary: '#115e59',
      textMuted: '#5eead4',
      border: '#5eead4',
      borderAccent: '#2dd4bf',
      grid: '#ccfbf1',
    },
  },

  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean and professional design',
    accents: {
      accent: '#3b82f6',
      accentSecondary: '#8b5cf6',
      accentGlow: 'rgba(59, 130, 246, 0.3)',
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: '#0f172a',
      bgSecondary: '#1e293b',
      bgTertiary: '#334155',
      textPrimary: '#f8fafc',
      textSecondary: '#94a3b8',
      textMuted: '#64748b',
      border: '#334155',
      borderAccent: '#475569',
      grid: '#1e293b',
    },
    light: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      border: '#e2e8f0',
      borderAccent: '#cbd5e1',
      grid: '#f1f5f9',
    },
  },

  industrial: {
    id: 'industrial',
    name: 'Industrial',
    description: 'Steel and amber factory aesthetic',
    accents: {
      accent: '#f59e0b',
      accentSecondary: '#ef4444',
      accentGlow: 'rgba(245, 158, 11, 0.4)',
    },
    effects: {
      enableGlow: true,
      enableScanlines: false,
      enableGrid: true,
      enableNoise: true,
    },
    dark: {
      bgPrimary: '#18181b',
      bgSecondary: '#27272a',
      bgTertiary: '#3f3f46',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
      border: '#3f3f46',
      borderAccent: '#52525b',
      grid: '#27272a',
    },
    light: {
      bgPrimary: '#fffbeb',
      bgSecondary: '#fef3c7',
      bgTertiary: '#fde68a',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      textMuted: '#a8a29e',
      border: '#fcd34d',
      borderAccent: '#fbbf24',
      grid: '#fef3c7',
    },
  },

  nothing: {
    id: 'nothing',
    name: 'Nothing',
    description: 'Monochrome dot-matrix · Nothing OS',
    accents: {
      accent: '#ffffff',
      accentSecondary: '#d4d4d4',
      accentGlow: 'rgba(255, 255, 255, 0.1)',
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: '#000000',
      bgSecondary: '#0d0d0d',
      bgTertiary: '#171717',
      textPrimary: '#ffffff',
      textSecondary: '#a3a3a3',
      textMuted: '#525252',
      border: '#262626',
      borderAccent: '#333333',
      grid: '#0d0d0d',
    },
    light: {
      bgPrimary: '#ffffff',
      bgSecondary: '#fafafa',
      bgTertiary: '#f5f5f5',
      textPrimary: '#000000',
      textSecondary: '#525252',
      textMuted: '#a3a3a3',
      border: '#e5e5e5',
      borderAccent: '#d4d4d4',
      grid: '#fafafa',
    },
  },
};

// Build resolved themes from style + mode combinations
function buildTheme(style: ThemeStyleConfig, mode: ThemeMode): Theme {
  const baseColors = mode === 'dark' ? style.dark : style.light;
  return {
    id: `${style.id}-${mode}` as ThemeId,
    styleId: style.id,
    mode,
    name: `${style.name} ${mode === 'dark' ? 'Dark' : 'Light'}`,
    description: style.description,
    colors: {
      ...baseColors,
      ...style.accents,
    },
    effects: style.effects,
  };
}

// Generate all theme combinations
export const themes: Record<ThemeId, Theme> = {} as Record<ThemeId, Theme>;
export const themesByStyle: Record<ThemeStyle, { dark: Theme; light: Theme }> = {} as Record<ThemeStyle, { dark: Theme; light: Theme }>;

for (const style of Object.values(themeStyles)) {
  const darkTheme = buildTheme(style, 'dark');
  const lightTheme = buildTheme(style, 'light');

  themes[darkTheme.id] = darkTheme;
  themes[lightTheme.id] = lightTheme;

  themesByStyle[style.id] = {
    dark: darkTheme,
    light: lightTheme,
  };
}

export const themeStyleList = Object.values(themeStyles);
export const themeList = Object.values(themes);
export const defaultStyle: ThemeStyle = 'cyberpunk';
export const defaultMode: ThemeMode = 'dark';
export const defaultTheme: ThemeId = 'cyberpunk-dark';
