import React, { useState, useEffect } from "react";
import { Alert } from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Select } from "@tamagui/select";
import { saveSettings, loadSettings } from "../../lib/ai";
import { SUPPORTED_CURRENCIES } from "../../lib/currency";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    currency: "SAR",
    theme: "dark" as "dark" | "light" | "system",
    locale: "en-SA",
  });

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    const loadedSettings = await loadSettings();
    setSettings(loadedSettings);
  };

  const handleCurrencyChange = (currency: string) => {
    const newSettings = { ...settings, currency };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleThemeChange = (theme: "dark" | "light" | "system") => {
    const newSettings = { ...settings, theme };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetData = () => {
    Alert.alert(
      "Reset All Data",
      "This will delete all your goals, chat history, and settings. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setSettings({
                currency: "SAR",
                theme: "dark",
                locale: "en-SA",
              });
              Alert.alert("Success", "All data has been reset");
            } catch (error) {
              console.error("Error resetting data:", error);
              Alert.alert("Error", "Failed to reset data");
            }
          },
        },
      ]
    );
  };

  return (
    <View flex={1} backgroundColor="$background" style={{ padding: 16 }}>
      <YStack space="$6">
        <Text fontSize="$8" fontWeight="bold" color="$color">
          Settings
        </Text>

        {/* Currency */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Currency
          </Text>
          <View
            backgroundColor="$gray8"
            padding="$3"
            borderRadius="$3"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text color="$color">
              {
                SUPPORTED_CURRENCIES.find((c) => c.code === settings.currency)
                  ?.symbol
              }{" "}
              {
                SUPPORTED_CURRENCIES.find((c) => c.code === settings.currency)
                  ?.name
              }{" "}
              ({settings.currency})
            </Text>
          </View>
        </YStack>

        {/* Theme */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Theme
          </Text>
          <XStack space="$3">
            {(["dark", "light", "system"] as const).map((theme) => (
              <Button
                key={theme}
                flex={1}
                backgroundColor={settings.theme === theme ? "$blue9" : "$gray8"}
                color="$color"
                onPress={() => handleThemeChange(theme)}
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
              >
                {theme}
              </Button>
            ))}
          </XStack>
        </YStack>

        {/* Locale */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Locale
          </Text>
          <View
            backgroundColor="$gray8"
            padding="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text color="$gray11">{settings.locale} (Read-only)</Text>
            <Text fontSize="$3" color="$gray11" marginTop="$2">
              Locale is automatically detected from your device settings
            </Text>
          </View>
        </YStack>

        {/* Reset Data */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Data Management
          </Text>
          <Button
            backgroundColor="$red9"
            color="white"
            onPress={handleResetData}
            borderRadius="$3"
            paddingHorizontal="$4"
            paddingVertical="$3"
          >
            Reset All Data
          </Button>
          <Text fontSize="$3" color="$gray11">
            This will delete all your goals, chat history, and settings
          </Text>
        </YStack>

        {/* App Info */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            App Information
          </Text>
          <View
            backgroundColor="$gray8"
            padding="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text color="$gray11">Version: 1.0.0</Text>
            <Text color="$gray11" marginTop="$2">
              FinCoach - Your AI Financial Advisor
            </Text>
          </View>
        </YStack>
      </YStack>
    </View>
  );
}
