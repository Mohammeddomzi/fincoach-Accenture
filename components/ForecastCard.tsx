import React from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";

interface ForecastCardProps {
  title: string;
  amountLabel: string;
  timeframeLabel: string;
  highlightColor?: string;
}

export default function ForecastCard({
  title,
  amountLabel,
  timeframeLabel,
  highlightColor = "$primary",
}: ForecastCardProps) {
  return (
    <View backgroundColor="$gray8" padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
      <YStack space="$2">
        <Text color="$color" fontSize="$5" fontWeight="700">{title}</Text>
        <XStack alignItems="baseline" gap={8}>
          <Text color={highlightColor} fontSize="$7" fontWeight="800">{amountLabel}</Text>
          <Text color="$gray11" fontSize="$3">{timeframeLabel}</Text>
        </XStack>
      </YStack>
    </View>
  );
}


