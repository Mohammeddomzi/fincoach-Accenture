import { Stack } from "expo-router";
import { TamaguiProvider, Theme } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { initSentry } from "../lib/sentry";
import Logo from "../components/Logo";
import React, { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { loadSettings } from "../lib/ai";

// Initialize Sentry
initSentry();

export default function RootLayout() {
  const [themeName, setThemeName] = useState<"dark" | "light" | "companyDark" | "companyLight">("dark");

  useEffect(() => {
    const init = async () => {
      const settings = await loadSettings();
      const systemScheme = Appearance.getColorScheme() || "dark";
      const base = settings.theme === "system" ? (systemScheme as "dark" | "light") : (settings.theme as "dark" | "light");
      const next = settings.companyMode ? (base === "dark" ? "companyDark" : "companyLight") : base;
      setThemeName(next as any);
    };
    init();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      // Update when system theme changes if user selected system
      loadSettings().then((s) => {
        if (s.theme === "system") {
          const base = ((colorScheme || "dark") as "dark" | "light");
          const next = s.companyMode ? (base === "dark" ? "companyDark" : "companyLight") : base;
          setThemeName(next as any);
        }
      });
    });
    return () => sub.remove();
  }, []);

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name={themeName}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: themeName === "dark" ? "#0a0a0a" : "#ffffff",
            },
            headerTintColor: themeName === "dark" ? "#FFFFFF" : "#0a0a0a",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}
