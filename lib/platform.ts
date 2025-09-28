import { Platform } from "react-native";

export const isExpoGo = () => {
  if (Platform.OS === "web") {
    return false;
  }

  // For React Native/Expo Go
  return Platform.OS === "ios" || Platform.OS === "android";
};

export const isWeb = () => {
  return Platform.OS === "web";
};

