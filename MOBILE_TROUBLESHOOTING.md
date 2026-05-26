# Mobile/Tablet Troubleshooting Guide

## Quick Diagnostic

If mobile/tablet still shows errors after deployment:

### 1. Check the Browser Console (DevTools)
```
Ctrl+Shift+I (Chrome) or F12 on Windows
CMD+Option+I on Mac
```

Look for these specific errors:

**Error: "WebGL context lost"**
→ Device doesn't support WebGL or runs out of memory
→ Solution: Already handled with recovery in v1.2.9+

**Error: "Model load timeout"**
→ Network too slow for loading models
→ Solution: Increased timeout for slow networks

**Error: "Out of memory"**
→ Too many models preloaded
→ Solution: Device-aware loading (max 1 model on mobile)

---

## Testing Checklist

### Mobile Simulation (Chrome DevTools)
1. Open DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select "iPhone 12" or "Galaxy S20"
4. Reload page (Ctrl+R)
5. Open Console tab
6. Check for errors

### Real Device Testing
1. On your phone, visit: https://tachy.vercel.app
2. Wait for page to load (should take 3-5 seconds)
3. If loading bar appears, wait for it to complete
4. Scroll down slowly to see if content loads
5. Check Console via Chrome Remote Debugging if needed

### Network Throttling Test
1. DevTools → Network tab
2. Change "No throttling" to "Slow 3G" or "Fast 3G"
3. Reload page
4. Watch loading progress
5. Page should complete within 12 seconds

---

## If Issues Persist

### Check Logs in Vercel
1. Go to: https://vercel.com/dashboard
2. Select "tachy" project
3. Click "Deployments" tab
4. Click "Logs" for current deployment
5. Look for 4xx/5xx errors

### Enable Debug Mode
Add this to your browser console:
```javascript
localStorage.setItem('debug', 'true');
location.reload();
```

This will show additional logging.

---

## Common Mobile Issues & Fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| Blank screen | JS error | Check console, clear cache |
| Loading forever | Network timeout | Increase timeout in LoadingContext |
| Choppy animation | Low FPS | Disable effects, reduce resolution |
| Memory error | Too much loaded | Reduce model count per device |
| 3D not showing | WebGL fail | Use fallback UI |
| Crashes after load | Memory leak | Check resource disposal |

---

## Performance Metrics

### Good Performance
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTI** (Time to Interactive): < 5s

### Warning Signs
- LCP > 4s → Models loading too slow
- FID > 300ms → JavaScript execution slow
- CLS > 0.25 → Layout shifts happening
- Memory > 100MB → Models not being disposed

---

## Deployment Notes for v1.2.9

### What Changed
✅ Device-aware model loading (mobile: 1 model, tablet: 3, desktop: 7)
✅ Network-aware timeouts (3G gets 10s, 2G gets 12s)
✅ WebGL error recovery (no more context loss crashes)
✅ Memory management (proper resource disposal)
✅ Error boundaries (graceful fallback UI)

### What Stayed the Same
- Visual design (looks same on all devices)
- Desktop experience (unchanged)
- 3D quality on desktop (unchanged)

### Mobile Experience
- Lighter loading (faster)
- No 3D animations on smaller screens (unavailable)
- Better reliability (no crashes)
- Fallback UI if 3D fails

---

## After Deployment Steps

### Hour 1-2: Monitor
- Check Vercel deployment status
- Watch error logs for crashes
- Test on personal device

### Hour 4: Analytics
- Check Vercel Analytics
- Monitor Web Vitals
- Look for 4xx/5xx errors

### Day 1: User Feedback
- Monitor GitHub issues
- Check error reports
- Test with multiple devices

### Week 1: Optimization
- Review performance metrics
- Fine-tune timeouts if needed
- Plan additional optimizations

---

## Support Commands

### Clear Browser Cache
```
Chrome: Ctrl+Shift+Delete → Clear all → Clear data
Firefox: Ctrl+Shift+Delete → Everything
Safari: Develop → Empty Web Cache
```

### Reset Loading State
```javascript
// In browser console:
sessionStorage.clear();
localStorage.removeItem('loading-state');
location.reload();
```

### Check Network Connection
```javascript
// In browser console:
navigator.connection?.effectiveType // returns 4g, 3g, 2g, slow-2g
navigator.deviceMemory // returns memory in GB (2, 4, 8, etc)
```

---

## Emergency Rollback

If critical issues occur:

1. **Via Vercel**:
   - Go to Deployments
   - Click "..." on current deployment
   - Select "Promote" previous working version

2. **Via Git**:
   ```bash
   git revert HEAD
   git push
   ```

3. **Contact Support**:
   - Vercel Support: https://vercel.com/support
   - Include deployment ID and error logs
