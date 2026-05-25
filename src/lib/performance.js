/**
 * Performance Utility Functions
 * Debouncing, Throttling, and optimization helpers
 */

/**
 * Throttle function calls - only execute once per time interval
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, wait = 16) {
  let timeout;
  let previous = 0;
  let lastResult;

  return function throttled(...args) {
    const now = Date.now();
    const remaining = wait - (now - previous);

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      lastResult = func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now();
        timeout = null;
        lastResult = func.apply(this, args);
      }, remaining);
    }

    return lastResult;
  };
}

/**
 * Debounce function calls - execute after user stops triggering
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute on leading edge
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300, immediate = false) {
  let timeout;
  let lastResult;

  return function debounced(...args) {
    const callNow = immediate && !timeout;

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (!immediate) {
        lastResult = func.apply(this, args);
      }
      timeout = null;
    }, wait);

    if (callNow) {
      lastResult = func.apply(this, args);
    }

    return lastResult;
  };
}

/**
 * Request animation frame throttle - sync with browser refresh rate
 * @param {Function} func - Function to call
 * @returns {Function} RAF-throttled function
 */
export function rafThrottle(func) {
  let rafId;
  let lastArgs;

  return function rafThrottled(...args) {
    lastArgs = args;

    if (rafId) {
      cancelAnimationFrame(rafId);
    }

    rafId = requestAnimationFrame(() => {
      func.apply(this, lastArgs);
      rafId = null;
    });
  };
}

/**
 * Batch RAF calls for better performance
 * @returns {Object} Object with queue and flush methods
 */
export function createRAFBatcher() {
  let scheduled = false;
  const callbacks = [];

  const schedule = (fn) => {
    callbacks.push(fn);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush);
    }
  };

  const flush = () => {
    const toExecute = callbacks.splice(0);
    toExecute.forEach(fn => fn());
    scheduled = false;
  };

  return { schedule, flush };
}
