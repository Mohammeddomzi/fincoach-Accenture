import React, { useState } from "react";
import { View } from "@tamagui/core";
import { YStack } from "@tamagui/stacks";
import ChatView from "../../components/ChatView";
import IntroCards from "../../components/IntroCards";

export default function AdvisorScreen() {
  const [showIntro, setShowIntro] = useState(true);

  const handleAskCoach = () => setShowIntro(false);

  return (
    <View flex={1} backgroundColor="$background">
      {showIntro ? (
        <YStack flex={1}>
          <IntroCards
            onSetGoal={() => setShowIntro(false)}
            onUploadData={() => setShowIntro(false)}
            onAskCoach={handleAskCoach}
          />
        </YStack>
      ) : (
        <ChatView />
      )}
    </View>
  );
}
