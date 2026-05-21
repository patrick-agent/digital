"use client";

export default function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.1} color="#6a1b9a" />
      <directionalLight
        position={[2, 5, 3]}
        intensity={0.15}
        color="#9966dd"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <pointLight
        position={[0, 2, 3]}
        intensity={0.8}
        color="#a855f7"
        distance={12}
        decay={2}
      />
      <pointLight
        position={[0, 1, 2]}
        intensity={0.5}
        color="#8b5cf6"
        distance={10}
        decay={2}
      />
      <pointLight
        position={[0, 0, 1]}
        intensity={0.3}
        color="#7c3aed"
        distance={6}
        decay={2}
      />
      <hemisphereLight
        skyColor="#6d28d9"
        groundColor="#0f0a1a"
        intensity={0.2}
      />
    </>
  );
}
