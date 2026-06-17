"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededBetween, seededUnit } from "@/lib/seeded-random";

export default function TeleportBeam({ color = "#c084fc", height = 50, radius = 26 }) {
  const beamRef = useRef();
  const glowRef = useRef();
  const sparklesRef = useRef();

  const sparkles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 30; i++) {
      arr.push({
        progress: seededUnit(i * 6 + 1),
        angle: seededBetween(i * 6 + 2, 0, Math.PI * 2),
        radius: radius * seededBetween(i * 6 + 3, 0.3, 1),
        speed: seededBetween(i * 6 + 4, 0.3, 0.8),
        size: seededBetween(i * 6 + 5, 0.05, 0.15),
        phase: seededBetween(i * 6 + 6, 0, Math.PI * 2),
      });
    }
    return arr;
  }, [radius]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (beamRef.current) {
      beamRef.current.material.uniforms.uTime.value = t;
    }

    if (glowRef.current) {
      glowRef.current.material.uniforms.uTime.value = t;
    }

    if (sparklesRef.current) {
      const dummy = new THREE.Object3D();
      sparkles.forEach((s, i) => {
        s.progress += delta * s.speed;
        if (s.progress > 1) s.progress = 0;
        dummy.position.set(
          Math.cos(s.angle + t * 0.5) * s.radius,
          s.progress * height,
          Math.sin(s.angle + t * 0.5) * s.radius
        );
        dummy.scale.setScalar(s.size + Math.sin(t * s.speed + s.phase) * 0.03);
        dummy.updateMatrix();
        sparklesRef.current.setMatrixAt(i, dummy.matrix);
      });
      sparklesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  return (
    <group>
      {/* Main beam - funnel shape: narrower at bottom, wider at top */}
      <mesh ref={beamRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[28, 26, height, 32, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: colorObj },
            uHeight: { value: height },
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
            uniform vec3 uColor;
            uniform float uHeight;
            varying vec2 vUv;

            void main() {
              float fadeOut = 1.0 - vUv.y;
              fadeOut = pow(fadeOut, 1.5);
              float pulse = 0.7 + 0.3 * sin(vUv.y * 15.0 - uTime * 2.0);
              float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
              edge = pow(edge, 2.0);
              float alpha = fadeOut * pulse * edge * 0.5;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>

      {/* Glow layer */}
      <mesh ref={glowRef} position={[0, height / 2, 0]}>
        <cylinderGeometry args={[30, 28, height * 1.02, 32, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uColor: { value: colorObj },
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
            uniform vec3 uColor;
            varying vec2 vUv;
            void main() {
              float fadeOut = 1.0 - vUv.y;
              fadeOut = pow(fadeOut, 2.0);
              float alpha = fadeOut * 0.25;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>

      {/* Core center light */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, radius * 0.3, 1, 16]} />
        <meshBasicMaterial color={colorObj} transparent opacity={0.6} />
      </mesh>

      {/* Base glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
        <ringGeometry args={[0.5, radius, 32]} />
        <meshBasicMaterial
          color={colorObj}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Rising sparkles */}
      <instancedMesh ref={sparklesRef} args={[null, null, sparkles.length]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial color={colorObj} transparent opacity={0.7} />
      </instancedMesh>

      {/* Point light */}
      <pointLight position={[0, 2, 0]} intensity={1.5} color={colorObj} distance={height * 1.5} decay={2} />
    </group>
  );
}
