import React from 'react';
import { View, Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { Progress } from '@tamagui/progress';
import { Goal, GoalType, Priority } from '../../types/finance';
import { formatCurrency } from '../../lib/forecast';

interface ProCardProps {
  goal: Goal;
  onEdit: () => void;
  onWhatIf: () => void;
  onQuickAdd: (amount: number) => void;
}

const getTypeColor = (type: GoalType): string => {
  switch (type) {
    case 'savings': return '$success';
    case 'debt': return '$danger';
    case 'investment': return '$primary';
    case 'emergency': return '$warn';
    case 'purchase': return '$accent';
    default: return '$gray8';
  }
};

const getPriorityColor = (priority: Priority): string => {
  switch (priority) {
    case 'low': return '$gray8';
    case 'medium': return '$primary';
    case 'high': return '$warn';
    case 'critical': return '$danger';
    default: return '$gray8';
  }
};

const getDaysUntilDeadline = (deadline: string): number => {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffTime = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default function ProCard({ goal, onEdit, onWhatIf, onQuickAdd }: ProCardProps) {
  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = progress >= 100;
  const daysLeft = getDaysUntilDeadline(goal.deadline);
  const isOverdue = daysLeft < 0 && !isCompleted;

  return (
    <View
      backgroundColor="$panel"
      borderRadius="$4"
      padding="$4"
      borderWidth={1}
      borderColor="$borderColor"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
    >
      <YStack space="$3">
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack flex={1} space="$1">
            <Text fontSize="$5" fontWeight="600" color="$color" numberOfLines={2}>
              {goal.name}
            </Text>
            <XStack space="$2" alignItems="center">
              <View
                backgroundColor={getTypeColor(goal.type)}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" fontWeight="500" color="$color">
                  {goal.type.charAt(0).toUpperCase() + goal.type.slice(1)}
                </Text>
              </View>
              <View
                backgroundColor={getPriorityColor(goal.priority)}
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" fontWeight="500" color="$color">
                  {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
                </Text>
              </View>
            </XStack>
          </YStack>
          
          {isCompleted && (
            <View backgroundColor="$success" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
              <Text fontSize="$2" fontWeight="600" color="$color">🎉</Text>
            </View>
          )}
        </XStack>

        {/* Progress */}
        <YStack space="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$3" color="$textDim">Progress</Text>
            <Text fontSize="$3" fontWeight="500" color="$color">
              {progress.toFixed(1)}%
            </Text>
          </XStack>
          
          <Progress value={progress} backgroundColor="$gray8" height={6} borderRadius="$2">
            <Progress.Indicator 
              backgroundColor={isCompleted ? "$success" : isOverdue ? "$danger" : "$primary"} 
              borderRadius="$2"
            />
          </Progress>
          
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$2" color="$textDim">
              {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
            </Text>
            <Text fontSize="$2" color={isOverdue ? "$danger" : "$textDim"}>
              {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
            </Text>
          </XStack>
        </YStack>

        {/* Monthly Contribution */}
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$textDim">Monthly</Text>
          <Text fontSize="$3" fontWeight="500" color="$color">
            {formatCurrency(goal.monthlyContribution)}
          </Text>
        </XStack>

        {/* Actions */}
        <XStack space="$2" justifyContent="space-between">
          <Button
            backgroundColor="$accent"
            color="$color"
            onPress={() => onQuickAdd(100)}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize="$2"
            flex={1}
            disabled={isCompleted}
          >
            +100 SAR
          </Button>
          
          <Button
            backgroundColor="$secondary"
            color="$color"
            onPress={onWhatIf}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize="$2"
            flex={1}
          >
            What-If
          </Button>
          
          <Button
            backgroundColor="$primary"
            color="$color"
            onPress={onEdit}
            borderRadius="$2"
            paddingHorizontal="$3"
            paddingVertical="$2"
            fontSize="$2"
            flex={1}
          >
            Edit
          </Button>
        </XStack>
      </YStack>
    </View>
  );
}
