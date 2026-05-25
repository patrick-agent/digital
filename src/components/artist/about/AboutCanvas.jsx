"use client";

import DotField from "@/components/canvas/DotField";

export default function AboutCanvas() {
  return (
    <DotField
      dotRadius={2.5}
      dotSpacing={14}
      bulgeStrength={67}
      glowRadius={200}
      gradientFrom="rgba(168, 85, 247, 0.2)"
      gradientTo="rgba(180, 151, 207, 0.4)"
      sparkle={false}
      waveAmplitude={0}
    />
  );
}
