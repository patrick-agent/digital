"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CameraParallax() {
  const camera = useThree((state) => state.camera);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const basePosRef = useRef(new THREE.Vector3(1.5, 1.25, 0.5));
  const maxOffsetRef = useRef(new THREE.Vector3(0.15, 0.125, 0.05));

  useEffect(() => {
    if (!camera) return;
    camera.position.copy(basePosRef.current);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = THREE.MathUtils.degToRad(40);
    camera.rotation.x = THREE.MathUtils.degToRad(-15);
    camera.rotation.z = THREE.MathUtils.degToRad(5);

    const handleMouseMove = (event) => {
      mouseRef.current.x = event.clientX / window.innerWidth;
      mouseRef.current.y = event.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera]);

  useFrame((_, delta) => {
    const smoothFactor = Math.min(delta * 4, 1);
    smoothMouse.current.x += (mouseRef.current.x - smoothMouse.current.x) * smoothFactor;
    smoothMouse.current.y += (mouseRef.current.y - smoothMouse.current.y) * smoothFactor;

    const offsetFactor = (smoothMouse.current.x - 0.5) * 2;
    const offsetFactorY = (smoothMouse.current.y - 0.5) * 2;
    const mx = basePosRef.current.x + (offsetFactor * maxOffsetRef.current.x);
    const my = basePosRef.current.y + (offsetFactorY * maxOffsetRef.current.y);
    const mz = basePosRef.current.z + (offsetFactor * maxOffsetRef.current.z * 0.5);

    camera.position.x += (mx - camera.position.x) * smoothFactor;
    camera.position.y += (my - camera.position.y) * smoothFactor;
    camera.position.z += (mz - camera.position.z) * smoothFactor;
  });

  return null;
}

import StudioModel from "./StudioModel";
import StudioLights from "./StudioLights";
import PostProcessing from "./PostProcessing";
import GlowBackground from "./GlowBackground";
import { useCanvasOptimizer } from "@/hooks/useCanvasOptimizer";

export default function StudioCanvas() {
  const { isVisible, devicePixelRatio, getResponsiveFov, getPostProcessingConfig } = useCanvasOptimizer({
    pixelRatioCap: 2,
    mobilePixelRatioCap: 1.5,
  });

  const ppConfig = getPostProcessingConfig();

  return (
    <Canvas
      style={{ width: '100%', height: '100vh' }}
      camera={{
        position: [1.5, 1.25, 0.5],
        fov: getResponsiveFov(50),
        near: 0.1,
        far: 100,
      }}
      gl={{
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      dpr={devicePixelRatio}
      frameloop={isVisible ? "always" : "demand"}
      scene={{
        background: new THREE.Color('#1a0f2e'),
        fog: new THREE.Fog('#1a0f2e', 1.5, 10),
      }}
    >
      <GlowBackground color="#7e22ce" secondaryColor="#4c1d95" intensity={0.3} radius={1.5} />
      <StudioLights />
      <CameraParallax />
      <StudioModel />
      {isVisible && (
        <PostProcessing
          bloomIntensity={ppConfig.bloomIntensity || 0.3}
          noiseOpacity={ppConfig.noiseOpacity || 0.015}
          vignetteDarkness={ppConfig.vignetteDarkness || 0.5}
          bloom={ppConfig.bloom}
          noise={ppConfig.noise}
          chromaticAberration={ppConfig.chromaticAberration}
          vignette={ppConfig.vignette}
        />
      )}
    </Canvas>
  );
}
