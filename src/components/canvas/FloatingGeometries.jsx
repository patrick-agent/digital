"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { seededBetween, seededUnit } from "@/lib/seeded-random";

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
          seededBetween(i * 8 + 1, -spread / 2, spread / 2),
          seededBetween(i * 8 + 2, -(spread * 0.3), spread * 0.3),
          seededBetween(i * 8 + 3, -(spread * 0.25) - 5, spread * 0.25 - 5),
        ],
        rotation: [seededBetween(i * 8 + 4, 0, Math.PI), seededBetween(i * 8 + 5, 0, Math.PI), 0],
        speed: seededBetween(i * 8 + 6, 0.1, 0.4),
        scale: seededBetween(i * 8 + 7, size, size * 1.5),
        phase: seededBetween(i * 8 + 8, 0, Math.PI * 2),
        emissive: seededUnit(i * 8 + 9) > 0.5,
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
