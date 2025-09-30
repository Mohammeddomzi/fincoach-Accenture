import React, { PropsWithChildren, useRef } from 'react';
import { Button } from '@tamagui/button';
import { Animated } from 'react-native';

type GlowButtonProps = PropsWithChildren<{ onPress?: () => void; disabled?: boolean }>

export default function GlowButton({ children, onPress, disabled }: GlowButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Button
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        backgroundColor="$accent"
        color="#ffffff"
        borderRadius="$3"
        paddingHorizontal="$4"
        paddingVertical="$3"
      >
        {children}
      </Button>
    </Animated.View>
  );
}


