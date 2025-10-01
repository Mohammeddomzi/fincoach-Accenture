import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/(tabs)/advisor');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="wallet" size={80} color="#4f7f8c" />
        </View>
        <Text style={styles.title}>FinCoach</Text>
        <Text style={styles.subtitle}>Your AI-powered financial advisor</Text>
        <Text style={styles.description}>
          Take control of your finances with intelligent insights and goal tracking.
        </Text>
      </View>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="analytics" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Smart Analysis</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="trophy" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Goal Tracking</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="chatbubbles" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>AI Advisor</Text>
        </View>
        <View style={styles.feature}>
          <Ionicons name="shield-checkmark" size={32} color="#4f7f8c" />
          <Text style={styles.featureText}>Privacy First</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
        <Text style={styles.getStartedText}>Get Started</Text>
        <Ionicons name="arrow-forward" size={20} color="#ffffff" />
      </TouchableOpacity>

      <View style={styles.trustBadge}>
        <Ionicons name="shield-checkmark" size={16} color="#34C759" />
        <Text style={styles.trustText}>Privacy Protected • No Registration Required</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#4f7f8c',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4f7f8c',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a5c6d5',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6b7680',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  feature: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2b2f33',
  },
  featureText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: '#4f7f8c',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    alignSelf: 'center',
  },
  trustText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
});
