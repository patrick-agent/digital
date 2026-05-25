/**
 * React Component Performance Best Practices
 * A guide for writing performant React components in this project
 */

// ============================================
// 1. COMPONENT MEMOIZATION
// ============================================

// ✅ GOOD - Memoized to prevent unnecessary re-renders
import { memo, useMemo, useCallback } from 'react';

const OptimizedComponent = memo(function Component({ data, onUpdate }) {
  const memoizedValue = useMemo(() => {
    return expensiveCalculation(data);
  }, [data]);

  const memoizedCallback = useCallback(() => {
    onUpdate(memoizedValue);
  }, [memoizedValue, onUpdate]);

  return (
    <button onClick={memoizedCallback}>
      {memoizedValue}
    </button>
  );
});

export default OptimizedComponent;

// ❌ AVOID - Re-renders on every parent update
// const BadComponent = ({ data, onUpdate }) => { ... };


// ============================================
// 2. LAZY LOADING & CODE SPLITTING
// ============================================

// ✅ GOOD - Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(
  () => import('./HeavyChart'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false, // Don't render on server for 3D/canvas components
  }
);

// ❌ AVOID - Importing all components statically
// import HeavyChart from './HeavyChart';


// ============================================
// 3. EFFECT CLEANUP & DEPENDENCIES
// ============================================

// ✅ GOOD - Proper cleanup and dependencies
import { useEffect, useRef } from 'react';

function ProperEffectComponent() {
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      // Do something
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []); // Empty dependency array = only run once

  return <div>Timer running</div>;
}

// ❌ AVOID - Missing cleanup or dependencies
// useEffect(() => {
//   setInterval(() => { ... }, 1000); // Memory leak!
// });


// ============================================
// 4. KEY PROP IN LISTS
// ============================================

// ✅ GOOD - Use stable, unique keys
function ListComponent({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li> {/* Use item.id, not index */}
      ))}
    </ul>
  );
}

// ❌ AVOID - Using array index as key
// {items.map((item, index) => <li key={index}>{item}</li>)}


// ============================================
// 5. OPTIMIZED EVENT HANDLERS
// ============================================

// ✅ GOOD - Throttled/debounced event handlers
import { throttle, debounce } from '@/lib/performance';

function OptimizedSearch() {
  const handleSearch = useMemo(
    () => debounce((query) => {
      // Search operation
    }, 300),
    []
  );

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}

// ✅ GOOD - Passive event listeners
function OptimizedScroll() {
  useEffect(() => {
    const handleScroll = () => {
      // Handle scroll
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return <div>Scrollable content</div>;
}


// ============================================
// 6. IMAGE OPTIMIZATION
// ============================================

// ✅ GOOD - Using Next.js Image component
import Image from 'next/image';

function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={800}
      height={600}
      priority={false} // Only true for above-the-fold images
      loading="lazy"
      sizes="(max-width: 640px) 100vw, 50vw"
    />
  );
}

// ❌ AVOID - Regular HTML img tags
// <img src="/image.jpg" />


// ============================================
// 7. STATE MANAGEMENT
// ============================================

// ✅ GOOD - Split related state when possible
function SplitStateComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // Less frequent updates to different state vars = better performance
}

// ❌ AVOID - Large monolithic state objects that change often
// const [state, setState] = useState({
//   isOpen: false,
//   data: null,
//   loading: false,
//   error: null,
//   // ...20 other properties
// });


// ============================================
// 8. 3D CANVAS OPTIMIZATION
// ============================================

// ✅ GOOD - Using device optimization hook
import { useCanvasOptimizer } from '@/hooks/useCanvasOptimizer';

function Optimized3DComponent() {
  const { 
    devicePixelRatio, 
    getResponsiveFov, 
    getPostProcessingConfig,
    isVisible,
  } = useCanvasOptimizer({ pixelRatioCap: 2 });

  if (!isVisible) return null; // Don't render off-screen

  return (
    <Canvas
      dpr={devicePixelRatio}
      camera={{ fov: getResponsiveFov(50) }}
    >
      <PostProcessing {...getPostProcessingConfig()} />
    </Canvas>
  );
}


// ============================================
// 9. PROP VALIDATION & DEFAULTS
// ============================================

// ✅ GOOD - Sensible defaults
const ConfigurableComponent = memo(function Component({
  size = 'md',
  variant = 'default',
  disabled = false,
  children,
}) {
  return <div className={`size-${size} variant-${variant}`}>{children}</div>;
});

// ❌ AVOID - Required props that could have defaults
// const BadComponent = ({ size, variant, disabled, children }) => { ... };


// ============================================
// 10. PORTAL FOR MODALS & OVERLAYS
// ============================================

// ✅ GOOD - Using Portal for modals
import { createPortal } from 'react-dom';

function PerformantModal({ isOpen, children }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay">
      {children}
    </div>,
    document.body // Render at document root level
  );
}


// ============================================
// PERFORMANCE CHECKLIST
// ============================================

/*
Before committing component code:

□ Component is wrapped with React.memo if props rarely change
□ useCallback is used for callbacks passed to memoized children
□ useMemo is used for expensive computations
□ useEffect has proper dependency arrays
□ All effects are properly cleaned up
□ No console.logs in production code
□ Images use Next.js Image component
□ Heavy components use dynamic imports
□ Event listeners have { passive: true } where applicable
□ No functions created in render (defined outside or use useCallback)
□ Key prop is stable (not array index or random)
□ No direct object/array mutations (use spread operator)
□ useCanvasOptimizer is used for 3D components
□ IntersectionObserver used for visibility detection
□ Component has error boundaries if it's a feature
□ Loading states are shown for async operations
□ Component tests exist (if applicable)
□ Bundle size impact is considered

Performance Monitoring:
- Use useFpsMonitor hook for canvas components
- Check DevTools Performance tab
- Monitor Lighthouse scores
- Check Vercel Speed Insights regularly
*/

export default OptimizedComponent;
