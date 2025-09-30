import React, { useState } from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import ChatView from "../../components/ChatView";
import Header from "../../src/components/ui/Header";
import Card from "../../src/components/ui/Card";
import GlowButton from "../../src/components/ui/GlowButton";
import { Animated } from "react-native";

export default function AdvisorScreen() {
  const [showIntro, setShowIntro] = useState(true);

  const handleAskCoach = () => setShowIntro(false);

  return (
    <View flex={1} backgroundColor="$background">
      <Header />
      {showIntro ? (
        <YStack flex={1} paddingHorizontal={16} paddingTop={12} space="$3">
          <Card>
            <Text fontSize="$7" fontWeight="800" color="$color" marginBottom="$2">Welcome!</Text>
            <Text color="$textDim" marginBottom="$3">What would you like to do today?</Text>
            <XStack gap={10} flexWrap="wrap">
              <GlowButton onPress={handleAskCoach}>Ask Coach</GlowButton>
              <GlowButton onPress={() => setShowIntro(false)}>Set Goal</GlowButton>
              <GlowButton onPress={() => setShowIntro(false)}>Upload CSV</GlowButton>
            </XStack>
          </Card>
          <Card>
            <Text fontSize="$6" fontWeight="700" color="$color" marginBottom="$2">AI Forecast</Text>
            <Text color="$textDim">
              If you continue at your current savings pace, you could reach SAR 2,000 in about 6 months.
            </Text>
          </Card>
        </YStack>
      ) : (
        <ChatView />
      )}
    </View>
  );
}
