"use client";

import { useRef, useState, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette, DepthOfField } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

function SafeEffectComposer({ children, multisampling = 4 }) {
  const gl = useThree((state) => state.gl);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (gl && gl.getContext()) {
      const timer = setTimeout(() => setReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [gl]);

  if (!ready) return null;

  try {
    return (
      <EffectComposer multisampling={multisampling} disableNormalPass>
        {children}
      </EffectComposer>
    );
  } catch {
    return null;
  }
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
