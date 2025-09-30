import React, { useState, useEffect } from "react";
import { Alert, Switch, TextInput, ScrollView } from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Select } from "@tamagui/select";
import { saveSettings, loadSettings } from "../../lib/ai";
import { SUPPORTED_CURRENCIES } from "../../lib/currency";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppTheme } from "../../lib/useAppTheme";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    currency: "SAR",
    theme: "dark" as "dark" | "light" | "system",
    locale: "en-SA",
    companyMode: false,
    guestMode: false,
    csvExport: true,
    whiteLabelMode: false,
    companyBrand: {
      name: "",
      primary: "#2d5b67",
      secondary: "#4f7f8c",
      accent: "#b9dae9",
      logoPath: "",
    },
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

  const handleCompanyModeToggle = (companyMode: boolean) => {
    const newSettings = { ...settings, companyMode };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggle = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
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
                theme: "dark" as "dark" | "light" | "system",
                locale: "en-SA",
                companyMode: false,
                guestMode: false,
                csvExport: true,
                whiteLabelMode: false,
                companyBrand: {
                  name: "",
                  primary: "#2d5b67",
                  secondary: "#4f7f8c",
                  accent: "#b9dae9",
                  logoPath: "",
                },
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
    <View flex={1} backgroundColor="$background">
      <Header />
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          {/* Privacy Trust Badge */}
          <Card>
            <XStack alignItems="center" justifyContent="center" space="$2">
              <Text fontSize="$4" color="$success">🔐</Text>
              <Text fontSize="$4" fontWeight="600" color="$success">Privacy Protected</Text>
            </XStack>
          </Card>

          {/* Appearance */}
          <YStack space="$3">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Appearance
            </Text>
            <AppearanceButtons />
          </YStack>

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

          {/* Privacy & Data */}
          <YStack space="$3">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Privacy & Data
            </Text>
            <YStack space="$2">
              <ToggleRow
                label="Guest Mode"
                description="Use app without saving personal data"
                value={settings.guestMode}
                onValueChange={(value) => handleToggle('guestMode', value)}
              />
              <ToggleRow
                label="CSV Export"
                description="Allow exporting financial data"
                value={settings.csvExport}
                onValueChange={(value) => handleToggle('csvExport', value)}
              />
            </YStack>
          </YStack>

          {/* Company Mode */}
          <YStack space="$3">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Company Mode
            </Text>
            <YStack space="$2">
              <ToggleRow
                label="Company Mode"
                description="Switch branding, enable partner embed & enterprise options"
                value={settings.companyMode}
                onValueChange={(value) => handleToggle('companyMode', value)}
              />
              <ToggleRow
                label="White-Label Mode"
                description="Remove FinCoach branding for custom deployments"
                value={settings.whiteLabelMode}
                onValueChange={(value) => handleToggle('whiteLabelMode', value)}
              />
            </YStack>
          </YStack>

        {/* Partner Embed & APIs (scaffold) */}
        <YStack space="$3">
          <Text fontSize="$5" fontWeight="600" color="$color">
            Partner Integration (Preview)
          </Text>
          <View backgroundColor="$gray8" padding="$3" borderRadius="$3" borderWidth={1} borderColor="$borderColor">
            <Text color="$gray11">
              - Chatbot embed URL (iFrame/WebView)
              {"\n"}- Product APIs: loans, savings, insurance, investments
              {"\n"}- Aggregated analytics for retention and product improvement
            </Text>
          </View>
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
      </ScrollView>
    </View>
  );
}

function AppearanceButtons() {
  const { mode, setMode } = useAppTheme();
  const options: Array<{ label: string; value: 'system' | 'dark' | 'light' }> = [
    { label: 'System', value: 'system' },
    { label: 'Dark', value: 'dark' },
    { label: 'Light', value: 'light' },
  ];
  return (
    <XStack space="$3">
      {options.map((o) => (
        <Button
          key={o.value}
          backgroundColor={mode === o.value ? "$primary" : "$gray8"}
          color={mode === o.value ? "#ffffff" : "$color"}
          onPress={() => setMode(o.value)}
          borderRadius="$3"
          paddingHorizontal="$4"
          paddingVertical="$3"
          flex={1}
        >
          {o.label}
        </Button>
      ))}
    </XStack>
  );
}

function ToggleRow({ 
  label, 
  description, 
  value, 
  onValueChange 
}: { 
  label: string; 
  description: string; 
  value: boolean; 
  onValueChange: (value: boolean) => void; 
}) {
  return (
    <XStack alignItems="center" justifyContent="space-between" padding="$3" backgroundColor="$gray8" borderRadius="$3" borderWidth={1} borderColor="$borderColor">
      <YStack flex={1}>
        <Text fontSize="$4" fontWeight="500" color="$color">{label}</Text>
        <Text fontSize="$3" color="$textDim">{description}</Text>
      </YStack>
      <Switch value={value} onValueChange={onValueChange} />
    </XStack>
  );
}
