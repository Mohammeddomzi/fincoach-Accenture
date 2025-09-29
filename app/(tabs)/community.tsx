import React, { useEffect, useState } from "react";
import { View, Text } from "@tamagui/core";
import { YStack, XStack } from "@tamagui/stacks";
import { Button } from "@tamagui/button";
import { ScrollView } from "react-native";
import { loadSettings, saveSettings } from "../../lib/ai";

const ADJECTIVES = ["Swift", "Calm", "Bright", "Steady", "Brave", "Wise", "Kind", "Clever", "Bold", "Nimble"];
const ANIMALS = ["Falcon", "Dolphin", "Fox", "Panda", "Otter", "Tiger", "Koala", "Hawk", "Wolf", "Finch"];

function generateNickname() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const b = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const n = Math.floor(Math.random() * 900 + 100);
  return `${a}${b}${n}`;
}

const TIPS = [
  { id: "t1", text: "3 ways to save on electricity ⚡", detail: "Switch to LED bulbs, unplug idle chargers, and use smart thermostats." },
  { id: "t2", text: "Automate savings 💸", detail: "Set a monthly auto-transfer right after payday." },
  { id: "t3", text: "Budget 50/30/20 📊", detail: "Needs 50%, Wants 30%, Savings 20% as a starting guideline." },
];

const CHALLENGES = [
  { id: "c1", title: "No Takeout Week", period: "Weekly", reward: "Save SAR 120+" },
  { id: "c2", title: "Commute Smart", period: "Monthly", reward: "Carpool/Transit 10 days" },
  { id: "c3", title: "30-Day Pantry Challenge", period: "Monthly", reward: "Use what you have first" },
];

export default function CommunityScreen() {
  const [nickname, setNickname] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const s = await loadSettings();
      if (!s.nickname) {
        const nick = generateNickname();
        const next = { ...s, nickname: nick };
        setNickname(nick);
        await saveSettings(next);
      } else {
        setNickname(s.nickname);
      }
    };
    init();
  }, []);

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView style={{ padding: 16 }}>
        <YStack space="$4">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$8" fontWeight="bold" color="$color">Community</Text>
            <View backgroundColor="$gray8" padding="$2" borderRadius="$2" borderWidth={1} borderColor="$borderColor">
              <Text color="$gray11">You are: {nickname}</Text>
            </View>
          </XStack>

          <YStack space="$3">
            <Text fontSize="$6" fontWeight="700" color="$color">Tips</Text>
            {TIPS.map((t) => (
              <View key={t.id} backgroundColor="$gray8" padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor">
                <Text color="$primary" fontWeight="700" fontSize="$5">{t.text}</Text>
                <Text color="$gray11" marginTop="$2">{t.detail}</Text>
              </View>
            ))}
          </YStack>

          <YStack space="$3">
            <Text fontSize="$6" fontWeight="700" color="$color">Challenges</Text>
            {CHALLENGES.map((c) => (
              <XStack key={c.id} backgroundColor="$gray8" padding="$4" borderRadius="$4" borderWidth={1} borderColor="$borderColor" justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text color="$color" fontWeight="700">{c.title}</Text>
                  <Text color="$gray11">{c.period} • {c.reward}</Text>
                </YStack>
                <Button backgroundColor="$primary" color="#ffffff">Join</Button>
              </XStack>
            ))}
          </YStack>
        </YStack>
      </ScrollView>
    </View>
  );
}


