"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AuroraBackground({ className, isMobile = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isMobile, canvas });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(
      -1,
      1,
      1,
      -1,
      0.1,
      10
    );
    camera.position.z = 1;

    // Aurora shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float uTime;
      varying vec2 vUv;
      
      // Noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float turbulence(vec2 p) {
        float w = 100.0;
        float t = -.5;
        for (float f = 1.0; f <= w; f++) {
          float power = pow(2.0, f);
          t += abs(noise(vec2(power * p)) / power);
        }
        return t;
      }
      
      void main() {
        vec2 uv = vUv;
        uv.y *= 0.5;
        uv.y += 0.25;
        
        float n = turbulence(uv * 3.0 + uTime * 0.1);
        n += turbulence(uv * 6.0 + uTime * 0.15) * 0.5;
        n += turbulence(uv * 12.0 + uTime * 0.2) * 0.25;
        
        // Aurora colors - purple/pink to match site theme
        vec3 color1 = vec3(0.4, 0.0, 0.6); // deep purple
        vec3 color2 = vec3(0.8, 0.3, 0.7); // pink
        vec3 color3 = vec3(0.9, 0.5, 0.8); // light pink
        
        vec3 color = mix(color1, color2, smoothstep(0.4, 0.6, n));
        color = mix(color, color3, smoothstep(0.5, 0.7, n * 1.2));
        
        // Vertical gradient
        float vGrad = uv.y;
        color *= vec3(0.5 + vGrad * 0.5);
        
        // Add some motion
        float wave = sin(uv.y * 10.0 + uTime * 0.5) * 0.1;
        color += vec3(wave * 0.3, wave * 0.2, wave * 0.4);
        
        gl_FragColor = vec4(color, 0.6);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
      },
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      material.uniforms.uTime.value = elapsedTime;
      renderer.render(scene, camera);
    }

    animate();

    // Handle resize
    function onWindowResize() {
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.left = -1;
      camera.right = 1;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("resize", onWindowResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.isMesh) {
          geometry.dispose();
          material.dispose();
        }
      });
    };
  }, [isMobile]);

  return <div ref={containerRef} className={className} />;
}