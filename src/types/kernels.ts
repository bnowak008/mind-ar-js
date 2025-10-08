/**
 * Kernel-related types for WebGL and CPU kernel operations.
 * Note: These types are kept minimal to maintain compatibility with TensorFlow.js kernel system.
 */

export type KernelProgram = {
  variableNames: string[];
  outputShape: number[];
  userCode: string;
};

export type KernelCache = {
  computeMatching?: KernelProgram[];
  computeProjection?: Record<string, KernelProgram>;
};
