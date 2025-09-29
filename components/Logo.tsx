import React from "react";
import Svg, { G, Path, Rect, Defs, LinearGradient, Stop } from "react-native-svg";

interface LogoProps {
  width?: number;
  height?: number;
  primaryColor?: string; // maps to theme primary
  accentColor?: string; // maps to theme accent
}

export default function Logo({
  width = 40,
  height = 40,
  primaryColor = "#4f7f8c",
  accentColor = "#b9dae9",
}: LogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      <Defs>
        <LinearGradient id="brainGrad" x1="0" y1="0" x2="64" y2="64">
          <Stop offset="0%" stopColor={accentColor} stopOpacity="1" />
          <Stop offset="100%" stopColor={primaryColor} stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Wallet base */}
      <Rect x="8" y="22" rx="6" ry="6" width="48" height="30" fill={primaryColor} />
      <Rect x="8" y="18" rx="6" ry="6" width="40" height="8" fill={primaryColor} />

      {/* Wallet clasp */}
      <Rect x="44" y="30" rx="3" ry="3" width="12" height="8" fill={accentColor} />

      {/* Brain overlay (stylized) */}
      <G opacity={0.95}>
        <Path
          d="M24 14c-4 0-7 3-7 7 0 .7.1 1.4.3 2.1C15.8 24.1 14 26.8 14 30c0 4.4 3.6 8 8 8h4v-2c0-1.7 1.3-3 3-3s3 1.3 3 3v2h2c4.4 0 8-3.6 8-8 0-2-.7-3.8-1.9-5.1.6-.9.9-2 .9-3.1 0-3.9-3.1-7-7-7-1.1 0-2.1.3-3 .8-1.1-1.6-2.9-2.6-5-2.6Z"
          fill="url(#brainGrad)"
        />
      </G>
    </Svg>
  );
}


