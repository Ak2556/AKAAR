export type ThemeStyle = "luxury" | "editorial" | "graphite" | "titanium";
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
  luxury: {
    id: "luxury",
    name: "Dark Luxury",
    description: "Obsidian surfaces with restrained champagne highlights",
    accents: {
      accent: "#d6b272",
      accentSecondary: "#7dd3c7",
      accentGlow: "rgba(214, 178, 114, 0.18)",
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: "#09090b",
      bgSecondary: "#111216",
      bgTertiary: "#181a1f",
      textPrimary: "#f5f1e8",
      textSecondary: "#b5afa4",
      textMuted: "#7d766c",
      border: "#24262d",
      borderAccent: "#353842",
      grid: "#15171b",
    },
    light: {
      bgPrimary: "#f4f0e7",
      bgSecondary: "#ebe5da",
      bgTertiary: "#ddd5c7",
      textPrimary: "#151515",
      textSecondary: "#554f47",
      textMuted: "#8d867c",
      border: "#d5cab8",
      borderAccent: "#baa98f",
      grid: "#e8e2d6",
    },
  },
  editorial: {
    id: "editorial",
    name: "Light Editorial",
    description: "Calm ivory layouts with graphite typography and brass cues",
    accents: {
      accent: "#9a6b2f",
      accentSecondary: "#3f5b5a",
      accentGlow: "rgba(154, 107, 47, 0.16)",
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: "#121417",
      bgSecondary: "#191d22",
      bgTertiary: "#232830",
      textPrimary: "#f6f3ee",
      textSecondary: "#c5bdb1",
      textMuted: "#8f877c",
      border: "#303641",
      borderAccent: "#414854",
      grid: "#1b2026",
    },
    light: {
      bgPrimary: "#fbfaf7",
      bgSecondary: "#f2eee7",
      bgTertiary: "#e8e0d5",
      textPrimary: "#17181b",
      textSecondary: "#56514a",
      textMuted: "#91897d",
      border: "#ddd3c4",
      borderAccent: "#cabb9f",
      grid: "#efe9de",
    },
  },
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
  titanium: {
    id: "titanium",
    name: "Warm Titanium",
    description: "Soft champagne metal tones with warm industrial restraint",
    accents: {
      accent: "#b98a4b",
      accentSecondary: "#6f7267",
      accentGlow: "rgba(185, 138, 75, 0.16)",
    },
    effects: {
      enableGlow: false,
      enableScanlines: false,
      enableGrid: false,
      enableNoise: false,
    },
    dark: {
      bgPrimary: "#0f0f10",
      bgSecondary: "#171718",
      bgTertiary: "#222223",
      textPrimary: "#f4efe8",
      textSecondary: "#bdb3a5",
      textMuted: "#8d8377",
      border: "#2e2d2a",
      borderAccent: "#46433f",
      grid: "#181715",
    },
    light: {
      bgPrimary: "#faf6ef",
      bgSecondary: "#f0e7d8",
      bgTertiary: "#e5d8c4",
      textPrimary: "#191715",
      textSecondary: "#65584a",
      textMuted: "#968977",
      border: "#d9ccb7",
      borderAccent: "#c0af95",
      grid: "#ede2d3",
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
export const defaultStyle: ThemeStyle = "luxury";
export const defaultMode: ThemeMode = "dark";
export const defaultTheme: ThemeId = "luxury-dark";
