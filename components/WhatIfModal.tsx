import React, { useState } from "react";
import { Modal, Alert } from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import Slider from "@react-native-community/slider";
import { Goal } from "../types";
import { formatCurrency } from "../lib/currency";
import Card from "../src/components/ui/Card";

interface WhatIfModalProps {
  visible: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function WhatIfModal({ visible, onClose, goal }: WhatIfModalProps) {
  const [incomeAdjustment, setIncomeAdjustment] = useState(0);
  const [spendingAdjustment, setSpendingAdjustment] = useState(0);
  const [monthsToSimulate, setMonthsToSimulate] = useState(6);

  if (!goal) return null;

  // Calculate current monthly pace
  const now = new Date();
  const created = new Date(goal.createdAt);
  const daysSince = Math.max(1, Math.ceil((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
  const currentMonthlyPace = (goal.currentAmount / daysSince) * 30;

  // Calculate projected values
  const adjustedMonthlyPace = currentMonthlyPace + incomeAdjustment - spendingAdjustment;
  const projectedSavings = adjustedMonthlyPace * monthsToSimulate;
  const remainingAmount = goal.targetAmount - goal.currentAmount;
  const monthsToTarget = remainingAmount > 0 && adjustedMonthlyPace > 0 
    ? Math.ceil(remainingAmount / adjustedMonthlyPace) 
    : 0;

  const handleReset = () => {
    setIncomeAdjustment(0);
    setSpendingAdjustment(0);
    setMonthsToSimulate(6);
  };

  const handleApply = () => {
    Alert.alert(
      "Simulation Complete",
      `Based on your adjustments:\n• Monthly pace: ${formatCurrency(adjustedMonthlyPace)}\n• ${monthsToSimulate}-month savings: ${formatCurrency(projectedSavings)}\n• Time to target: ${monthsToTarget} months`,
      [{ text: "OK", onPress: onClose }]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View flex={1} backgroundColor="$background" style={{ padding: 16 }}>
        <YStack space="$4" flex={1}>
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$7" fontWeight="bold" color="$color">
              What-If Simulation
            </Text>
            <Button
              variant="outlined"
              borderColor="$borderColor"
              color="$textDim"
              onPress={onClose}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              Close
            </Button>
          </XStack>

          <Card>
            <YStack space="$3">
              <Text fontSize="$6" fontWeight="700" color="$color">{goal.name}</Text>
              <XStack justifyContent="space-between">
                <Text color="$textDim">Current Progress:</Text>
                <Text color="$color" fontWeight="600">
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color="$textDim">Current Monthly Pace:</Text>
                <Text color="$color" fontWeight="600">
                  {formatCurrency(currentMonthlyPace)}
                </Text>
              </XStack>
            </YStack>
          </Card>

          <YStack space="$4">
            <Text fontSize="$5" fontWeight="600" color="$color">
              Adjustments
            </Text>

            {/* Income Adjustment */}
            <Card>
              <YStack space="$3">
                <Text fontSize="$4" fontWeight="600" color="$color">
                  Income Adjustment (SAR/month)
                </Text>
                <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
                  <Text
                    color="$color"
                    fontSize="$5"
                    fontWeight="600"
                    textAlign="center"
                    marginBottom="$2"
                  >
                    {incomeAdjustment >= 0 ? "+" : ""}{formatCurrency(incomeAdjustment)}
                  </Text>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={-5000}
                    maximumValue={10000}
                    step={500}
                    value={incomeAdjustment}
                    onValueChange={setIncomeAdjustment}
                    minimumTrackTintColor="#4f7f8c"
                    maximumTrackTintColor="#2b2f33"
                  />
                  <XStack justifyContent="space-between" marginTop="$2">
                    <Text color="$textDim" fontSize="$3">-{formatCurrency(5000)}</Text>
                    <Text color="$textDim" fontSize="$3">+{formatCurrency(10000)}</Text>
                  </XStack>
                </View>
              </YStack>
            </Card>

            {/* Spending Adjustment */}
            <Card>
              <YStack space="$3">
                <Text fontSize="$4" fontWeight="600" color="$color">
                  Spending Adjustment (SAR/month)
                </Text>
                <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
                  <Text
                    color="$color"
                    fontSize="$5"
                    fontWeight="600"
                    textAlign="center"
                    marginBottom="$2"
                  >
                    {spendingAdjustment >= 0 ? "+" : ""}{formatCurrency(spendingAdjustment)}
                  </Text>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={-3000}
                    maximumValue={5000}
                    step={200}
                    value={spendingAdjustment}
                    onValueChange={setSpendingAdjustment}
                    minimumTrackTintColor="#4f7f8c"
                    maximumTrackTintColor="#2b2f33"
                  />
                  <XStack justifyContent="space-between" marginTop="$2">
                    <Text color="$textDim" fontSize="$3">-{formatCurrency(3000)}</Text>
                    <Text color="$textDim" fontSize="$3">+{formatCurrency(5000)}</Text>
                  </XStack>
                </View>
              </YStack>
            </Card>

            {/* Months to Simulate */}
            <Card>
              <YStack space="$3">
                <Text fontSize="$4" fontWeight="600" color="$color">
                  Simulation Period (months)
                </Text>
                <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
                  <Text
                    color="$color"
                    fontSize="$5"
                    fontWeight="600"
                    textAlign="center"
                    marginBottom="$2"
                  >
                    {monthsToSimulate} months
                  </Text>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={1}
                    maximumValue={24}
                    step={1}
                    value={monthsToSimulate}
                    onValueChange={setMonthsToSimulate}
                    minimumTrackTintColor="#4f7f8c"
                    maximumTrackTintColor="#2b2f33"
                  />
                  <XStack justifyContent="space-between" marginTop="$2">
                    <Text color="$textDim" fontSize="$3">1 month</Text>
                    <Text color="$textDim" fontSize="$3">24 months</Text>
                  </XStack>
                </View>
              </YStack>
            </Card>
          </YStack>

          {/* Projected Results */}
          <Card>
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="700" color="$color">Projected Results</Text>
              <XStack justifyContent="space-between">
                <Text color="$textDim">New Monthly Pace:</Text>
                <Text color="$primary" fontWeight="600" fontSize="$5">
                  {formatCurrency(adjustedMonthlyPace)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color="$textDim">{monthsToSimulate}-Month Savings:</Text>
                <Text color="$success" fontWeight="600" fontSize="$5">
                  {formatCurrency(projectedSavings)}
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text color="$textDim">Time to Target:</Text>
                <Text color="$accent" fontWeight="600" fontSize="$5">
                  {monthsToTarget > 0 ? `${monthsToTarget} months` : "Target reached!"}
                </Text>
              </XStack>
            </YStack>
          </Card>

          {/* Actions */}
          <XStack space="$3" marginTop="auto">
            <Button
              variant="outlined"
              borderColor="$borderColor"
              color="$textDim"
              onPress={handleReset}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
              flex={1}
            >
              Reset
            </Button>
            <Button
              backgroundColor="$primary"
              color="#ffffff"
              onPress={handleApply}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
              flex={1}
            >
              Apply Simulation
            </Button>
          </XStack>
        </YStack>
      </View>
    </Modal>
  );
}
