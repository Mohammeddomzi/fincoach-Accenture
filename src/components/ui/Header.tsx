import React from 'react';
import { View, Text } from '@tamagui/core';
import { XStack } from '@tamagui/stacks';
import HeaderLogo from '../../../components/HeaderLogo';

export default function Header() {
  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      paddingHorizontal={16}
      paddingVertical={12}
      backgroundColor="$background"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <HeaderLogo />
      <View>
        <Text color="$textDim">Advisor</Text>
      </View>
    </XStack>
  );
}


