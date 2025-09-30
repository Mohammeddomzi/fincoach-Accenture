import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export default function Index() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.replace('/(tabs)/advisor');
  };

  const features = [
    {
      icon: 'analytics-outline' as const,
      title: 'Smart Analysis',
      description: 'AI-powered financial insights and recommendations',
    },
    {
      icon: 'trophy-outline' as const,
      title: 'Goal Tracking',
      description: 'Set and achieve your financial goals with ease',
    },
    {
      icon: 'chatbubbles-outline' as const,
      title: 'AI Advisor',
      description: 'Get personalized financial advice anytime',
    },
    {
      icon: 'shield-checkmark-outline' as const,
      title: 'Privacy First',
      description: 'Your data stays secure on your device',
    },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoBackground}>
              <Ionicons name="wallet" size={60} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.title}>FinCoach</Text>
          <Text style={styles.subtitle}>Your AI-powered financial advisor</Text>
          <Text style={styles.description}>
            Take control of your finances with intelligent insights, goal tracking, and personalized advice.
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Card key={index} style={styles.featureCard} padding="medium">
              <View style={styles.featureContent}>
                <Ionicons name={feature.icon} size={32} color="#4f7f8c" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={styles.ctaContainer}>
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            size="large"
            icon="arrow-forward"
            style={styles.ctaButton}
          />
          
          <View style={styles.trustBadge}>
            <Ionicons name="shield-checkmark" size={20} color="#34C759" />
            <Text style={styles.trustText}>Privacy Protected • No Registration Required</Text>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4f7f8c',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4f7f8c',
    shadowOffset: {
      width: 0,
      height: 8,
    },
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
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    marginBottom: 16,
    backgroundColor: '#111315',
    borderWidth: 1,
    borderColor: '#2b2f33',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureContent: {
    alignItems: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#a5c6d5',
    textAlign: 'center',
    lineHeight: 20,
  },
  ctaContainer: {
    alignItems: 'center',
  },
  ctaButton: {
    minWidth: 200,
    marginBottom: 20,
  },
  trustBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  trustText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
});