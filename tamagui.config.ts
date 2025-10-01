import { createTamagui } from "@tamagui/core";
import { config } from "@tamagui/config/v3";
import { createInterFont } from "@tamagui/font-inter";

const interFont = createInterFont();

const tamaguiConfig = createTamagui({
  ...config,
  fonts: {
    ...config.fonts,
    body: interFont,
    heading: interFont,
  },
  themes: {
    ...config.themes,
    dark: {
      ...config.themes.dark,
      background: "#0a0a0a",
      color: "#ffffff",
      borderColor: "#2b2f33",
      primary: "#4f7f8c",
      secondary: "#a5c6d5",
      accent: "#b9dae9",
      bg: "#0a0a0a",
      panel: "#111315",
      panelAlt: "#15181a",
      textDim: "#6b7680",
      success: "#34C759",
      warn: "#F59E0B",
      danger: "#FF3B30",
    },
    light: {
      ...config.themes.light,
      background: "#ffffff",
      color: "#0a0a0a",
      borderColor: "#e5e7eb",
      primary: "#4f7f8c",
      secondary: "#a5c6d5",
      accent: "#b9dae9",
      bg: "#ffffff",
      panel: "#f8fafc",
      panelAlt: "#f1f5f9",
      textDim: "#6b7680",
      success: "#16A34A",
      warn: "#D97706",
      danger: "#DC2626",
    },
  },
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
});

export default tamaguiConfig;