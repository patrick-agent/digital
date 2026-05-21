"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleField({
  count = 120,
  color = "#a855f7",
  spread = 25,
  speed = 0.3,
  size = 0.04,
  mouseReactive = true,
  opacity = 0.5,
  depth = 0,
}) {
  const mesh = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        x: (Math.random() - 0.5) * spread,
        y: (Math.random() - 0.5) * spread,
        z: (Math.random() - 0.5) * spread + depth,
        speed: speed + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        originalX: (Math.random() - 0.5) * spread,
      });
    }
    return temp;
  }, [count, spread, speed, depth]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.getElapsedTime();

    if (mouseReactive) {
      mouse.current.x += (state.pointer.x - mouse.current.x) * 0.05;
      mouse.current.y += (state.pointer.y - mouse.current.y) * 0.05;
    }

    particles.forEach((p, i) => {
      const yOffset = Math.sin(time * p.speed + p.phase) * 1.5;
      const xOffset = Math.cos(time * p.speed * 0.7 + p.phase) * 0.5;
      const mouseOffsetX = mouseReactive ? mouse.current.x * (3 + depth * 0.3) : 0;
      const mouseOffsetY = mouseReactive ? mouse.current.y * (2 + depth * 0.2) : 0;

      dummy.position.set(
        p.originalX + xOffset + mouseOffsetX,
        p.y + yOffset + mouseOffsetY,
        p.z + Math.sin(time * p.speed * 0.5) * 0.5
      );
      dummy.scale.setScalar(size + Math.sin(time * p.speed + p.phase) * 0.02);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, particles.length]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={colorObj} transparent opacity={opacity} />
    </instancedMesh>
  );
}
