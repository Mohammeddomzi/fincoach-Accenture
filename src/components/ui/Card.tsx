import React, { PropsWithChildren } from 'react';
import { View } from '@tamagui/core';

type CardProps = PropsWithChildren<{
  padded?: boolean;
}>;

export default function Card({ children, padded = true }: CardProps) {
  return (
    <View
      backgroundColor="$panel"
      borderRadius={12}
      borderWidth={1}
      borderColor="$borderColor"
      padding={padded ? 16 : 0}
      shadowColor="black"
      shadowOpacity={0.15}
      shadowRadius={12}
      shadowOffset={{ width: 0, height: 6 }}
      accessibilityRole="summary"
    >
      {children}
    </View>
  );
}


