import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../lib/state';

export default function RootLayout() {
  const { initializeApp } = useAppStore();

  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0a0a0a',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="goals/[id]"
          options={{ 
            title: 'Edit Goal',
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#4f7f8c',
          }}
        />
      </Stack>
    </>
  );
}