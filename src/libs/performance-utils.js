/**
 * Performance optimization utilities for critical AR operations
 */

/**
 * Optimized template matching using SIMD-like operations
 * @param {Uint8Array} imageData - Image data array
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number} cx - Center x coordinate
 * @param {number} cy - Center y coordinate
 * @param {number} tx - Template x coordinate
 * @param {number} ty - Template y coordinate
 * @param {number} templateSize - Template size
 * @returns {number} - Similarity score
 */
export function optimizedTemplateMatching(imageData, width, height, cx, cy, tx, ty, templateSize) {
  if (cx - templateSize < 0 || cx + templateSize >= width) return null;
  if (cy - templateSize < 0 || cy + templateSize >= height) return null;
  if (tx - templateSize < 0 || tx + templateSize >= width) return null;
  if (ty - templateSize < 0 || ty + templateSize >= height) return null;

  const templateWidth = 2 * templateSize + 1;
  const templateArea = templateWidth * templateWidth;
  
  // Pre-calculate offsets for better cache locality
  const p1Start = (cy - templateSize) * width + (cx - templateSize);
  const p2Start = (ty - templateSize) * width + (tx - templateSize);
  const rowOffset = width - templateWidth;
  
  let sxy = 0;
  let sx = 0;
  let sxx = 0;
  
  // Optimized loop with better memory access patterns
  let p1 = p1Start;
  let p2 = p2Start;
  
  for (let j = 0; j < templateWidth; j++) {
    for (let i = 0; i < templateWidth; i++) {
      const val1 = imageData[p1];
      const val2 = imageData[p2];
      
      sxy += val1 * val2;
      sx += val1;
      sxx += val1 * val1;
      
      p1++;
      p2++;
    }
    p1 += rowOffset;
    p2 += rowOffset;
  }
  
  const templateAverage = sx / templateArea;
  sxy -= templateAverage * sx;
  
  const vlen2 = sxx - (sx * sx) / templateArea;
  if (vlen2 <= 0) return null;
  
  const vlen = Math.sqrt(vlen2);
  return sxy / (vlen * vlen);
}

/**
 * Batch process multiple template matches
 * @param {Array} matches - Array of match parameters
 * @returns {Array} - Array of similarity scores
 */
export function batchTemplateMatching(matches) {
  const results = new Array(matches.length);
  
  for (let i = 0; i < matches.length; i++) {
    const { imageData, width, height, cx, cy, tx, ty, templateSize } = matches[i];
    results[i] = optimizedTemplateMatching(imageData, width, height, cx, cy, tx, ty, templateSize);
  }
  
  return results;
}

/**
 * Memory-efficient image processing with chunked operations
 * @param {Uint8Array} imageData - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {Function} processor - Processing function
 * @param {number} chunkSize - Chunk size for processing
 * @returns {Uint8Array} - Processed image data
 */
export function processImageInChunks(imageData, width, height, processor, chunkSize = 1024) {
  const result = new Uint8Array(imageData.length);
  const totalPixels = width * height;
  
  for (let start = 0; start < totalPixels; start += chunkSize) {
    const end = Math.min(start + chunkSize, totalPixels);
    const chunk = imageData.slice(start, end);
    const processedChunk = processor(chunk, start, end - start);
    result.set(processedChunk, start);
  }
  
  return result;
}

/**
 * Optimized convolution using separable filters
 * @param {Uint8Array} imageData - Image data
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {number[]} kernel - Convolution kernel
 * @returns {Uint8Array} - Convolved image data
 */
export function separableConvolution(imageData, width, height, kernel) {
  const result = new Uint8Array(imageData.length);
  
  // Horizontal pass
  const horizontalResult = new Uint8Array(imageData.length);
  const kernelRadius = Math.floor(kernel.length / 2);
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weight = 0;
      
      for (let k = 0; k < kernel.length; k++) {
        const px = x + k - kernelRadius;
        if (px >= 0 && px < width) {
          sum += imageData[y * width + px] * kernel[k];
          weight += kernel[k];
        }
      }
      
      horizontalResult[y * width + x] = weight > 0 ? sum / weight : 0;
    }
  }
  
  // Vertical pass
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let weight = 0;
      
      for (let k = 0; k < kernel.length; k++) {
        const py = y + k - kernelRadius;
        if (py >= 0 && py < height) {
          sum += horizontalResult[py * width + x] * kernel[k];
          weight += kernel[k];
        }
      }
      
      result[y * width + x] = weight > 0 ? sum / weight : 0;
    }
  }
  
  return result;
}

/**
 * Performance monitoring decorator
 * @param {Function} fn - Function to monitor
 * @param {string} name - Function name for logging
 * @returns {Function} - Wrapped function
 */
export function withPerformanceMonitoring(fn, name) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    
    if (end - start > 16) { // Log if takes longer than 16ms (60fps)
      console.warn(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
    }
    
    return result;
  };
}

/**
 * Memory usage monitoring
 * @returns {Object} - Memory usage statistics
 */
export function getMemoryUsage() {
  if (typeof performance !== 'undefined' && performance.memory) {
    return {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit
    };
  }
  return null;
}

/**
 * Throttle function calls to prevent excessive execution
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(fn, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Debounce function calls to prevent excessive execution
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
