import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "FinCoach",
  slug: "fincoach",
  version: "1.0.0",
  orientation: "portrait",
  // Temporarily disable app icon to avoid failing on an invalid file during dev
  // icon: "./assets/adaptive-icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#0a0a0a",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    // adaptiveIcon: {
    //   foregroundImage: "./assets/adaptive-icon.png",
    //   backgroundColor: "#0a0a0a",
    // },
  },
  web: {
    output: "static",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-router",
      {
        origin: false,
      },
    ],
  ],
};

export default config;
