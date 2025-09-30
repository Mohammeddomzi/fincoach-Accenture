import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface WhatIfModalProps {
  visible: boolean;
  onClose: () => void;
  targetAmount: number;
  monthlyContribution: number;
  onApply: (newContribution: number) => void;
}

export default function WhatIfModal({ visible, onClose, targetAmount, monthlyContribution, onApply }: WhatIfModalProps) {
  const [newMonthlyContribution, setNewMonthlyContribution] = useState(monthlyContribution);
  const [monthsToSimulate, setMonthsToSimulate] = useState(6);

  const handleApply = () => {
    onApply(newMonthlyContribution);
    Alert.alert("Success", "Monthly contribution updated!");
  };

  const handleReset = () => {
    setNewMonthlyContribution(monthlyContribution);
  };

  const projectedAmount = newMonthlyContribution * monthsToSimulate;
  const monthsNeeded = newMonthlyContribution > 0 ? Math.ceil(targetAmount / newMonthlyContribution) : Infinity;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>What-If Simulation</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Adjust Monthly Contribution</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Monthly Contribution</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>SAR {newMonthlyContribution.toLocaleString()}</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                <TouchableOpacity 
                  style={styles.sliderButton}
                  onPress={() => setNewMonthlyContribution(Math.max(0, newMonthlyContribution - 100))}
                >
                  <Ionicons name="remove" size={20} color="#4f7f8c" />
                </TouchableOpacity>
                
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${Math.min((newMonthlyContribution / (targetAmount / 6)) * 100, 100)}%` }
                    ]} 
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.sliderButton}
                  onPress={() => setNewMonthlyContribution(newMonthlyContribution + 100)}
                >
                  <Ionicons name="add" size={20} color="#4f7f8c" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Simulation Period</Text>
              <View style={styles.valueContainer}>
                <Text style={styles.value}>{monthsToSimulate} months</Text>
              </View>
              
              <View style={styles.sliderContainer}>
                <TouchableOpacity 
                  style={styles.sliderButton}
                  onPress={() => setMonthsToSimulate(Math.max(1, monthsToSimulate - 1))}
                >
                  <Ionicons name="remove" size={20} color="#4f7f8c" />
                </TouchableOpacity>
                
                <View style={styles.sliderTrack}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { width: `${(monthsToSimulate / 24) * 100}%` }
                    ]} 
                  />
                </View>
                
                <TouchableOpacity 
                  style={styles.sliderButton}
                  onPress={() => setMonthsToSimulate(Math.min(24, monthsToSimulate + 1))}
                >
                  <Ionicons name="add" size={20} color="#4f7f8c" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Projection Results</Text>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Projected Amount</Text>
              <Text style={styles.resultValue}>SAR {projectedAmount.toLocaleString()}</Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Months to Target</Text>
              <Text style={styles.resultValue}>
                {monthsNeeded === Infinity ? 'Never' : `${monthsNeeded} months`}
              </Text>
            </View>
            
            <View style={styles.resultItem}>
              <Text style={styles.resultLabel}>Target Amount</Text>
              <Text style={styles.resultValue}>SAR {targetAmount.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2b2f33",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#111315",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2b2f33",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    marginBottom: 8,
  },
  valueContainer: {
    backgroundColor: "#15181a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4f7f8c",
    textAlign: "center",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sliderButton: {
    width: 40,
    height: 40,
    backgroundColor: "#15181a",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#2b2f33",
    borderRadius: 4,
  },
  sliderFill: {
    height: "100%",
    backgroundColor: "#4f7f8c",
    borderRadius: 4,
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 14,
    color: "#6b7680",
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2b2f33",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#6b7680",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#4f7f8c",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});