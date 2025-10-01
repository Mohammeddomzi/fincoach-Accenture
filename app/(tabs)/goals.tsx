import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Goal } from '../../lib/types';
import { storage } from '../../lib/storage';

export default function GoalsScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<{
    name: string;
    targetAmount: string;
    currentAmount: string;
    deadline: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
  }>({
    name: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    priority: 'medium',
    category: 'savings',
  });

  useEffect(() => {
    const savedData = storage.getItem('fincoach-data');
    if (savedData && savedData.goals) {
      setGoals(savedData.goals);
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    const savedData = storage.getItem('fincoach-data') || {};
    storage.setItem('fincoach-data', { ...savedData, goals: updatedGoals });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min((current / target) * 100, 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return '#34C759';
    if (progress >= 75) return '#4f7f8c';
    if (progress >= 50) return '#FF9500';
    return '#FF3B30';
  };

  const handleAddGoal = () => {
    if (!newGoal.name.trim() || !newGoal.targetAmount.trim()) {
      Alert.alert('Error', 'Please fill in goal name and target amount');
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name.trim(),
      targetAmount: parseFloat(newGoal.targetAmount) || 0,
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      deadline: newGoal.deadline.trim(),
      priority: newGoal.priority,
      category: newGoal.category,
      isCompleted: false,
    };

    const updatedGoals = [...goals, goal];
    saveGoals(updatedGoals);

    setNewGoal({
      name: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      priority: 'medium',
      category: 'savings',
    });
    setShowAddGoal(false);
    Alert.alert('Success', 'Goal added successfully!');
  };

  const handleUpdateGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
        return {
          ...goal,
          currentAmount: newAmount,
          isCompleted: newAmount >= goal.targetAmount,
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const handleCompleteGoal = (goalId: string) => {
    const updatedGoals = goals.map(goal => {
      if (goal.id === goalId) {
        return { ...goal, currentAmount: goal.targetAmount, isCompleted: true };
      }
      return goal;
    });
    saveGoals(updatedGoals);
    Alert.alert('Success', 'Goal completed! 🎉');
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedGoals = goals.filter(goal => goal.id !== goalId);
            saveGoals(updatedGoals);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {goals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={80} color="#6b7680" />
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your financial journey by adding your first goal
            </Text>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddGoal(true)}>
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.addButtonText}>Add Your First Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.isCompleted || progress >= 100;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalInfo}>
                    <Text style={styles.goalName}>{goal.name}</Text>
                    <Text style={styles.goalAmounts}>
                      {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
                    </Text>
                  </View>
                  {isCompleted && (
                    <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                  )}
                </View>

                <View style={styles.progressContainer}>
                  <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: getProgressColor(progress) }]} />
                </View>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>

                {!isCompleted && (
                  <View style={styles.goalActions}>
                    <TouchableOpacity
                      style={styles.quickAddButton}
                      onPress={() => handleUpdateGoal(goal.id, 100)}
                    >
                      <Text style={styles.quickAddText}>+100</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickAddButton}
                      onPress={() => handleUpdateGoal(goal.id, 500)}
                    >
                      <Text style={styles.quickAddText}>+500</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.completeButton}
                      onPress={() => handleCompleteGoal(goal.id)}
                    >
                      <Text style={styles.completeButtonText}>Complete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteGoal(goal.id)}
                    >
                      <Ionicons name="trash" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={showAddGoal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TouchableOpacity onPress={() => setShowAddGoal(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Goal Name</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.name}
                onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor="#6b7680"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Target Amount (SAR)</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.targetAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                placeholder="10000"
                keyboardType="numeric"
                placeholderTextColor="#6b7680"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Amount (SAR)</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.currentAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, currentAmount: text })}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#6b7680"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Deadline (Optional)</Text>
              <TextInput
                style={styles.textInput}
                value={newGoal.deadline}
                onChangeText={(text) => setNewGoal({ ...newGoal, deadline: text })}
                placeholder="2024-12-31"
                placeholderTextColor="#6b7680"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.priorityButtons}>
                {(['low', 'medium', 'high'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityButton,
                      newGoal.priority === priority && styles.priorityButtonActive
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, priority })}
                  >
                    <Text style={[
                      styles.priorityButtonText,
                      newGoal.priority === priority && styles.priorityButtonTextActive
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleAddGoal}>
              <Text style={styles.saveButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  addButton: {
    backgroundColor: '#4f7f8c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalAmounts: {
    fontSize: 14,
    color: '#a5c6d5',
  },
  progressContainer: {
    height: 8,
    backgroundColor: '#2b2f33',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7680',
    textAlign: 'right',
    marginBottom: 12,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickAddButton: {
    backgroundColor: '#2b2f33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  quickAddText: {
    color: '#4f7f8c',
    fontSize: 12,
    fontWeight: '500',
  },
  completeButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  completeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f33',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: '#2b2f33',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#4f7f8c',
  },
  priorityButtonText: {
    color: '#6b7680',
    fontSize: 14,
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#4f7f8c',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});