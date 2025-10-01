import React, { useEffect, useRef } from 'react';
import { View } from '@tamagui/core';
import { Animated, Dimensions } from 'react-native';

interface ConfettiProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

export default function Confetti({ visible, onComplete }: ConfettiProps) {
  const confettiRefs = useRef<Animated.Value[]>([]);
  const opacityRef = useRef(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Create confetti pieces
      confettiRefs.current = Array.from({ length: 20 }, () => new Animated.Value(0));
      
      // Show confetti
      Animated.timing(opacityRef.current, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Animate confetti pieces
      const animations = confettiRefs.current.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 50),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(animations).start(() => {
        // Hide confetti
        Animated.timing(opacityRef.current, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onComplete?.();
        });
      });
    }
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <View
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      pointerEvents="none"
      zIndex={1000}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: opacityRef.current,
        }}
      >
        {confettiRefs.current.map((anim, index) => {
          const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
          const color = colors[index % colors.length];
          const startX = (index * width) / confettiRefs.current.length;
          const rotation = Math.random() * 360;
          
          return (
            <Animated.View
              key={index}
              style={{
                position: 'absolute',
                left: startX,
                top: -20,
                width: 8,
                height: 8,
                backgroundColor: color,
                borderRadius: 4,
                transform: [
                  {
                    translateY: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, height + 100],
                    }),
                  },
                  {
                    rotate: `${rotation}deg`,
                  },
                ],
              }}
            />
          );
        })}
      </Animated.View>
    </View>
  );
}
