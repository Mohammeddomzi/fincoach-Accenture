import { Stack } from "expo-router";
import { TamaguiProvider, Theme } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { initSentry } from "../lib/sentry";
import Logo from "../components/Logo";
import React from "react";
import { useAppTheme } from "../lib/useAppTheme";

// Initialize Sentry
initSentry();

export default function RootLayout() {
  const { themeName } = useAppTheme();

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
