/**
 * Device Detection and Mobile Optimization Utilities
 * Provides device-aware configurations for 3D rendering and model loading
 */

export function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';
  const w = window.innerWidth;
  if (w < 640) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

export function getDeviceMemory() {
  if (typeof navigator === 'undefined') return 4; // Default to 4GB
  return navigator.deviceMemory || 4;
}

export function getConnectionType() {
  if (typeof navigator === 'undefined') return '4g';
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  return connection?.effectiveType || '4g';
}

export function isSlowNetwork() {
  const connection = getConnectionType();
  return connection === 'slow-2g' || connection === '2g' || connection === '3g';
}

export function isLowMemoryDevice() {
  return getDeviceMemory() <= 2;
}

export function getModelLoadingStrategy() {
  const deviceType = getDeviceType();
  const memory = getDeviceMemory();
  const connection = getConnectionType();

  // Low memory or slow network = minimal models
  if ((memory <= 2 && deviceType === 'mobile') || (isSlowNetwork() && deviceType === 'mobile')) {
    return {
      strategy: 'minimal',
      maxModels: 1,
      textureQuality: 'low',
      enableAnimations: false,
      enableParticles: false,
    };
  }

  // Mobile with decent memory/network
  if (deviceType === 'mobile') {
    return {
      strategy: 'mobile',
      maxModels: 2,
      textureQuality: 'medium',
      enableAnimations: true,
      enableParticles: false,
    };
  }

  // Tablet
  if (deviceType === 'tablet') {
    return {
      strategy: 'tablet',
      maxModels: 3,
      textureQuality: 'high',
      enableAnimations: true,
      enableParticles: true,
    };
  }

  // Desktop
  return {
    strategy: 'desktop',
    maxModels: 7,
    textureQuality: 'ultra',
    enableAnimations: true,
    enableParticles: true,
  };
}

export function getCanvasConfig() {
  const deviceType = getDeviceType();
  const connection = getConnectionType();
  const isSlow = isSlowNetwork();

  const baseConfig = {
    alpha: true,
    powerPreference: 'low-power',
    antialias: deviceType !== 'mobile',
    preserveDrawingBuffer: false,
    failIfMajorPerformanceCaveat: true,
    stencil: false,
    depth: true,
  };

  if (deviceType === 'mobile' || isSlow) {
    return {
      ...baseConfig,
      antialias: false,
    };
  }

  return baseConfig;
}

export function getLoadingTimeout() {
  const connection = getConnectionType();
  const deviceType = getDeviceType();

  // Base timeout
  let timeout = 8000;

  // Add time for slow networks
  if (connection === 'slow-2g') timeout = 15000;
  else if (connection === '2g') timeout = 12000;
  else if (connection === '3g') timeout = 10000;

  // Add time for mobile
  if (deviceType === 'mobile') timeout += 2000;

  return timeout;
}

export function shouldSkipComponent(componentType) {
  const deviceType = getDeviceType();
  const memory = getDeviceMemory();
  const connection = getConnectionType();

  // Skip heavy components on low-end mobile
  if (deviceType === 'mobile' && (memory <= 2 || isSlowNetwork())) {
    return ['canvas', 'particles', 'effects'].includes(componentType);
  }

  return false;
}

export function getParticleCount(baseCount = 100) {
  const deviceType = getDeviceType();
  const memory = getDeviceMemory();

  if (memory <= 2 || deviceType === 'mobile') return Math.floor(baseCount * 0.1);
  if (deviceType === 'mobile') return Math.floor(baseCount * 0.25);
  if (deviceType === 'tablet') return Math.floor(baseCount * 0.5);

  return baseCount;
}

export function getDPRConfig() {
  const deviceType = getDeviceType();

  if (deviceType === 'mobile') return [1, 1];
  if (deviceType === 'tablet') return [1, 1.5];

  return [1, 2];
}

export function getTextureSize() {
  const { textureQuality } = getModelLoadingStrategy();

  const sizes = {
    low: 512,
    medium: 1024,
    high: 2048,
    ultra: 4096,
  };

  return sizes[textureQuality] || 2048;
}
