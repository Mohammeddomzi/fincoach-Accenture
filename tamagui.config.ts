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
      backgroundHover: "#1a1a1a",
      backgroundPress: "#2a2a2a",
      backgroundFocus: "#2a2a2a",
      color: "#ffffff",
      colorHover: "#ffffff",
      colorPress: "#ffffff",
      colorFocus: "#ffffff",
      borderColor: "#333333",
      borderColorHover: "#444444",
      borderColorPress: "#555555",
      borderColorFocus: "#007AFF",
      placeholderColor: "#666666",
      // Custom colors for better contrast
      blue9: "#007AFF",
      blue10: "#0056CC",
      green9: "#34C759",
      green10: "#28A745",
      red9: "#FF3B30",
      red10: "#DC3545",
      gray8: "#1a1a1a",
      gray9: "#2a2a2a",
      gray10: "#3a3a3a",
      gray11: "#666666",
      gray12: "#999999",
    },
  },
  shouldAddPrefersColorThemes: true,
  themeClassNameOnRoot: true,
});

export default tamaguiConfig;
