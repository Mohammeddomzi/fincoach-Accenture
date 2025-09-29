import React from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Ionicons } from "@expo/vector-icons";

interface IntroCardsProps {
  onSetGoal?: () => void;
  onUploadData?: () => void;
  onAskCoach?: () => void;
}

export default function IntroCards({ onSetGoal, onUploadData, onAskCoach }: IntroCardsProps) {
  return (
    <YStack gap="$3" paddingHorizontal="$3" paddingTop="$3">
      <Card
        title="Set a goal"
        description="Define a savings or investment goal to get tailored guidance."
        icon="flag-outline"
        onPress={onSetGoal}
      />
      <Card
        title="Upload data"
        description="Import a CSV of transactions to analyze spending patterns."
        icon="cloud-upload-outline"
        onPress={onUploadData}
      />
      <Card
        title="Ask your coach"
        description="Start a conversation to get insights and next steps."
        icon="chatbubbles-outline"
        onPress={onAskCoach}
      />
    </YStack>
  );
}

function Card({ title, description, icon, onPress }: { title: string; description: string; icon: any; onPress?: () => void }) {
  return (
    <XStack backgroundColor="#111315" borderRadius={12} padding={16} borderWidth={1} borderColor="#2b2f33" alignItems="center" gap={12}>
      <View backgroundColor="$primary" borderRadius={8} width={40} height={40} alignItems="center" justifyContent="center">
        <Ionicons name={icon} size={22} color="#ffffff" />
      </View>
      <YStack flex={1} gap={4}>
        <Text fontSize={16} color="#ffffff" fontWeight="600">{title}</Text>
        <Text fontSize={13} color="$gray11">{description}</Text>
      </YStack>
      <Button onPress={onPress} backgroundColor="$primary" color="#ffffff">
        Open
      </Button>
    </XStack>
  );
}


