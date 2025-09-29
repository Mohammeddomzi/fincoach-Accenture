import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Appearance } from "react-native";
import { loadSettings } from "../../lib/ai";
import HeaderLogo from "../../components/HeaderLogo";

export default function TabLayout() {
  const [themeName, setThemeName] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const init = async () => {
      const settings = await loadSettings();
      const systemScheme = Appearance.getColorScheme() || "dark";
      const next = settings.theme === "system" ? (systemScheme as "dark" | "light") : (settings.theme as "dark" | "light");
      setThemeName(next);
    };
    init();

    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      loadSettings().then((s) => {
        if (s.theme === "system") {
          setThemeName((colorScheme || "dark") as "dark" | "light");
        }
      });
    });
    return () => sub.remove();
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#4f7f8c",
        tabBarInactiveTintColor: "#7ca2b1",
        tabBarStyle: {
          backgroundColor: themeName === "dark" ? "#0a0a0a" : "#ffffff",
          borderTopColor: themeName === "dark" ? "#2b2f33" : "#e5e7eb",
        },
        headerStyle: {
          backgroundColor: themeName === "dark" ? "#0a0a0a" : "#ffffff",
        },
        headerTintColor: themeName === "dark" ? "#b9dae9" : "#2d5b67",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitle: () => <HeaderLogo />,
      }}
    >
      <Tabs.Screen
        name="advisor"
        options={{
          title: "Advisor",
          tabBarLabel: "Advisor",
          tabBarAccessibilityLabel: "Advisor",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarLabel: "Goals",
          tabBarAccessibilityLabel: "Goals",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarLabel: "Analysis",
          tabBarAccessibilityLabel: "Analysis",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Settings",
          tabBarAccessibilityLabel: "Settings",
        	  tabBarIcon: ({ color, size }) => (
            <Ionicons name="cog-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarLabel: "Community",
          tabBarAccessibilityLabel: "Community",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
