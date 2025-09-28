import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Goal } from "../../types";
import { saveGoals, loadGoals } from "../../lib/ai";
import { formatCurrency } from "../../lib/currency";
import GoalCard from "../../components/GoalCard";

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  useEffect(() => {
    loadGoalsData();
  }, []);

  const loadGoalsData = async () => {
    const loadedGoals = await loadGoals();
    setGoals(loadedGoals);
  };

  const handleAddGoal = () => {
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
    });
    setEditingGoal(null);
    setShowAddModal(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline.toISOString().split("T")[0],
    });
    setEditingGoal(goal);
    setShowAddModal(true);
  };

  const handleSaveGoal = () => {
    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const targetAmount = parseFloat(formData.targetAmount);
    const currentAmount = parseFloat(formData.currentAmount) || 0;
    const deadline = new Date(formData.deadline);

    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert("Error", "Please enter a valid target amount");
      return;
    }

    if (deadline <= new Date()) {
      Alert.alert("Error", "Deadline must be in the future");
      return;
    }

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name,
      targetAmount,
      currentAmount,
      deadline,
      createdAt: editingGoal?.createdAt || new Date(),
      isCompleted: editingGoal?.isCompleted || false,
    };

    if (editingGoal) {
      setGoals((prev) =>
        prev.map((g) => (g.id === editingGoal.id ? goalData : g))
      );
    } else {
      setGoals((prev) => [...prev, goalData]);
    }

    saveGoals(goals);
    setShowAddModal(false);
    setFormData({
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: "",
    });
  };

  const handleDeleteGoal = (goal: Goal) => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete "${goal.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setGoals((prev) => prev.filter((g) => g.id !== goal.id));
            saveGoals(goals.filter((g) => g.id !== goal.id));
          },
        },
      ]
    );
  };

  const handleMarkComplete = (goal: Goal) => {
    Alert.alert(
      "Mark Complete",
      `Are you sure you want to mark "${goal.name}" as complete?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            const updatedGoal = { ...goal, isCompleted: true };
            setGoals((prev) =>
              prev.map((g) => (g.id === goal.id ? updatedGoal : g))
            );
            saveGoals(goals.map((g) => (g.id === goal.id ? updatedGoal : g)));
          },
        },
      ]
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">
              Financial Goals
            </Text>
            <Button
              backgroundColor="$blue9"
              color="white"
              onPress={handleAddGoal}
              borderRadius="$3"
              paddingHorizontal="$4"
              paddingVertical="$3"
            >
              Add Goal
            </Button>
          </XStack>

          {goals.length === 0 ? (
            <View
              backgroundColor="$gray8"
              padding="$6"
              borderRadius="$4"
              alignItems="center"
            >
              <Text
                fontSize="$5"
                color="$gray11"
                textAlign="center"
                marginBottom="$3"
              >
                No goals yet
              </Text>
              <Text fontSize="$4" color="$gray11" textAlign="center">
                Start by adding your first financial goal
              </Text>
            </View>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onMarkComplete={handleMarkComplete}
              />
            ))
          )}
        </YStack>
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View flex={1} backgroundColor="$background" style={{ padding: 16 }}>
            <YStack space="$4" flex={1}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$7" fontWeight="bold" color="$color">
                  {editingGoal ? "Edit Goal" : "Add New Goal"}
                </Text>
                <Button
                  variant="outlined"
                  borderColor="$gray8"
                  color="$gray11"
                  onPress={() => setShowAddModal(false)}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  Cancel
                </Button>
              </XStack>

              <YStack space="$3">
                <YStack space="$2">
                  <Text color="$color">Goal Name *</Text>
                  <TextInput
                    value={formData.name}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, name: text }))
                    }
                    placeholder="e.g., Emergency Fund"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  />
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Target Amount *</Text>
                  <TextInput
                    value={formData.targetAmount}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, targetAmount: text }))
                    }
                    placeholder="10000"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  />
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Current Amount</Text>
                  <TextInput
                    value={formData.currentAmount}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, currentAmount: text }))
                    }
                    placeholder="0"
                    keyboardType="numeric"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  />
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Deadline *</Text>
                  <TextInput
                    value={formData.deadline}
                    onChangeText={(text) =>
                      setFormData((prev) => ({ ...prev, deadline: text }))
                    }
                    placeholder="YYYY-MM-DD"
                    style={{
                      backgroundColor: "#1a1a1a",
                      color: "white",
                      padding: 12,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#333",
                    }}
                  />
                </YStack>
              </YStack>

              <Button
                backgroundColor="$blue9"
                color="white"
                onPress={handleSaveGoal}
                marginTop="auto"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
              >
                {editingGoal ? "Update Goal" : "Add Goal"}
              </Button>
            </YStack>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
