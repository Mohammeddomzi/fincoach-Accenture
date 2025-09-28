import { Stack } from "expo-router";
import { TamaguiProvider, Theme } from "@tamagui/core";
import tamaguiConfig from "../tamagui.config";
import { initSentry } from "../lib/sentry";

// Initialize Sentry
initSentry();

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name="dark">
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: "#0a0a0a",
            },
            headerTintColor: "#FFFFFF",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </Theme>
    </TamaguiProvider>
  );
}
