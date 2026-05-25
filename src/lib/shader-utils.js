/**
 * Three.js Shader Error Debugging & Solutions
 * Handles WebGL shader compilation errors
 */

import * as THREE from 'three';

/**
 * Enable shader debugging in development
 * Add this to your main scene component
 */
export function enableShaderDebug() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Show shader source when validation fails
    THREE.ShaderChunk['lights_fragment_begin'] = `
      #ifdef USE_LIGHT_PROBES
        vec3 lightProbeContribution = vec3( 0.0 );
        for ( int i = 0; i < NUM_LIGHT_PROBES; i ++ ) {
          lightProbeContribution += lightsProbe[ i ];
        }
        directDiffuse += lightProbeContribution;
      #endif
    `;

    console.log('[Three.js Debug] Shader debugging enabled');
  }
}

/**
 * Create error boundary for shader compilation
 */
export class ShaderErrorBoundary {
  constructor() {
    this.errorLog = [];
    this.setupErrorHandler();
  }

  setupErrorHandler() {
    const originalError = console.error;
    console.error = (...args) => {
      const errorStr = args.join(' ');
      
      if (errorStr.includes('WebGLProgram') || errorStr.includes('Shader')) {
        this.errorLog.push({
          timestamp: new Date(),
          error: errorStr,
          stack: new Error().stack,
        });
        
        console.warn('[Shader Error Detected]', {
          message: errorStr,
          logged: this.errorLog.length,
        });
      }
      
      originalError.apply(console, args);
    };
  }

  getErrors() {
    return this.errorLog;
  }

  clearErrors() {
    this.errorLog = [];
  }
}

/**
 * Material validation helper
 */
export function validateMaterial(material) {
  const issues = [];

  if (!material) {
    issues.push('Material is null or undefined');
    return issues;
  }

  // Check common issues
  if (material.map && !material.map.source) {
    issues.push('Texture map missing source');
  }

  if (material.lights === undefined) {
    issues.push('Material.lights property not set (may affect shaders)');
  }

  if (material.side === undefined) {
    issues.push('Material.side not defined (default: FrontSide)');
  }

  // Phong-specific checks
  if (material instanceof THREE.MeshPhongMaterial) {
    if (!material.color) {
      issues.push('MeshPhongMaterial: color not set');
    }
    if (material.shininess < 0 || material.shininess > 100) {
      issues.push(`MeshPhongMaterial: shininess out of range (${material.shininess})`);
    }
  }

  return issues;
}

/**
 * Fix common shader issues
 */
export function createSafePhongMaterial(config = {}) {
  return new THREE.MeshPhongMaterial({
    color: config.color || 0xffffff,
    emissive: config.emissive || 0x000000,
    shininess: config.shininess ?? 100,
    side: config.side || THREE.FrontSide,
    flatShading: config.flatShading ?? false,
    wireframe: config.wireframe ?? false,
    // Important: explicitly set these for better compatibility
    fog: true,
    lights: true,
    ...config,
  });
}

/**
 * Fallback material for failed shaders
 */
export function createFallbackMaterial() {
  return new THREE.MeshBasicMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
    wireframe: process.env.NODE_ENV === 'development',
  });
}

/**
 * Model loading with shader error handling
 */
export async function loadModelSafely(path, onError) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
  } catch (error) {
    console.error('[Model Loading Error]', error);
    if (onError) onError(error);
    return null;
  }
}

/**
 * Check WebGL capabilities and limits
 */
export function checkWebGLLimits(renderer) {
  const limits = {
    maxLights: renderer.capabilities.maxLights,
    maxTextures: renderer.capabilities.maxTextures,
    maxCubemapSize: renderer.capabilities.maxCubemapSize,
    maxTextureSize: renderer.capabilities.maxTextureSize,
    isWebGL2: renderer.capabilities.isWebGL2,
    vertexShaders: renderer.getContext().getParameter(
      renderer.getContext().MAX_VERTEX_UNIFORM_VECTORS
    ),
    fragmentShaders: renderer.getContext().getParameter(
      renderer.getContext().MAX_FRAGMENT_UNIFORM_VECTORS
    ),
  };

  console.log('[WebGL Limits]', limits);
  return limits;
}

/**
 * Reduce shader complexity for low-end devices
 */
export function createDeviceOptimizedMaterial(deviceType, baseConfig = {}) {
  const baseColor = baseConfig.color || 0xffffff;

  if (deviceType === 'mobile') {
    // Minimal shader complexity
    return new THREE.MeshLambertMaterial({
      color: baseColor,
      emissive: baseConfig.emissive || 0x000000,
      side: THREE.DoubleSide,
      fog: true,
      flatShading: true,
    });
  }

  if (deviceType === 'tablet') {
    // Medium complexity
    return new THREE.MeshPhongMaterial({
      color: baseColor,
      emissive: baseConfig.emissive || 0x000000,
      shininess: 25,
      side: THREE.DoubleSide,
      fog: true,
      lights: true,
    });
  }

  // Desktop: full quality
  return new THREE.MeshPhongMaterial({
    color: baseColor,
    emissive: baseConfig.emissive || 0x000000,
    shininess: baseConfig.shininess ?? 100,
    side: THREE.DoubleSide,
    fog: true,
    lights: true,
    ...baseConfig,
  });
}
