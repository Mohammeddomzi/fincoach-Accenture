import { useState, useEffect } from "react";
import { Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return unsubscribe;
  }, []);

  return isOnline;
};

export const isOnline = (): Promise<boolean> => {
  return NetInfo.fetch().then((state) => state.isConnected ?? false);
};
