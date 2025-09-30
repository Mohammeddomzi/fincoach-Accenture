import React from "react";
import { View, Text } from "react-native";
import Logo from "./Logo";

export default function HeaderLogo() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Logo width={28} height={28} />
      <Text style={{ color: "$primary", fontWeight: "800", fontSize: 18, marginLeft: 8 }}>
        FinCoach
      </Text>
    </View>
  );
}


