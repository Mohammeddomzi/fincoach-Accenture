import React, { useState, useEffect } from 'react';
import { Alert, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text } from '@tamagui/core';
import { YStack, XStack } from '@tamagui/stacks';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { Select } from '@tamagui/select';
import { Progress } from '@tamagui/progress';
import { useAppStore } from '../../src/state/useAppStore';
import { Goal, GoalType, Priority } from '../../src/types/finance';
import { generateForecast, formatCurrency } from '../../src/lib/forecast';
import Header from '../../src/components/ui/Header';
import Card from '../../src/components/ui/Card';
import GlowButton from '../../src/components/ui/GlowButton';
import WhatIfModal from '../../components/WhatIfModal';

const GOAL_TYPES: { label: string; value: GoalType }[] = [
  { label: 'Savings', value: 'savings' },
  { label: 'Debt', value: 'debt' },
  { label: 'Investment', value: 'investment' },
  { label: 'Emergency', value: 'emergency' },
  { label: 'Purchase', value: 'purchase' },
];

const PRIORITIES: { label: string; value: Priority }[] = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' },
];

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { goals, updateGoal, removeGoal, bumpPoints } = useAppStore();
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'savings' as GoalType,
    priority: 'medium' as Priority,
    targetAmount: 0,
    currentAmount: 0,
    monthlyContribution: 0,
    deadline: '',
    description: '',
  });
  const [showWhatIf, setShowWhatIf] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const foundGoal = goals.find(g => g.id === id);
      if (foundGoal) {
        setGoal(foundGoal);
        setFormData({
          name: foundGoal.name,
          type: foundGoal.type,
          priority: foundGoal.priority,
          targetAmount: foundGoal.targetAmount,
          currentAmount: foundGoal.currentAmount,
          monthlyContribution: foundGoal.monthlyContribution,
          deadline: foundGoal.deadline,
          description: foundGoal.description || '',
        });
      } else {
        Alert.alert('Error', 'Goal not found');
        router.back();
      }
    }
  }, [id, goals, router]);

  const handleSave = async () => {
    if (!goal) return;
    
    setLoading(true);
    try {
      updateGoal(goal.id, formData);
      Alert.alert('Success', 'Goal updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (!goal) return;
    
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            removeGoal(goal.id);
            Alert.alert('Success', 'Goal deleted successfully');
            router.back();
          },
        },
      ]
    );
  };

  const handleMarkReached = () => {
    if (!goal) return;
    
    Alert.alert(
      'Mark as Reached',
      'This will set the current amount to the target amount and award 250 points.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Reached',
          onPress: () => {
            updateGoal(goal.id, {
              currentAmount: goal.targetAmount,
              isCompleted: true,
            });
            bumpPoints(250);
            Alert.alert('Success', 'Goal marked as reached! +250 points awarded');
            router.back();
          },
        },
      ]
    );
  };

  const handleQuickAdd = (amount: number) => {
    if (!goal) return;
    
    const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    updateGoal(goal.id, { currentAmount: newAmount });
    
    if (newAmount >= goal.targetAmount) {
      updateGoal(goal.id, { isCompleted: true });
      bumpPoints(250);
      Alert.alert('Success', 'Goal completed! +250 points awarded');
    }
  };

  if (!goal) {
    return (
      <View flex={1} backgroundColor="$background">
        <Header />
        <View flex={1} justifyContent="center" alignItems="center">
          <Text color="$textDim">Loading...</Text>
        </View>
      </View>
    );
  }

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = progress >= 100;
  const forecast = generateForecast(goal.currentAmount, goal.monthlyContribution, goal.targetAmount, goal.deadline);

  return (
    <View flex={1} backgroundColor="$background">
      <Header />
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          {/* Progress Card */}
          <Card>
            <YStack space="$3">
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$5" fontWeight="600" color="$color">
                  {goal.name}
                </Text>
                {isCompleted && (
                  <View backgroundColor="$success" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                    <Text fontSize="$2" fontWeight="600" color="$color">🎉 Goal reached</Text>
                  </View>
                )}
              </XStack>
              
              <YStack space="$2">
                <XStack justifyContent="space-between">
                  <Text fontSize="$3" color="$textDim">Progress</Text>
                  <Text fontSize="$3" fontWeight="500" color="$color">
                    {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                  </Text>
                </XStack>
                
                <Progress value={progress} backgroundColor="$gray8" height={8} borderRadius="$2">
                  <Progress.Indicator 
                    backgroundColor={isCompleted ? "$success" : "$primary"} 
                    borderRadius="$2"
                  />
                </Progress>
                
                <Text fontSize="$2" color="$textDim" textAlign="center">
                  {progress.toFixed(1)}% complete
                </Text>
              </YStack>
            </YStack>
          </Card>

          {/* Form Fields */}
          <Card>
            <YStack space="$4">
              <Text fontSize="$5" fontWeight="600" color="$color">Edit Goal</Text>
              
              {/* Goal Name */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="500" color="$color">Goal Name</Text>
                <Input
                  value={formData.name}
                  onChangeText={(text: any) => setFormData({ ...formData, name: text })}
                  placeholder="Enter goal name"
                  backgroundColor="$panel"
                  borderColor="$borderColor"
                  color="$color"
                />
              </YStack>

              {/* Goal Type and Priority */}
              <XStack space="$3">
                <YStack flex={1} space="$2">
                  <Text fontSize="$4" fontWeight="500" color="$color">Type</Text>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as GoalType })}
                  >
                    <Select.Trigger backgroundColor="$panel" borderColor="$borderColor">
                      <Select.Value placeholder="Select type" />
                    </Select.Trigger>
                    <Select.Content>
                      {GOAL_TYPES.map((type) => (
                        <Select.Item key={type.value} index={0} value={type.value}>
                          <Select.ItemText>{type.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </YStack>

                <YStack flex={1} space="$2">
                  <Text fontSize="$4" fontWeight="500" color="$color">Priority</Text>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value as Priority })}
                  >
                    <Select.Trigger backgroundColor="$panel" borderColor="$borderColor">
                      <Select.Value placeholder="Select priority" />
                    </Select.Trigger>
                    <Select.Content>
                      {PRIORITIES.map((priority) => (
                        <Select.Item key={priority.value} index={0} value={priority.value}>
                          <Select.ItemText>{priority.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </YStack>
              </XStack>

              {/* Amounts */}
              <YStack space="$3">
                <YStack space="$2">
                  <Text fontSize="$4" fontWeight="500" color="$color">Target Amount</Text>
                  <Input
                    value={formData.targetAmount.toString()}
                    onChangeText={(text: any) => setFormData({ ...formData, targetAmount: parseFloat(text) || 0 })}
                    placeholder="0"
                    keyboardType="numeric"
                    backgroundColor="$panel"
                    borderColor="$borderColor"
                    color="$color"
                  />
                </YStack>

                <YStack space="$2">
                  <Text fontSize="$4" fontWeight="500" color="$color">Current Amount</Text>
                  <Input
                    value={formData.currentAmount.toString()}
                    onChangeText={(text: any) => setFormData({ ...formData, currentAmount: parseFloat(text) || 0 })}
                    placeholder="0"
                    keyboardType="numeric"
                    backgroundColor="$panel"
                    borderColor="$borderColor"
                    color="$color"
                  />
                </YStack>

                <YStack space="$2">
                  <Text fontSize="$4" fontWeight="500" color="$color">Monthly Contribution</Text>
                  <Input
                    value={formData.monthlyContribution.toString()}
                    onChangeText={(text: any) => setFormData({ ...formData, monthlyContribution: parseFloat(text) || 0 })}
                    placeholder="0"
                    keyboardType="numeric"
                    backgroundColor="$panel"
                    borderColor="$borderColor"
                    color="$color"
                  />
                </YStack>
              </YStack>

              {/* Deadline */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="500" color="$color">Deadline</Text>
                <Input
                  value={formData.deadline}
                  onChangeText={(text: any) => setFormData({ ...formData, deadline: text })}
                  placeholder="YYYY-MM-DD"
                  backgroundColor="$panel"
                  borderColor="$borderColor"
                  color="$color"
                />
              </YStack>

              {/* Description */}
              <YStack space="$2">
                <Text fontSize="$4" fontWeight="500" color="$color">Description (Optional)</Text>
                <Input
                  value={formData.description}
                  onChangeText={(text: any) => setFormData({ ...formData, description: text })}
                  placeholder="Add a description..."
                  backgroundColor="$panel"
                  borderColor="$borderColor"
                  color="$color"
                  multiline
                  numberOfLines={3}
                />
              </YStack>
            </YStack>
          </Card>

          {/* Forecast Card */}
          <Card>
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="600" color="$color">Forecast</Text>
              <Text fontSize="$4" color="$textDim">
                {forecast.isAchievable
                  ? `If you contribute ${formatCurrency(goal.monthlyContribution)}/mo, you'll reach your goal in ${forecast.monthsToTarget} months.`
                  : `To reach your goal on time, you'll need to contribute ${formatCurrency(forecast.monthlyNeeded)}/mo.`
                }
              </Text>
            </YStack>
          </Card>

          {/* Quick Actions */}
          <Card>
            <YStack space="$3">
              <Text fontSize="$5" fontWeight="600" color="$color">Quick Actions</Text>
              <XStack space="$2" flexWrap="wrap">
                <Button
                  backgroundColor="$accent"
                  color="$color"
                  onPress={() => handleQuickAdd(100)}
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  disabled={isCompleted}
                >
                  +100 SAR
                </Button>
                <Button
                  backgroundColor="$secondary"
                  color="$color"
                  onPress={() => handleQuickAdd(500)}
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  disabled={isCompleted}
                >
                  +500 SAR
                </Button>
                <Button
                  backgroundColor="$primary"
                  color="$color"
                  onPress={() => setShowWhatIf(true)}
                  borderRadius="$3"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                >
                  What-If
                </Button>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>

      {/* Action Buttons */}
      <View 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        backgroundColor="$background" 
        padding="$4"
        borderTopWidth={1}
        borderTopColor="$borderColor"
      >
        <YStack space="$3">
          <XStack space="$2">
            <Button
              backgroundColor="$primary"
              color="$color"
              onPress={handleSave}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
              flex={1}
              disabled={loading}
            >
              Save Changes
            </Button>
            <Button
              backgroundColor="$warn"
              color="$color"
              onPress={handleMarkReached}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
              flex={1}
              disabled={isCompleted}
            >
              Mark as Reached
            </Button>
          </XStack>
          <Button
            backgroundColor="$danger"
            color="$color"
            onPress={handleDelete}
            borderRadius="$3"
            paddingHorizontal="$4"
            paddingVertical="$3"
          >
            Delete Goal
          </Button>
        </YStack>
      </View>

      {/* What-If Modal */}
      {showWhatIf && (
        <WhatIfModal
          visible={showWhatIf}
          onClose={() => setShowWhatIf(false)}
          targetAmount={goal.targetAmount}
          monthlyContribution={goal.monthlyContribution}
          onApply={(newContribution) => {
            setFormData({ ...formData, monthlyContribution: newContribution });
            setShowWhatIf(false);
          }}
        />
      )}
    </View>
  );
}
