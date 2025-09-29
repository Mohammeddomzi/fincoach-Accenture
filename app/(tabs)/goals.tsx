import React, { useState, useEffect } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import Slider from "@react-native-community/slider";
import DateTimePicker from "@react-native-community/datetimepicker";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { Goal } from "../../types";
import { saveGoals, loadGoals } from "../../lib/ai";
import ForecastCard from "../../components/ForecastCard";
import { forecastSixMonths } from "../../lib/goals";
import { formatCurrency } from "../../lib/currency";
import GoalCard from "../../components/GoalCard";
import EmptyIllustration from "../../components/EmptyIllustration";

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState(0);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: 10000,
    currentAmount: 0,
    deadline: new Date(),
    type: "savings" as
      | "emergency"
      | "savings"
      | "investment"
      | "debt"
      | "purchase"
      | "other",
    priority: "medium" as "low" | "medium" | "high",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

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
      targetAmount: 10000,
      currentAmount: 0,
      deadline: new Date(),
      type: "savings",
      priority: "medium",
    });
    setEditingGoal(null);
    setShowAddModal(true);
    setShowDatePicker(false); // Ensure date picker is closed
  };

  const handleEditGoal = (goal: Goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      deadline: new Date(goal.deadline),
      type: goal.type || "savings",
      priority: goal.priority || "medium",
    });
    setEditingGoal(goal);
    setShowAddModal(true);
    setShowDatePicker(false); // Ensure date picker is closed
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    console.log("Date picker event:", event.type, selectedDate);
    console.log("Platform:", Platform.OS);

    setShowDatePicker(false);

    if (selectedDate) {
      setFormData((prev) => ({ ...prev, deadline: selectedDate }));
      console.log("Date updated to:", selectedDate);
    }
  };

  const showDatePickerModal = () => {
    console.log("Showing date picker");
    setTempDate(formData.deadline);
    setShowDatePicker(true);
  };

  const confirmDateSelection = () => {
    setFormData((prev) => ({ ...prev, deadline: tempDate }));
    setShowDatePicker(false);
  };

  const cancelDateSelection = () => {
    setShowDatePicker(false);
  };

  const handleSaveGoal = () => {
    console.log("handleSaveGoal called with:", formData);
    console.log("Current date:", new Date());
    console.log("Selected deadline:", formData.deadline);
    console.log("Date comparison:", formData.deadline <= new Date());

    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a goal name");
      return;
    }

    if (formData.targetAmount <= 0) {
      Alert.alert("Error", "Please set a valid target amount");
      return;
    }

    // Allow today's date and future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const deadline = new Date(formData.deadline);
    deadline.setHours(0, 0, 0, 0); // Reset time to start of day

    if (!formData.deadline || deadline < today) {
      Alert.alert("Error", "Please select today's date or a future date");
      return;
    }

    const goalData: Goal = {
      id: editingGoal?.id || Date.now().toString(),
      name: formData.name.trim(),
      targetAmount: formData.targetAmount,
      currentAmount: formData.currentAmount,
      deadline: formData.deadline,
      createdAt: editingGoal?.createdAt || new Date(),
      isCompleted: editingGoal?.isCompleted || false,
      type: formData.type,
      priority: formData.priority,
    };

    console.log("Creating goal:", goalData);

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
      targetAmount: 10000,
      currentAmount: 0,
      deadline: new Date(),
      type: "savings",
      priority: "medium",
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

  const handleAddMoney = (goal: Goal) => {
    setSelectedGoal(goal);
    setAddMoneyAmount(0);
    setShowAddMoneyModal(true);
  };

  const handleSaveAddMoney = () => {
    if (!selectedGoal || addMoneyAmount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    const updatedGoals = goals.map((g) =>
      g.id === selectedGoal.id
        ? { ...g, currentAmount: g.currentAmount + addMoneyAmount }
        : g
    );

    setGoals(updatedGoals);
    saveGoals(updatedGoals);
    setShowAddMoneyModal(false);
    setSelectedGoal(null);
    setAddMoneyAmount(0);

    Alert.alert(
      "Success",
      `Added ${formatCurrency(addMoneyAmount)} to "${selectedGoal.name}"`
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
              <EmptyIllustration type="piggy" />
              <Text
                fontSize="$6"
                color="$color"
                textAlign="center"
                marginTop="$3"
                fontWeight="bold"
              >
                Start your financial journey
              </Text>
              <Text fontSize="$4" color="$gray11" textAlign="center" marginTop="$2">
                Add your first goal to begin tracking progress and momentum.
              </Text>
              <Button
                backgroundColor="$primary"
                color="#ffffff"
                onPress={handleAddGoal}
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                marginTop="$4"
              >
                Add your first goal
              </Button>
            </View>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
                onMarkComplete={handleMarkComplete}
                onAddMoney={handleAddMoney}
              />
            ))
          )}

          {/* Forecasts */}
          {goals.length > 0 && (
            <YStack space="$3">
              <Text fontSize="$6" fontWeight="bold" color="$color">
                Predictive Insights
              </Text>
              {goals.slice(0, 3).map((g) => {
                const f = forecastSixMonths(g);
                return (
                  <ForecastCard
                    key={`forecast-${g.id}`}
                    title={`If you continue at this pace, you’ll save`}
                    amountLabel={`SAR ${Math.round(f.sixMonthSavings).toLocaleString()}`}
                    timeframeLabel={`in 6 months (~SAR ${Math.round(f.pacePerMonth).toLocaleString()}/mo)`}
                  />
                );
              })}
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* Add/Edit Goal Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setShowAddModal(false);
          setShowDatePicker(false); // Close date picker when modal closes
        }}
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
                  onPress={() => {
                    setShowAddModal(false);
                    setShowDatePicker(false); // Close date picker when canceling
                  }}
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
                  <Text color="$color">Goal Type *</Text>
                  <XStack space="$2" flexWrap="wrap">
                    {[
                      "emergency",
                      "savings",
                      "investment",
                      "debt",
                      "purchase",
                      "other",
                    ].map((type) => (
                      <Button
                        key={type}
                        backgroundColor={
                          formData.type === type ? "$blue9" : "$gray8"
                        }
                        color={formData.type === type ? "white" : "$color"}
                        onPress={() =>
                          setFormData((prev) => ({
                            ...prev,
                            type: type as any,
                          }))
                        }
                        borderRadius="$3"
                        paddingHorizontal="$3"
                        paddingVertical="$2"
                        marginBottom="$2"
                        width="30%"
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </Button>
                    ))}
                  </XStack>
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Priority *</Text>
                  <XStack space="$3">
                    {[
                      { value: "low", label: "Low", color: "$green9" },
                      { value: "medium", label: "Medium", color: "$yellow9" },
                      { value: "high", label: "High", color: "$red9" },
                    ].map((priority) => (
                      <Button
                        key={priority.value}
                        backgroundColor={
                          formData.priority === priority.value
                            ? priority.color
                            : "$gray8"
                        }
                        color={
                          formData.priority === priority.value
                            ? "white"
                            : "$color"
                        }
                        onPress={() =>
                          setFormData((prev) => ({
                            ...prev,
                            priority: priority.value as any,
                          }))
                        }
                        borderRadius="$3"
                        paddingHorizontal="$4"
                        paddingVertical="$3"
                        flex={1}
                      >
                        {priority.label}
                      </Button>
                    ))}
                  </XStack>
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Target Amount *</Text>
                  <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
                    <Text
                      color="$color"
                      fontSize="$5"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {formatCurrency(formData.targetAmount)}
                    </Text>
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={1000}
                      maximumValue={100000}
                      step={1000}
                      value={formData.targetAmount}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          targetAmount: value,
                        }))
                      }
                      minimumTrackTintColor="#007AFF"
                      maximumTrackTintColor="#333333"
                    />
                    <XStack justifyContent="space-between" marginTop="$2">
                      <Text color="$gray11" fontSize="$3">
                        $1K
                      </Text>
                      <Text color="$gray11" fontSize="$3">
                        $100K
                      </Text>
                    </XStack>
                  </View>
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Current Amount</Text>
                  <View backgroundColor="$gray8" padding="$3" borderRadius="$3">
                    <Text
                      color="$color"
                      fontSize="$5"
                      fontWeight="600"
                      textAlign="center"
                    >
                      {formatCurrency(formData.currentAmount)}
                    </Text>
                    <Slider
                      style={{ width: "100%", height: 40 }}
                      minimumValue={0}
                      maximumValue={formData.targetAmount}
                      step={100}
                      value={formData.currentAmount}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          currentAmount: value,
                        }))
                      }
                      minimumTrackTintColor="#34C759"
                      maximumTrackTintColor="#333333"
                    />
                    <XStack justifyContent="space-between" marginTop="$2">
                      <Text color="$gray11" fontSize="$3">
                        $0
                      </Text>
                      <Text color="$gray11" fontSize="$3">
                        {formatCurrency(formData.targetAmount)}
                      </Text>
                    </XStack>
                  </View>
                </YStack>

                <YStack space="$2">
                  <Text color="$color">Deadline *</Text>
                  <Button
                    backgroundColor="$gray8"
                    color="$color"
                    onPress={() => {
                      console.log("Date picker button pressed");
                      console.log(
                        "Current showDatePicker state:",
                        showDatePicker
                      );
                      showDatePickerModal();
                    }}
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                  >
                    📅 {formData.deadline.toLocaleDateString()}
                  </Button>

                  {/* Date Picker inside modal */}
                  {showDatePicker &&
                    (Platform.OS === "web" ? (
                      <View
                        backgroundColor="$gray8"
                        padding="$3"
                        borderRadius="$3"
                      >
                        <Text color="$color" fontSize="$4" marginBottom="$2">
                          Select Date:
                        </Text>
                        <input
                          type="date"
                          value={tempDate.toISOString().split("T")[0]}
                          onChange={(e) => {
                            console.log(
                              "Web date picker changed:",
                              e.target.value
                            );
                            const date = new Date(e.target.value);
                            console.log("Parsed date:", date);
                            if (!isNaN(date.getTime())) {
                              setTempDate(date);
                              console.log("Temp date updated to:", date);
                            }
                          }}
                          style={{
                            backgroundColor: "#1a1a1a",
                            color: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #333",
                            fontSize: "16px",
                            width: "100%",
                            outline: "none",
                          }}
                        />
                        <XStack
                          space="$3"
                          justifyContent="center"
                          marginTop="$3"
                        >
                          <Button
                            backgroundColor="$red9"
                            color="white"
                            onPress={() => setShowDatePicker(false)}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$3"
                          >
                            Cancel
                          </Button>
                          <Button
                            backgroundColor="$blue9"
                            color="white"
                            onPress={() => {
                              console.log("Web date picker confirm pressed");
                              console.log("Temp date:", tempDate);
                              setFormData((prev) => ({
                                ...prev,
                                deadline: tempDate,
                              }));
                              console.log(
                                "Form data updated with deadline:",
                                tempDate
                              );
                              setShowDatePicker(false);
                            }}
                            borderRadius="$3"
                            paddingHorizontal="$4"
                            paddingVertical="$3"
                          >
                            Confirm
                          </Button>
                        </XStack>
                      </View>
                    ) : (
                      <DateTimePicker
                        value={tempDate}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        onChange={handleDateChange}
                        minimumDate={new Date()}
                      />
                    ))}
                </YStack>
              </YStack>

              <Button
                backgroundColor="$blue9"
                color="white"
                onPress={() => {
                  console.log("Add Goal button pressed - starting validation");
                  console.log("Form data:", formData);
                  handleSaveGoal();
                }}
                marginTop="auto"
                borderRadius="$3"
                paddingHorizontal="$4"
                paddingVertical="$3"
                disabled={false}
              >
                {editingGoal ? "Update Goal" : "Add Goal"}
              </Button>
            </YStack>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Money Modal */}
      <Modal
        visible={showAddMoneyModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddMoneyModal(false)}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View flex={1} backgroundColor="$background" style={{ padding: 16 }}>
            <YStack space="$4" flex={1}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontSize="$7" fontWeight="bold" color="$color">
                  Add Money to Goal
                </Text>
                <Button
                  variant="outlined"
                  borderColor="$gray8"
                  color="$gray11"
                  onPress={() => setShowAddMoneyModal(false)}
                  borderRadius="$3"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                >
                  Cancel
                </Button>
              </XStack>

              {selectedGoal && (
                <YStack space="$3">
                  <View backgroundColor="$gray8" padding="$4" borderRadius="$4">
                    <Text
                      fontSize="$5"
                      fontWeight="bold"
                      color="$color"
                      marginBottom="$2"
                    >
                      {selectedGoal.name}
                    </Text>
                    <XStack justifyContent="space-between" marginBottom="$2">
                      <Text color="$gray11">Current Amount:</Text>
                      <Text color="$color" fontWeight="600">
                        {formatCurrency(selectedGoal.currentAmount)}
                      </Text>
                    </XStack>
                    <XStack justifyContent="space-between">
                      <Text color="$gray11">Target Amount:</Text>
                      <Text color="$color" fontWeight="600">
                        {formatCurrency(selectedGoal.targetAmount)}
                      </Text>
                    </XStack>
                  </View>

                  <YStack space="$2">
                    <Text color="$color">Amount to Add *</Text>
                    <View
                      backgroundColor="$gray8"
                      padding="$3"
                      borderRadius="$3"
                    >
                      <Text
                        color="$color"
                        fontSize="$5"
                        fontWeight="600"
                        textAlign="center"
                      >
                        {formatCurrency(addMoneyAmount)}
                      </Text>
                      <Slider
                        style={{ width: "100%", height: 40 }}
                        minimumValue={0}
                        maximumValue={Math.min(
                          selectedGoal.targetAmount -
                            selectedGoal.currentAmount,
                          50000
                        )}
                        step={100}
                        value={addMoneyAmount}
                        onValueChange={(value) => setAddMoneyAmount(value)}
                        minimumTrackTintColor="#34C759"
                        maximumTrackTintColor="#333333"
                      />
                      <XStack justifyContent="space-between" marginTop="$2">
                        <Text color="$gray11" fontSize="$3">
                          $0
                        </Text>
                        <Text color="$gray11" fontSize="$3">
                          {formatCurrency(
                            Math.min(
                              selectedGoal.targetAmount -
                                selectedGoal.currentAmount,
                              50000
                            )
                          )}
                        </Text>
                      </XStack>
                    </View>
                  </YStack>

                  <Button
                    backgroundColor="$green9"
                    color="white"
                    onPress={handleSaveAddMoney}
                    marginTop="auto"
                    borderRadius="$3"
                    paddingHorizontal="$4"
                    paddingVertical="$3"
                    disabled={addMoneyAmount <= 0}
                  >
                    Add {formatCurrency(addMoneyAmount)}
                  </Button>
                </YStack>
              )}
            </YStack>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
