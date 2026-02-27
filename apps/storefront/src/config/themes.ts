export type ThemeId = 'cyberpunk' | 'light' | 'industrial' | 'nature';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  colors: {
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    accent: string;
    accentSecondary: string;
    accentGlow: string;
    border: string;
    borderAccent: string;
    grid: string;
  };
  effects: {
    enableGlow: boolean;
    enableScanlines: boolean;
    enableGrid: boolean;
    enableNoise: boolean;
  };
}

export const themes: Record<ThemeId, Theme> = {
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Electric neon with dark backgrounds and glowing effects',
    colors: {
      bgPrimary: '#0a0a0a',
      bgSecondary: '#111111',
      bgTertiary: '#1a1a1a',
      textPrimary: '#ffffff',
      textSecondary: '#888888',
      textMuted: '#555555',
      accent: '#00fff5',
      accentSecondary: '#ff00ff',
      accentGlow: 'rgba(0, 255, 245, 0.5)',
      border: '#222222',
      borderAccent: '#333333',
      grid: '#1a1a1a',
    },
    effects: {
      enableGlow: true,
      enableScanlines: true,
      enableGrid: true,
      enableNoise: true,
    },
  },

  light: {
    id: 'light',
    name: 'Minimal Light',
    description: 'Clean and professional with white backgrounds',
    colors: {
      bgPrimary: '#ffffff',
      bgSecondary: '#f8fafc',
      bgTertiary: '#f1f5f9',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      textMuted: '#94a3b8',
      accent: '#3b82f6',
      accentSecondary: '#8b5cf6',
      accentGlow: 'rgba(59, 130, 246, 0.3)',
      border: '#e2e8f0',
      borderAccent: '#cbd5e1',
      grid: '#f1f5f9',
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
  },

  industrial: {
    id: 'industrial',
    name: 'Industrial',
    description: 'Steel and amber with a factory aesthetic',
    colors: {
      bgPrimary: '#18181b',
      bgSecondary: '#27272a',
      bgTertiary: '#3f3f46',
      textPrimary: '#fafafa',
      textSecondary: '#a1a1aa',
      textMuted: '#71717a',
      accent: '#f59e0b',
      accentSecondary: '#ef4444',
      accentGlow: 'rgba(245, 158, 11, 0.4)',
      border: '#3f3f46',
      borderAccent: '#52525b',
      grid: '#27272a',
    },
    effects: {
      enableGlow: true,
      enableScanlines: false,
      enableGrid: true,
      enableNoise: true,
    },
  },

  nature: {
    id: 'nature',
    name: 'Nature',
    description: 'Earth tones with organic warmth',
    colors: {
      bgPrimary: '#fefce8',
      bgSecondary: '#fef9c3',
      bgTertiary: '#fef08a',
      textPrimary: '#1c1917',
      textSecondary: '#57534e',
      textMuted: '#a8a29e',
      accent: '#22c55e',
      accentSecondary: '#a16207',
      accentGlow: 'rgba(34, 197, 94, 0.3)',
      border: '#d6d3d1',
      borderAccent: '#a8a29e',
      grid: '#fef9c3',
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
  },
};

export const themeList = Object.values(themes);
export const defaultTheme: ThemeId = 'cyberpunk';
