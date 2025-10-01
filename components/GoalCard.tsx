import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  type?: string;
  priority?: string;
}

interface GoalCardProps {
  goal: Goal;
  onEdit?: (goal: Goal) => void;
  onDelete?: (id: string) => void;
  onSimulate?: (goal: Goal) => void;
}

export default function GoalCard({ goal, onEdit, onDelete, onSimulate }: GoalCardProps) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  
  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "#34C759";
    if (progress >= 75) return "#4f7f8c";
    if (progress >= 50) return "#F59E0B";
    return "#FF3B30";
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "#FF3B30";
      case "medium": return "#F59E0B";
      case "low": return "#34C759";
      default: return "#6b7680";
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{goal.name}</Text>
          {goal.type && (
            <View style={[styles.typeTag, { backgroundColor: "#4f7f8c" }]}>
              <Text style={styles.typeText}>{goal.type}</Text>
            </View>
          )}
        </View>
        
        {progress >= 100 && (
          <View style={styles.completedBadge}>
            <Ionicons name="trophy" size={16} color="#34C759" />
          </View>
        )}
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${progress}%`,
                backgroundColor: getProgressColor(progress)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(0)}%</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Current:</Text>
          <Text style={styles.detailValue}>SAR {goal.current.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Target:</Text>
          <Text style={styles.detailValue}>SAR {goal.target.toLocaleString()}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Deadline:</Text>
          <Text style={styles.detailValue}>{goal.deadline}</Text>
        </View>
        {goal.priority && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Priority:</Text>
            <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(goal.priority) }]}>
              <Text style={styles.priorityText}>{goal.priority}</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {onSimulate && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onSimulate(goal)}
          >
            <Ionicons name="calculator" size={16} color="#4f7f8c" />
            <Text style={styles.actionText}>Simulate</Text>
          </TouchableOpacity>
        )}
        
        {onEdit && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onEdit(goal)}
          >
            <Ionicons name="pencil" size={16} color="#4f7f8c" />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        )}
        
        {onDelete && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => onDelete(goal.id)}
          >
            <Ionicons name="trash" size={16} color="#FF3B30" />
            <Text style={[styles.actionText, { color: "#FF3B30" }]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111315",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2b2f33",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1,
  },
  typeTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  completedBadge: {
    padding: 4,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#2b2f33",
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    minWidth: 40,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6b7680",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: "#ffffff",
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#15181a",
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#4f7f8c",
    fontWeight: "500",
  },
});