import * as tf from '@tensorflow/tfjs';

/**
 * TensorManager - Centralized tensor lifecycle management
 * Prevents memory leaks by tracking and disposing tensors properly
 */
class TensorManager {
  constructor() {
    this.tensors = new Set();
    this.disposed = false;
  }

  /**
   * Create a tensor and track it for disposal
   * @param {tf.TensorData} data - Tensor data
   * @param {number[]} shape - Tensor shape
   * @param {tf.DataType} dtype - Tensor data type
   * @returns {tf.Tensor} - Tracked tensor
   */
  createTensor(data, shape, dtype = 'float32') {
    if (this.disposed) {
      throw new Error('TensorManager has been disposed');
    }
    
    const tensor = tf.tensor(data, shape, dtype);
    this.tensors.add(tensor);
    return tensor;
  }

  /**
   * Create a tensor from existing tensor data
   * @param {tf.Tensor} tensor - Source tensor
   * @returns {tf.Tensor} - Tracked tensor
   */
  trackTensor(tensor) {
    if (this.disposed) {
      throw new Error('TensorManager has been disposed');
    }
    
    this.tensors.add(tensor);
    return tensor;
  }

  /**
   * Execute a function with automatic tensor cleanup
   * @param {Function} fn - Function to execute
   * @returns {*} - Function result
   */
  tidy(fn) {
    return tf.tidy(() => {
      const result = fn();
      // Track any tensors created in the tidy scope
      return result;
    });
  }

  /**
   * Dispose a specific tensor
   * @param {tf.Tensor} tensor - Tensor to dispose
   */
  disposeTensor(tensor) {
    if (tensor && typeof tensor.dispose === 'function') {
      tensor.dispose();
      this.tensors.delete(tensor);
    }
  }

  /**
   * Dispose all tracked tensors
   */
  dispose() {
    if (this.disposed) return;
    
    this.tensors.forEach(tensor => {
      if (tensor && typeof tensor.dispose === 'function') {
        tensor.dispose();
      }
    });
    
    this.tensors.clear();
    this.disposed = true;
  }

  /**
   * Get memory usage statistics
   * @returns {Object} - Memory usage info
   */
  getMemoryStats() {
    return {
      trackedTensors: this.tensors.size,
      disposed: this.disposed,
      tfjsMemory: tf.memory()
    };
  }

  /**
   * Force garbage collection (if available)
   */
  forceGC() {
    if (typeof tf.memory === 'function') {
      tf.memory().numTensors = 0;
    }
  }
}

/**
 * Global tensor manager instance
 */
let globalTensorManager = null;

/**
 * Get or create the global tensor manager
 * @returns {TensorManager} - Global tensor manager
 */
export function getTensorManager() {
  if (!globalTensorManager) {
    globalTensorManager = new TensorManager();
  }
  return globalTensorManager;
}

/**
 * Dispose the global tensor manager
 */
export function disposeGlobalTensorManager() {
  if (globalTensorManager) {
    globalTensorManager.dispose();
    globalTensorManager = null;
  }
}

/**
 * Memory monitoring utility
 */
export class MemoryMonitor {
  constructor() {
    this.initialMemory = null;
    this.peakMemory = 0;
    this.samples = [];
  }

  start() {
    this.initialMemory = tf.memory();
    this.peakMemory = this.initialMemory.numTensors;
  }

  sample() {
    const current = tf.memory();
    this.samples.push({
      timestamp: Date.now(),
      numTensors: current.numTensors,
      numBytes: current.numBytes
    });
    
    if (current.numTensors > this.peakMemory) {
      this.peakMemory = current.numTensors;
    }
  }

  getStats() {
    const current = tf.memory();
    return {
      initial: this.initialMemory,
      current,
      peak: this.peakMemory,
      samples: this.samples.length,
      growth: current.numTensors - (this.initialMemory?.numTensors || 0)
    };
  }

  reset() {
    this.initialMemory = null;
    this.peakMemory = 0;
    this.samples = [];
  }
}

export { TensorManager };
