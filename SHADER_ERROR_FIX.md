# Three.js Shader Error - Debugging & Fix Guide

## 🔴 Error Analysis

Your error:
```
THREE.THREE.WebGLProgram: Shader Error 0 - VALIDATE_STATUS false
Material Name: tripo_mat_a2300323
Material Type: MeshPhongMaterial
```

This means **a shader failed to compile/validate** on your GPU during runtime.

---

## 🔍 Common Causes

### 1. **Too Many Lights** (Most Common)
MeshPhongMaterial has limits on how many lights it can handle.

**Solution:**
```javascript
// Limit lights in scene
scene.children = scene.children.filter(child => {
  return !(child instanceof THREE.Light) || 
         (scene.children.filter(c => c instanceof THREE.Light).length < 4);
});
```

### 2. **GPU Driver/WebGL Incompatibility**
Some GPUs or drivers have shader compilation issues.

**Solution:**
```javascript
import { createDeviceOptimizedMaterial } from '@/lib/shader-utils';

// Use simpler material on problematic GPU
const material = createDeviceOptimizedMaterial('desktop');
```

### 3. **Model Material Misconfiguration**
The model (tripo_mat_a2300323) has a broken material reference.

**Solution:**
- Check the 3D model file
- Re-export from 3D software with compatible settings
- Or override materials after loading

### 4. **Texture Issues**
A texture might be missing or invalid.

**Solution:**
```javascript
if (!material.map) {
  material.map = null; // Ensure no broken texture reference
}
```

---

## 🔧 Immediate Fixes to Try

### Option 1: Enable Shader Debugging
Add this to your component that renders 3D:

```javascript
import { enableShaderDebug, ShaderErrorBoundary } from '@/lib/shader-utils';

export default function YourCanvas() {
  useEffect(() => {
    enableShaderDebug();
    const boundary = new ShaderErrorBoundary();
  }, []);

  // Rest of component...
}
```

### Option 2: Override Problematic Material
```javascript
import { createFallbackMaterial } from '@/lib/shader-utils';

function CustomModel({ scene }) {
  useEffect(() => {
    // Find and replace problematic material
    scene.traverse((node) => {
      if (node.name === 'tripo_mat_a2300323' || 
          node.material?.name === 'tripo_mat_a2300323') {
        node.material = createFallbackMaterial();
      }
    });
  }, [scene]);

  return null;
}
```

### Option 3: Reduce Light Count
```javascript
// In your canvas/scene setup
<StudioLights maxLights={2} /> // Limit to 2 lights instead of many
```

### Option 4: Use Lambert Material (Simpler)
```javascript
import { createDeviceOptimizedMaterial } from '@/lib/shader-utils';

// Instead of MeshPhongMaterial
const material = createDeviceOptimizedMaterial('desktop');
```

---

## 🔎 Which File is Causing This?

Find where the problematic model is loaded. Look for:

```bash
# Search for component using the model
grep -r "tripo_mat" src/

# Or search for the file that loads it
grep -r "glb\|gltf\|fbx" src/components/canvas/
```

Common locations:
- `src/components/canvas/StudioModel.jsx`
- `src/components/canvas/StudioCanvas.jsx`
- `src/components/canvas/CharacterCanvas.jsx`

---

## 📝 Step-by-Step Fix

### Step 1: Identify Component
```bash
cd "C:\Users\Admin\Desktop\Website 3D\studio-3d"
grep -r "tripo_mat\|home-studio" src/
```

### Step 2: Find the Model File
Usually in `public/models/`:
```bash
ls public/models/
# Look for: home-studio*.glb, studio*.glb, etc.
```

### Step 3: Check Material Configuration
```javascript
// In the component that loads the model
import { useGLTF } from '@react-three/drei';
import { validateMaterial } from '@/lib/shader-utils';

export default function StudioModel() {
  const { scene } = useGLTF('/models/home-studio-1k.glb');

  useEffect(() => {
    scene.traverse((node) => {
      if (node.material) {
        const issues = validateMaterial(node.material);
        if (issues.length > 0) {
          console.warn(`Material issues in ${node.name}:`, issues);
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
```

### Step 4: Apply Fix
```javascript
import { createFallbackMaterial } from '@/lib/shader-utils';

export default function StudioModel() {
  const { scene } = useGLTF('/models/home-studio-1k.glb');

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        try {
          // Try to validate and fix material
          if (node.material.name === 'tripo_mat_a2300323') {
            console.log('Replacing problematic material...');
            node.material = createFallbackMaterial();
          }
        } catch (error) {
          console.error('Failed to fix material:', error);
          node.material = createFallbackMaterial();
        }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
}
```

---

## 🚨 If Problem Persists

### Check Your GPU
Open Chrome → `chrome://gpu/` and check:
- ✅ WebGL: Hardware accelerated
- ✅ WebGL2: Hardware accelerated
- ❌ Any problems listed

### Reduce Shader Complexity
```javascript
// Use simpler material instead of Phong
const material = new THREE.MeshLambertMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  fog: true,
});
```

### Check Browser Console
Open DevTools → Console tab and look for:
- Additional shader errors
- WebGL context lost errors
- Memory warnings

### Test on Different Browser
Try Firefox or Safari to see if issue is Chrome-specific.

---

## 📊 Debug Information to Collect

When reporting this issue, collect:

```javascript
import { checkWebGLLimits } from '@/lib/shader-utils';

// In your component
useEffect(() => {
  const renderer = useThree((state) => state.gl);
  const limits = checkWebGLLimits(renderer);
  console.log('WebGL Limits:', limits);
  // Check console for max lights, textures, etc.
}, []);
```

---

## ✅ Verification

After applying fix:

1. **Clear cache**: `npm run build` (rebuilds .next)
2. **Test in dev**: `npm run dev` (should not see shader error)
3. **Check console**: No red errors about WebGLProgram
4. **Test 3D**: Scene renders properly without glitches

---

## 🎯 Quick Checklist

- [ ] Identified which component loads the problematic model
- [ ] Checked material configuration
- [ ] Applied one of the fixes above
- [ ] Verified error is gone
- [ ] Tested in development
- [ ] Checked on different browsers/GPUs if needed

---

## 📚 Resources

- [Three.js Material Docs](https://threejs.org/docs/#api/en/materials/Material)
- [WebGL Debugging](https://www.khronos.org/webgl/wiki/Debugging)
- [Chrome GPU Info](chrome://gpu/)
- [React Three Fiber Troubleshooting](https://docs.pmnd.rs/react-three-fiber/)

---

## Need Help?

1. **Check shader-utils.js** - Copy utility functions into your component
2. **Run debug checks** - enableShaderDebug() will log more info
3. **Try fallback material** - Temporarily use gray material to see if issue is shader-specific
4. **Check WebGL limits** - Some GPUs have stricter limits

The most likely fix is **Option 2: Override Problematic Material** - just replace that material with a simpler one.
