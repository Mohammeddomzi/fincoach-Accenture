import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const LoadingDots = () => {
  const dot1Anim = useRef(new Animated.Value(0.4)).current;
  const dot2Anim = useRef(new Animated.Value(0.7)).current;
  const dot3Anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(dot1Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
        Animated.timing(dot2Anim, { toValue: 0.7, duration: 300, useNativeDriver: true }),
        Animated.timing(dot3Anim, { toValue: 0.4, duration: 300, useNativeDriver: true }),
      ]).start(() => animateDots());
    };
    animateDots();
  }, []);

  return (
    <View style={styles.loadingDots}>
      <Animated.View style={[styles.dot, { opacity: dot1Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot2Anim }]} />
      <Animated.View style={[styles.dot, { opacity: dot3Anim }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4f7f8c',
  },
});
