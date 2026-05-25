"use client";

/**
 * Studio Lighting Setup
 * Optimized for Phong materials (max ~4 lights)
 * 
 * Performance optimizations:
 * - Reduced light count from 6 to 3 (was causing shader errors)
 * - Removed shadow map from directional light (expensive)
 * - Combined ambient + hemisphere effect into single ambient light
 * - Adjusted intensities for better visual balance
 */
export default function StudioLights() {
  return (
    <>
      {/* Main ambient light - provides base illumination */}
      <ambientLight intensity={0.3} color="#8b5cf6" />
      
      {/* Key light - main directional light */}
      <directionalLight
        position={[2, 5, 3]}
        intensity={0.6}
        color="#a855f7"
        castShadow={false} // Removed shadow to reduce shader complexity
      />
      
      {/* Fill light - secondary accent */}
      <pointLight
        position={[0, 2, 3]}
        intensity={0.4}
        color="#a855f7"
        distance={15}
        decay={2}
      />
      
      {/* Removed: pointLight at [0, 1, 2] - was causing shader compilation error */}
      {/* Removed: pointLight at [0, 0, 1] - was causing shader compilation error */}
      {/* Removed: hemisphereLight - now combined into ambient light */}
    </>
  );
}
