import React from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Progress } from "@tamagui/progress";
import { Goal } from "../types";
import { computePlan, calculateProgress, getDaysLeft } from "../lib/goals";
import { formatCurrency } from "../lib/currency";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onMarkComplete: (goal: Goal) => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onMarkComplete,
}: GoalCardProps) {
  const plan = computePlan(goal);
  const progress = calculateProgress(goal);
  const daysLeft = getDaysLeft(goal);

  const handleEdit = () => {
    onEdit(goal);
  };

  const handleDelete = () => {
    onDelete(goal);
  };

  const handleMarkComplete = () => {
    onMarkComplete(goal);
  };

  return (
    <View
      backgroundColor="$gray8"
      padding="$4"
      borderRadius="$4"
      marginBottom="$3"
      borderWidth={1}
      borderColor="$borderColor"
    >
      <YStack space="$3">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            {goal.name}
          </Text>
          <Text fontSize="$3" color="$gray11">
            {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
          </Text>
        </XStack>

        {/* Progress */}
        <YStack space="$2">
          <XStack justifyContent="space-between">
            <Text color="$gray11">
              {formatCurrency(goal.currentAmount)} /{" "}
              {formatCurrency(goal.targetAmount)}
            </Text>
            <Text color="$gray11">{Math.round(progress)}%</Text>
          </XStack>
          <View
            backgroundColor="#333"
            height={8}
            borderRadius={4}
            overflow="hidden"
          >
            <View
              backgroundColor="#007AFF"
              height="100%"
              width={`${Math.min(progress, 100)}%`}
            />
          </View>
        </YStack>

        {/* Plan Details */}
        <YStack space="$2">
          <Text fontSize="$4" fontWeight="600" color="$color">
            Savings Plan
          </Text>
          <XStack justifyContent="space-between">
            <Text color="$gray11">Per day:</Text>
            <Text color="$color">{formatCurrency(plan.perDay)}</Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$gray11">Per week:</Text>
            <Text color="$color">{formatCurrency(plan.perWeek)}</Text>
          </XStack>
          <XStack justifyContent="space-between">
            <Text color="$gray11">Per month:</Text>
            <Text color="$color">{formatCurrency(plan.perMonth)}</Text>
          </XStack>
        </YStack>

        {/* Realism Warning */}
        {!plan.isRealistic && (
          <View backgroundColor="$red9" padding="$3" borderRadius="$3">
            <Text color="white" fontWeight="600" marginBottom="$2">
              ⚠️ This goal may be unrealistic
            </Text>
            {plan.suggestions.map((suggestion, index) => (
              <Text key={index} color="white" fontSize="$3">
                • {suggestion}
              </Text>
            ))}
          </View>
        )}

        {/* Actions */}
        <XStack space="$2" justifyContent="flex-end">
          <Button
            variant="outlined"
            borderColor="$blue9"
            color="$blue9"
            onPress={handleEdit}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
          >
            Edit
          </Button>
          {!goal.isCompleted && (
            <Button
              backgroundColor="$green9"
              color="white"
              onPress={handleMarkComplete}
              borderRadius="$2"
              paddingHorizontal="$3"
              paddingVertical="$2"
              fontSize={14}
            >
              Complete
            </Button>
          )}
          <Button
            backgroundColor="$red9"
            color="white"
            onPress={handleDelete}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
          >
            Delete
          </Button>
        </XStack>
      </YStack>
    </View>
  );
}
