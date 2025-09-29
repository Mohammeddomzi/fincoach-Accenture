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
      // Base neutrals for dark UI
      background: "#0a0a0a",
      backgroundHover: "#111315",
      backgroundPress: "#15181a",
      backgroundFocus: "#15181a",
      color: "#ffffff",
      colorHover: "#ffffff",
      colorPress: "#ffffff",
      colorFocus: "#ffffff",
      borderColor: "#2b2f33",
      borderColorHover: "#374047",
      borderColorPress: "#40505a",
      borderColorFocus: "#4f7f8c",
      placeholderColor: "#6b7680",

      // Brand palette (financial teal/blue family)
      // From user palette:
      // color-1: #b9dae9, color-2: #a5c6d5, color-3: #7ca2b1,
      // color-4: #4f7f8c, color-5: #2d5b67
      primary1: "#b9dae9",
      primary2: "#a5c6d5",
      primary3: "#7ca2b1",
      primary4: "#4f7f8c",
      primary5: "#2d5b67",

      // Semantic mappings
      primary: "#4f7f8c", // strong brand for buttons/links
      primaryHover: "#2d5b67",
      primaryPress: "#7ca2b1",
      secondary: "#a5c6d5",
      secondaryHover: "#7ca2b1",
      secondaryPress: "#4f7f8c",
      accent: "#b9dae9",
      accentHover: "#a5c6d5",
      accentPress: "#7ca2b1",

      // Override common color scales used in components
      blue9: "#4f7f8c",
      blue10: "#2d5b67",
      green9: "#34C759",
      green10: "#28A745",
      red9: "#FF3B30",
      red10: "#DC3545",
      gray8: "#111315",
      gray9: "#15181a",
      gray10: "#1c2126",
      gray11: "#6b7680",
      gray12: "#9aa7b2",
    },
    light: {
      ...config.themes.light,
      // Base neutrals for light UI
      background: "#ffffff",
      backgroundHover: "#f8fafc",
      backgroundPress: "#f1f5f9",
      backgroundFocus: "#f1f5f9",
      color: "#0a0a0a",
      colorHover: "#0a0a0a",
      colorPress: "#0a0a0a",
      colorFocus: "#0a0a0a",
      borderColor: "#e5e7eb",
      borderColorHover: "#d1d5db",
      borderColorPress: "#cbd5e1",
      borderColorFocus: "#4f7f8c",
      placeholderColor: "#6b7680",

      // Brand palette
      primary1: "#b9dae9",
      primary2: "#a5c6d5",
      primary3: "#7ca2b1",
      primary4: "#4f7f8c",
      primary5: "#2d5b67",

      // Semantic mappings
      primary: "#4f7f8c",
      primaryHover: "#2d5b67",
      primaryPress: "#7ca2b1",
      secondary: "#a5c6d5",
      secondaryHover: "#7ca2b1",
      secondaryPress: "#4f7f8c",
      accent: "#b9dae9",
      accentHover: "#a5c6d5",
      accentPress: "#7ca2b1",

      // Common color scales used in components
      blue9: "#4f7f8c",
      blue10: "#2d5b67",
      green9: "#34C759",
      green10: "#28A745",
      red9: "#FF3B30",
      red10: "#DC3545",
      gray8: "#f8fafc",
      gray9: "#f1f5f9",
      gray10: "#e5e7eb",
      gray11: "#6b7680",
      gray12: "#374151",
    },
    companyDark: {
      ...config.themes.dark,
      background: "#0b0f12",
      color: "#ffffff",
      borderColor: "#1f2a30",
      primary: "#27566a",
      primaryHover: "#1e4453",
      primaryPress: "#3a7a90",
      secondary: "#6ba7ba",
      accent: "#bfe2ef",
      blue9: "#27566a",
      gray8: "#0e1418",
      gray9: "#121a1f",
      gray10: "#182127",
      gray11: "#6b7680",
      gray12: "#9aa7b2",
    },
    companyLight: {
      ...config.themes.light,
      background: "#ffffff",
      color: "#0a0a0a",
      borderColor: "#e6eef2",
      primary: "#27566a",
      primaryHover: "#1e4453",
      primaryPress: "#3a7a90",
      secondary: "#6ba7ba",
      accent: "#bfe2ef",
      blue9: "#27566a",
      gray8: "#f8fbfd",
      gray9: "#f1f7fa",
      gray10: "#e6eef2",
      gray11: "#5a6b74",
      gray12: "#2a3b44",
    },
  },
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
});

export default tamaguiConfig;
