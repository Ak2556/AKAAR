export type ThemeStyle = "graphite";
export type ThemeMode = "light" | "dark";

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

export const themeStyles: Record<ThemeStyle, ThemeStyleConfig> = {
  graphite: {
    id: "graphite",
    name: "Graphite Performance",
    description: "Dark graphite chassis with cool metallic highlights",
    accents: {
      accent: "#87b8b4",
      accentSecondary: "#d9d3c6",
      accentGlow: "rgba(135, 184, 180, 0.16)",
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: "#0c0f12",
      bgSecondary: "#141920",
      bgTertiary: "#1d242d",
      textPrimary: "#eef2f3",
      textSecondary: "#a7b3bc",
      textMuted: "#78818a",
      border: "#28323d",
      borderAccent: "#394555",
      grid: "#171d24",
    },
    light: {
      bgPrimary: "#f3f5f7",
      bgSecondary: "#e5eaee",
      bgTertiary: "#d7dde3",
      textPrimary: "#101317",
      textSecondary: "#4f5a63",
      textMuted: "#7d8690",
      border: "#c9d1d9",
      borderAccent: "#a7b6c2",
      grid: "#e6ebf0",
    },
  },
};

function buildTheme(style: ThemeStyleConfig, mode: ThemeMode): Theme {
  const baseColors = mode === "dark" ? style.dark : style.light;

  return {
    id: `${style.id}-${mode}` as ThemeId,
    styleId: style.id,
    mode,
    name: `${style.name} ${mode === "dark" ? "Dark" : "Light"}`,
    description: style.description,
    colors: {
      ...baseColors,
      ...style.accents,
    },
    effects: style.effects,
  };
}

export const themes: Record<ThemeId, Theme> = {} as Record<ThemeId, Theme>;
export const themesByStyle: Record<ThemeStyle, { dark: Theme; light: Theme }> = {} as Record<
  ThemeStyle,
  { dark: Theme; light: Theme }
>;

for (const style of Object.values(themeStyles)) {
  const darkTheme = buildTheme(style, "dark");
  const lightTheme = buildTheme(style, "light");

  themes[darkTheme.id] = darkTheme;
  themes[lightTheme.id] = lightTheme;

  themesByStyle[style.id] = {
    dark: darkTheme,
    light: lightTheme,
  };
}

export const themeStyleList = Object.values(themeStyles);
export const themeList = Object.values(themes);
export const defaultStyle: ThemeStyle = "graphite";
export const defaultMode: ThemeMode = "dark";
export const defaultTheme: ThemeId = "graphite-dark";
