import { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "FinCoach",
  slug: "fincoach",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "dark",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#000000",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
  },
  web: {
    output: "server",
    bundler: "metro",
  },
  plugins: [
    [
      "expo-router",
      {
        origin: "https://your-eas-hosting-domain.com",
      },
    ],
  ],
  extra: {
    router: {
      origin: "https://your-eas-hosting-domain.com",
    },
  },
};

export default config;
