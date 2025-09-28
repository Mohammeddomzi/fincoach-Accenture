import React from "react";
import { View, Text } from "@tamagui/core";
import ChatView from "../../components/ChatView";

export default function AdvisorScreen() {
  return (
    <View flex={1} backgroundColor="$background">
      <ChatView />
    </View>
  );
}
