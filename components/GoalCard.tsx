import React from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Progress } from "@tamagui/progress";
import { Goal } from "../types";
import { computePlan, calculateProgress, getDaysLeft } from "../lib/goals";
import { formatCurrency } from "../lib/currency";
import { Modal } from "react-native";
import { useState } from "react";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goal: Goal) => void;
  onMarkComplete: (goal: Goal) => void;
  onAddMoney: (goal: Goal) => void;
}

export default function GoalCard({
  goal,
  onEdit,
  onDelete,
  onMarkComplete,
  onAddMoney,
}: GoalCardProps) {
  const [showSimulate, setShowSimulate] = useState(false);
  const [incomeAdj, setIncomeAdj] = useState(0);
  const [spendAdj, setSpendAdj] = useState(0);
  const plan = computePlan(goal);
  const progress = calculateProgress(goal);
  const daysLeft = getDaysLeft(goal);

  const isCompleted = goal.isCompleted || progress >= 100;
  const hasStreak = goal.currentAmount > 0 && !isCompleted;

  const progressColor = isCompleted
    ? "$green9"
    : progress >= 66
    ? "$green9"
    : progress >= 33
    ? "$yellow9"
    : "$red9";

  const handleEdit = () => {
    onEdit(goal);
  };

  const handleDelete = () => {
    onDelete(goal);
  };

  const handleMarkComplete = () => {
    onMarkComplete(goal);
  };

  const handleAddMoney = () => {
    onAddMoney(goal);
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
          <YStack>
            <Text fontSize="$6" fontWeight="bold" color="$color">
              {goal.name}
            </Text>
            <XStack space="$2" marginTop="$1" alignItems="center" flexWrap="wrap">
              <View
                backgroundColor="$primary"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {goal.type?.charAt(0).toUpperCase() + goal.type?.slice(1) ||
                    "Savings"}
                </Text>
              </View>
              <View
                backgroundColor={
                  goal.priority === "high"
                    ? "$red9"
                    : goal.priority === "medium"
                    ? "$yellow9"
                    : "$green9"
                }
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text color="white" fontSize="$2" fontWeight="600">
                  {goal.priority?.charAt(0).toUpperCase() +
                    goal.priority?.slice(1) || "Medium"}
                </Text>
              </View>
              {isCompleted && (
                <View backgroundColor="$green9" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                  <Text color="white" fontSize="$2" fontWeight="700">🏆 Completed</Text>
                </View>
              )}
              {hasStreak && (
                <View backgroundColor="$yellow9" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                  <Text color="#0a0a0a" fontSize="$2" fontWeight="700">🔥 Streak</Text>
                </View>
              )}
            </XStack>
          </YStack>
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
          <Progress value={Math.min(progress, 100)} max={100} backgroundColor="$gray10" height={10} borderRadius={6}>
            <Progress.Indicator backgroundColor={progressColor} />
          </Progress>
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
        <XStack space="$2" justifyContent="flex-end" flexWrap="wrap">
          <Button
            backgroundColor="$green9"
            color="white"
            onPress={handleAddMoney}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
            disabled={goal.isCompleted}
          >
            Add Money
          </Button>
          <Button
            backgroundColor="$primary"
            color="#ffffff"
            onPress={() => setShowSimulate(true)}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize={14}
          >
            Simulate
          </Button>
          <Button
            variant="outlined"
            borderColor="$primary"
            color="$primary"
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
              backgroundColor="$yellow9"
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

      {/* Simulate Modal */}
      <Modal
        visible={showSimulate}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSimulate(false)}
      >
        <View flex={1} backgroundColor="$background" style={{ padding: 16 }}>
          <YStack space="$4" flex={1}>
            <Text fontSize="$7" fontWeight="bold" color="$color">
              What-If Simulation
            </Text>
            <Text color="$gray11">
              Adjust your monthly income/spending deltas to preview outcomes.
            </Text>
            <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
              <Text color="$color" marginBottom="$2">Income Adjustment (SAR/mo)</Text>
              <Text color="$gray11">{incomeAdj.toFixed(0)}</Text>
            </View>
            <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
              <Text color="$color" marginBottom="$2">Spending Adjustment (SAR/mo)</Text>
              <Text color="$gray11">{spendAdj.toFixed(0)}</Text>
            </View>
            <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
              <Text color="$color" fontWeight="700" marginBottom="$2">Projected Pace</Text>
              <Text color="$color">
                {"~"}
                {formatCurrency(Math.max(0, (plan.perMonth + incomeAdj - spendAdj)))}
                {" per month"}
              </Text>
            </View>
            <XStack space="$3" marginTop="auto" justifyContent="flex-end">
              <Button variant="outlined" borderColor="$gray8" color="$gray11" onPress={() => setShowSimulate(false)}>
                Close
              </Button>
            </XStack>
          </YStack>
        </View>
      </Modal>
    </View>
  );
}
