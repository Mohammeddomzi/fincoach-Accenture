import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useAppStore } from '../../lib/state';
import { formatCurrency, formatDate, calculateProgress, getProgressColor, getPriorityColor, getCategoryIcon, getTimeRemaining } from '../../lib/utils';

export default function GoalsScreen() {
  const { goals, addGoal, updateGoal, deleteGoal, completeGoal } = useAppStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    targetAmount: '',
    currentAmount: '',
    currency: 'SAR',
    deadline: new Date(),
    priority: 'medium' as const,
    category: 'savings' as const,
  });

  const handleAddGoal = () => {
    if (!newGoal.name.trim()) {
      Alert.alert('Error', 'Please enter a goal name');
      return;
    }

    if (!newGoal.targetAmount || parseFloat(newGoal.targetAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    addGoal({
      name: newGoal.name.trim(),
      description: newGoal.description.trim(),
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      currency: newGoal.currency,
      deadline: newGoal.deadline,
      priority: newGoal.priority,
      category: newGoal.category,
      isCompleted: false,
    });

    setNewGoal({
      name: '',
      description: '',
      targetAmount: '',
      currentAmount: '',
      currency: 'SAR',
      deadline: new Date(),
      priority: 'medium',
      category: 'savings',
    });
    setShowAddModal(false);
    Alert.alert('Success', 'Goal added successfully!');
  };

  const handleCompleteGoal = (goalId: string) => {
    Alert.alert(
      'Complete Goal',
      'Are you sure you want to mark this goal as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Complete', onPress: () => completeGoal(goalId) },
      ]
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteGoal(goalId) },
      ]
    );
  };

  const handleAddAmount = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const newAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
      updateGoal(goalId, { currentAmount: newAmount });
    }
  };

  if (goals.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.emptyContainer}>
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={80} color="#6b7680" />
            <Text style={styles.emptyTitle}>No Goals Yet</Text>
            <Text style={styles.emptySubtitle}>
              Start your financial journey by adding your first goal
            </Text>
            <Button
              title="Add Your First Goal"
              onPress={() => setShowAddModal(true)}
              icon="add"
              size="large"
              style={styles.addButton}
            />
          </View>
        </ScrollView>

        {/* Add Goal Modal */}
        <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Goal</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="#6b7680" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Input
                label="Goal Name"
                value={newGoal.name}
                onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
                placeholder="e.g., Emergency Fund"
              />

              <Input
                label="Description (Optional)"
                value={newGoal.description}
                onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
                placeholder="Describe your goal..."
                multiline
                numberOfLines={3}
              />

              <Input
                label="Target Amount"
                value={newGoal.targetAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
                placeholder="10000"
                keyboardType="numeric"
                leftIcon="cash-outline"
              />

              <Input
                label="Current Amount"
                value={newGoal.currentAmount}
                onChangeText={(text) => setNewGoal({ ...newGoal, currentAmount: text })}
                placeholder="0"
                keyboardType="numeric"
                leftIcon="wallet-outline"
              />

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setShowAddModal(false)}
                  variant="outline"
                  style={styles.cancelButton}
                />
                <Button
                  title="Add Goal"
                  onPress={handleAddGoal}
                  style={styles.addGoalButton}
                />
              </View>
            </ScrollView>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Goals Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Goals</Text>
          <Button
            title="Add Goal"
            onPress={() => setShowAddModal(true)}
            icon="add"
            size="small"
          />
        </View>

        {/* Goals List */}
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
          const isCompleted = goal.isCompleted || progress >= 100;

          return (
            <Card key={goal.id} style={styles.goalCard} padding="large">
              <View style={styles.goalHeader}>
                <View style={styles.goalInfo}>
                  <Text style={styles.goalName}>{goal.name}</Text>
                  <Text style={styles.goalDescription}>{goal.description}</Text>
                </View>
                {isCompleted && (
                  <Ionicons name="checkmark-circle" size={24} color="#34C759" />
                )}
              </View>

              <View style={styles.goalDetails}>
                <View style={styles.goalAmounts}>
                  <Text style={styles.currentAmount}>
                    {formatCurrency(goal.currentAmount, goal.currency)}
                  </Text>
                  <Text style={styles.targetAmount}>
                    of {formatCurrency(goal.targetAmount, goal.currency)}
                  </Text>
                </View>

                <View style={styles.goalMeta}>
                  <View style={styles.goalCategory}>
                    <Text style={styles.categoryIcon}>{getCategoryIcon(goal.category)}</Text>
                    <Text style={styles.categoryText}>{goal.category}</Text>
                  </View>
                  <View style={styles.goalPriority}>
                    <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(goal.priority) }]} />
                    <Text style={styles.priorityText}>{goal.priority}</Text>
                  </View>
                </View>
              </View>

              <ProgressBar
                progress={progress}
                color={getProgressColor(progress)}
                style={styles.progressBar}
              />

              <View style={styles.goalFooter}>
                <Text style={styles.deadlineText}>
                  {getTimeRemaining(goal.deadline)}
                </Text>
                <Text style={styles.deadlineDate}>
                  {formatDate(goal.deadline)}
                </Text>
              </View>

              {!isCompleted && (
                <View style={styles.goalActions}>
                  <Button
                    title="+100"
                    onPress={() => handleAddAmount(goal.id, 100)}
                    size="small"
                    variant="outline"
                    style={styles.quickAddButton}
                  />
                  <Button
                    title="+500"
                    onPress={() => handleAddAmount(goal.id, 500)}
                    size="small"
                    variant="outline"
                    style={styles.quickAddButton}
                  />
                  <Button
                    title="Complete"
                    onPress={() => handleCompleteGoal(goal.id)}
                    size="small"
                    style={styles.completeButton}
                  />
                  <Button
                    title="Delete"
                    onPress={() => handleDeleteGoal(goal.id)}
                    size="small"
                    variant="ghost"
                    style={styles.deleteButton}
                  />
                </View>
              )}
            </Card>
          );
        })}
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal visible={showAddModal} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Goal</Text>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <Ionicons name="close" size={24} color="#6b7680" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Input
              label="Goal Name"
              value={newGoal.name}
              onChangeText={(text) => setNewGoal({ ...newGoal, name: text })}
              placeholder="e.g., Emergency Fund"
            />

            <Input
              label="Description (Optional)"
              value={newGoal.description}
              onChangeText={(text) => setNewGoal({ ...newGoal, description: text })}
              placeholder="Describe your goal..."
              multiline
              numberOfLines={3}
            />

            <Input
              label="Target Amount"
              value={newGoal.targetAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, targetAmount: text })}
              placeholder="10000"
              keyboardType="numeric"
              leftIcon="cash-outline"
            />

            <Input
              label="Current Amount"
              value={newGoal.currentAmount}
              onChangeText={(text) => setNewGoal({ ...newGoal, currentAmount: text })}
              placeholder="0"
              keyboardType="numeric"
              leftIcon="wallet-outline"
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => setShowAddModal(false)}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Add Goal"
                onPress={handleAddGoal}
                style={styles.addGoalButton}
              />
            </View>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
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
    minWidth: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  goalCard: {
    marginBottom: 16,
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
  goalDescription: {
    fontSize: 14,
    color: '#6b7680',
    lineHeight: 20,
  },
  goalDetails: {
    marginBottom: 16,
  },
  goalAmounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4f7f8c',
  },
  targetAmount: {
    fontSize: 16,
    color: '#6b7680',
    marginLeft: 8,
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7680',
    textTransform: 'capitalize',
  },
  goalPriority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 14,
    color: '#6b7680',
    textTransform: 'capitalize',
  },
  progressBar: {
    marginBottom: 12,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deadlineText: {
    fontSize: 14,
    color: '#6b7680',
  },
  deadlineDate: {
    fontSize: 14,
    color: '#6b7680',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickAddButton: {
    flex: 1,
    minWidth: 60,
  },
  completeButton: {
    flex: 1,
    minWidth: 80,
  },
  deleteButton: {
    flex: 1,
    minWidth: 60,
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
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
  },
  addGoalButton: {
    flex: 1,
  },
});