"use client";

import React from "react";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

class ComposerErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

function SafeEffectComposer({ children, multisampling = 4 }) {
  const gl = useThree((state) => state.gl);

  if (!gl) return null;

  const context = gl.getContext();
  if (!context) return null;

  if (!context.getContextAttributes) return null;

  const ctxAttrs = context.getContextAttributes();
  if (!ctxAttrs) return null;

  const composerKey = gl.uuid || "default-composer";

  return (
    <ComposerErrorBoundary>
      <EffectComposer key={composerKey} multisampling={multisampling}>
        {children}
      </EffectComposer>
    </ComposerErrorBoundary>
  );
}

export default function PostProcessing({
  bloomIntensity = 1.5,
  noiseOpacity = 0.035,
  vignetteDarkness = 0.6,
  enableDOF = false,
  bloom = true,
  noise = true,
  chromaticAberration = true,
  vignette = true,
}) {
  const hasAnyEffect = bloom || noise || chromaticAberration || vignette || enableDOF;

  if (!hasAnyEffect) return null;

  return (
    <SafeEffectComposer>
      {bloom && (
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.08}
          intensity={bloomIntensity}
          radius={0.5}
          mipmapBlur
        />
      )}
      {noise && (
        <Noise
          opacity={noiseOpacity}
          blendFunction={BlendFunction.ADD}
        />
      )}
      {vignette && (
        <Vignette
          darkness={vignetteDarkness}
          offset={0.4}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      {chromaticAberration && (
        <ChromaticAberration
          offset={[0.002, 0.002]}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
      {enableDOF && (
        <DepthOfField
          focusDistance={0.001}
          focalLength={0.02}
          bokehScale={2}
        />
      )}
    </SafeEffectComposer>
  );
}
