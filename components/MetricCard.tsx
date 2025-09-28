import React from "react";
import { View, Text, Stack } from "@tamagui/core";
import { MetricCard as MetricCardType } from "../types";

interface MetricCardProps {
  metric: MetricCardType;
}

export default function MetricCard({ metric }: MetricCardProps) {
  const getChangeColor = () => {
    switch (metric.changeType) {
      case "positive":
        return "$green9";
      case "negative":
        return "$red9";
      default:
        return "$gray11";
    }
  };

  const getChangeIcon = () => {
    switch (metric.changeType) {
      case "positive":
        return "↗";
      case "negative":
        return "↘";
      default:
        return "";
    }
  };

  return (
    <View
      backgroundColor="$gray8"
      padding="$4"
      borderRadius="$4"
      borderWidth={1}
      borderColor="$borderColor"
      minHeight={120}
    >
      <Stack
        space="$2"
        flex={1}
        justifyContent="space-between"
        flexDirection="column"
      >
        <Text fontSize="$4" fontWeight="600" color="white">
          {metric.title}
        </Text>

        <Text fontSize="$7" fontWeight="bold" color="white">
          {metric.value}
        </Text>

        {metric.change && (
          <Stack alignItems="center" space="$1" flexDirection="row">
            <Text fontSize="$3" color={getChangeColor()}>
              {getChangeIcon()}
            </Text>
            <Text fontSize="$3" color={getChangeColor()}>
              {metric.change}
            </Text>
          </Stack>
        )}
      </Stack>
    </View>
  );
}
