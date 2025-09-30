import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAppStore } from '../../lib/state';
import { formatCurrency } from '../../lib/utils';

export default function AdvisorScreen() {
  const { addChatMessage, chatMessages } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleAskCoach = async () => {
    setIsLoading(true);
    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addChatMessage({
        content: "Hello! I'm your AI financial advisor. How can I help you today?",
        role: 'assistant',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to AI advisor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetGoal = () => {
    Alert.alert('Set Goal', 'Goal setting feature coming soon!');
  };

  const handleUploadCSV = () => {
    Alert.alert('Upload CSV', 'CSV upload feature coming soon!');
  };

  const quickActions = [
    {
      icon: 'wallet-outline' as const,
      title: 'Track Expenses',
      description: 'Monitor your spending patterns',
      onPress: () => Alert.alert('Track Expenses', 'Feature coming soon!'),
    },
    {
      icon: 'trending-up-outline' as const,
      title: 'View Reports',
      description: 'Analyze your financial trends',
      onPress: () => Alert.alert('View Reports', 'Feature coming soon!'),
    },
    {
      icon: 'calendar-outline' as const,
      title: 'Set Reminders',
      description: 'Never miss important dates',
      onPress: () => Alert.alert('Set Reminders', 'Feature coming soon!'),
    },
    {
      icon: 'people-outline' as const,
      title: 'Join Community',
      description: 'Connect with other users',
      onPress: () => Alert.alert('Join Community', 'Feature coming soon!'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Welcome Card */}
        <Card style={styles.welcomeCard} padding="large">
          <View style={styles.welcomeHeader}>
            <Ionicons name="sparkles" size={32} color="#4f7f8c" />
            <Text style={styles.welcomeTitle}>Welcome to FinCoach!</Text>
          </View>
          <Text style={styles.welcomeSubtitle}>
            Your AI-powered financial advisor is ready to help you achieve your goals.
          </Text>
          
          <View style={styles.actionButtons}>
            <Button
              title="Ask Coach"
              onPress={handleAskCoach}
              icon="chatbubbles"
              loading={isLoading}
              style={styles.primaryAction}
            />
            
            <Button
              title="Set Goal"
              onPress={handleSetGoal}
              icon="trophy"
              variant="outline"
              style={styles.secondaryAction}
            />
            
            <Button
              title="Upload CSV"
              onPress={handleUploadCSV}
              icon="document-attach"
              variant="outline"
              style={styles.secondaryAction}
            />
          </View>
        </Card>

        {/* AI Forecast Card */}
        <Card style={styles.forecastCard} padding="large">
          <View style={styles.forecastHeader}>
            <Ionicons name="trending-up" size={24} color="#34C759" />
            <Text style={styles.forecastTitle}>AI Forecast</Text>
          </View>
          <Text style={styles.forecastText}>
            If you contribute {formatCurrency(500)}/month, you'll reach your goal of {formatCurrency(10000)} in 20 months.
          </Text>
          <View style={styles.forecastDetails}>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastLabel}>Monthly Contribution</Text>
              <Text style={styles.forecastValue}>{formatCurrency(500)}</Text>
            </View>
            <View style={styles.forecastItem}>
              <Text style={styles.forecastLabel}>Time to Goal</Text>
              <Text style={styles.forecastValue}>20 months</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <Card style={styles.actionsCard} padding="large">
          <Text style={styles.actionsTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                title={action.title}
                onPress={action.onPress}
                icon={action.icon}
                variant="ghost"
                size="small"
                style={styles.actionItem}
              />
            ))}
          </View>
        </Card>

        {/* Privacy Badge */}
        <View style={styles.privacyBadge}>
          <Ionicons name="shield-checkmark" size={20} color="#34C759" />
          <Text style={styles.privacyText}>
            🔐 Privacy Protected - Your data stays on your device
          </Text>
        </View>
      </ScrollView>
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
  welcomeCard: {
    marginBottom: 16,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7680',
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButtons: {
    gap: 12,
  },
  primaryAction: {
    backgroundColor: '#4f7f8c',
  },
  secondaryAction: {
    borderColor: '#4f7f8c',
  },
  forecastCard: {
    marginBottom: 16,
  },
  forecastHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  forecastText: {
    fontSize: 16,
    color: '#a5c6d5',
    lineHeight: 24,
    marginBottom: 16,
  },
  forecastDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  forecastItem: {
    flex: 1,
  },
  forecastLabel: {
    fontSize: 14,
    color: '#6b7680',
    marginBottom: 4,
  },
  forecastValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  actionsCard: {
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    flex: 1,
    minWidth: '45%',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  privacyText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
    flex: 1,
  },
});