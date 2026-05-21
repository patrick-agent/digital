"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GlowBackground({ color = "#a855f7", secondaryColor = "#6366f1", intensity = 1, radius = 25 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.material.uniforms.uTime.value = t;
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} scale={[radius, radius, 1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color) },
          uColor2: { value: new THREE.Color(secondaryColor) },
          uIntensity: { value: intensity },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          uniform float uIntensity;
          varying vec2 vUv;

          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }

          void main() {
            vec2 uv = vUv;
            float d = distance(uv, vec2(0.5));
            float glow = exp(-d * d * 4.0);
            glow = glow * (0.8 + 0.2 * sin(uv.x * 10.0 + uv.y * 8.0 + uTime * 0.3));

            float n = noise(uv * 3.0 + uTime * 0.05) * 0.12;

            vec3 color = mix(uColor1, uColor2, uv.x * 0.6 + uv.y * 0.4 + sin(uTime * 0.15) * 0.1);
            color += n * uColor1;
            color *= (glow + 0.15) * uIntensity;

            float alpha = glow * 0.8 + n * 0.1 + 0.05;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}
