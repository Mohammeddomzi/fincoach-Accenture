import React from "react";
import Svg, { Path, Circle, Rect } from "react-native-svg";

interface EmptyIllustrationProps {
  type?: "piggy" | "target" | "trophy";
  width?: number;
  height?: number;
  primaryColor?: string;
  accentColor?: string;
}

export default function EmptyIllustration({
  type = "piggy",
  width = 160,
  height = 120,
  primaryColor = "#4f7f8c",
  accentColor = "#b9dae9",
}: EmptyIllustrationProps) {
  if (type === "target") {
    return (
      <Svg width={width} height={height} viewBox="0 0 160 120" fill="none">
        <Circle cx="80" cy="60" r="40" stroke={accentColor} strokeWidth="6" opacity={0.5} />
        <Circle cx="80" cy="60" r="25" stroke={primaryColor} strokeWidth="6" opacity={0.6} />
        <Circle cx="80" cy="60" r="10" fill={primaryColor} opacity={0.9} />
        <Path d="M100 45 L135 30" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
        <Path d="M130 28 L135 30 L133 35" stroke={primaryColor} strokeWidth="6" strokeLinecap="round" />
      </Svg>
    );
  }

  if (type === "trophy") {
    return (
      <Svg width={width} height={height} viewBox="0 0 160 120" fill="none">
        <Rect x="50" y="20" width="60" height="35" rx="10" fill={primaryColor} opacity={0.9} />
        <Path d="M50 28 C35 30, 35 55, 55 55" stroke={accentColor} strokeWidth="6" />
        <Path d="M110 28 C125 30, 125 55, 105 55" stroke={accentColor} strokeWidth="6" />
        <Rect x="70" y="55" width="20" height="12" fill={primaryColor} />
        <Rect x="60" y="70" width="40" height="10" fill={accentColor} opacity={0.7} />
        <Rect x="50" y="82" width="60" height="10" rx="4" fill={primaryColor} opacity={0.8} />
      </Svg>
    );
  }

  // piggy
  return (
    <Svg width={width} height={height} viewBox="0 0 160 120" fill="none">
      <Path d="M30 80 C25 65, 35 45, 60 40 C90 30, 120 45, 115 70 C110 90, 80 95, 60 90 C50 95, 45 95, 40 90" fill={accentColor} opacity={0.3} />
      <Path d="M35 80 C30 65, 40 45, 65 42 C92 34, 118 45, 112 68 C108 86, 82 90, 65 87 C55 92, 48 92, 43 87" fill={primaryColor} opacity={0.85} />
      <Circle cx="95" cy="62" r="4" fill="#0a0a0a" />
      <Rect x="70" y="50" width="18" height="4" rx="2" fill="#0a0a0a" opacity={0.5} />
    </Svg>
  );
}


