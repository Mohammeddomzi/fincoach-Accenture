import React from "react";
import Svg, { Path, Rect, LinearGradient, Stop, Defs } from "react-native-svg";

interface GhostChartProps {
  width?: number;
  height?: number;
}

export default function GhostChart({ width = 320, height = 160 }: GhostChartProps) {
  const stroke = "#7ca2b1";
  const fill = "#b9dae9";

  return (
    <Svg width={width} height={height} viewBox="0 0 320 160" fill="none">
      <Defs>
        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={fill} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={fill} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="320" height="160" fill="transparent" />
      <Path
        d="M0 120 C 40 80, 80 140, 120 100 C 160 60, 200 110, 240 90 C 280 70, 320 90, 320 90"
        stroke={stroke}
        strokeWidth="3"
        opacity="0.6"
        fill="none"
      />
      <Path
        d="M0 120 C 40 80, 80 140, 120 100 C 160 60, 200 110, 240 90 C 280 70, 320 90, 320 160 L 0 160 Z"
        fill="url(#fade)"
        opacity="0.8"
      />
    </Svg>
  );
}


