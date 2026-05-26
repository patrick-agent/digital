/**
 * WebGL Error Detection and Recovery
 * Detects WebGL context issues and provides fallback handling
 */

export class WebGLDetector {
  static canUseWebGL() {
    if (typeof document === 'undefined') return true; // Assume true on server

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return !!gl;
    } catch (e) {
      console.warn('WebGL detection failed:', e.message);
      return false;
    }
  }

  static getWebGLInfo() {
    if (typeof document === 'undefined') return null;

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        vendor: debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown',
        renderer: debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown',
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
      };
    } catch (e) {
      console.warn('Failed to get WebGL info:', e.message);
      return null;
    }
  }

  static setupErrorHandler() {
    if (typeof window === 'undefined') return;

    // Global error handler for WebGL errors
    const originalError = console.error;
    console.error = function (...args) {
      const errorStr = args.join(' ');
      if (errorStr.includes('WebGL') || errorStr.includes('context')) {
        console.warn('[WebGL Error Intercepted]', errorStr);
        // Don't throw the error, just log it
      } else {
        originalError.apply(console, args);
      }
    };

    // Handle WebGL context loss
    if (typeof document !== 'undefined') {
      document.addEventListener('webglcontextlost', (event) => {
        console.warn('WebGL context lost');
        event.preventDefault();
      }, false);

      document.addEventListener('webglcontextrestored', () => {
        console.log('WebGL context restored');
      }, false);
    }
  }

  static shouldDisableWebGL() {
    // Disable WebGL on very low-end devices
    if (typeof navigator === 'undefined') return false;

    const memory = navigator.deviceMemory || 4;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

    return isMobile && memory <= 2;
  }
}

export default WebGLDetector;
