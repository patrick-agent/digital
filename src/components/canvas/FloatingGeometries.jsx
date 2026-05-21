"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GEOMETRIES = [
  { geom: new THREE.IcosahedronGeometry(1, 0), label: "ico" },
  { geom: new THREE.OctahedronGeometry(1, 0), label: "oct" },
  { geom: new THREE.TorusGeometry(1, 0.4, 8, 16), label: "torus" },
  { geom: new THREE.TetrahedronGeometry(1, 0), label: "tetra" },
  { geom: new THREE.BoxGeometry(1, 1, 1), label: "box" },
];

export default function FloatingGeometries({
  count = 8,
  color = "#a855f7",
  spread = 15,
  size = 0.3,
}) {
  const groupRef = useRef();

  const items = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const g = GEOMETRIES[i % GEOMETRIES.length];
      temp.push({
        geometry: g.geom,
        position: [
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread * 0.6,
          (Math.random() - 0.5) * spread * 0.5 - 5,
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
        speed: 0.1 + Math.random() * 0.3,
        scale: size + Math.random() * size * 0.5,
        phase: Math.random() * Math.PI * 2,
        emissive: Math.random() > 0.5,
      });
    }
    return temp;
  }, [count, spread, size]);

  const colorObj = useMemo(() => new THREE.Color(color), [color]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    groupRef.current.children.forEach((mesh, i) => {
      const item = items[i];
      if (!item) return;

      const floatY = Math.sin(time * item.speed + item.phase) * 0.5;
      const floatX = Math.cos(time * item.speed * 0.7 + item.phase) * 0.3;

      mesh.position.x = item.position[0] + floatX;
      mesh.position.y = item.position[1] + floatY;
      mesh.rotation.x += 0.003 * item.speed;
      mesh.rotation.y += 0.005 * item.speed;
      mesh.rotation.z += 0.002 * item.speed;
    });
  });

  return (
    <group ref={groupRef}>
      {items.map((item, i) => (
        <mesh
          key={i}
          geometry={item.geometry}
          position={item.position}
          rotation={item.rotation}
          scale={item.scale}
        >
          <meshPhysicalMaterial
            color={colorObj}
            metalness={0.3}
            roughness={0.4}
            transparent
            opacity={0.25}
            wireframe={i % 3 === 0}
            emissive={item.emissive ? new THREE.Color(color) : undefined}
            emissiveIntensity={item.emissive ? 0.15 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}
