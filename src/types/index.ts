/**
 * Main type definitions index for the mind-ar codebase.
 * This file re-exports all type definitions for easy importing.
 */

// Core types
export * from './core';
export * from './clustering';
export * from './matching';
export * from './estimation';
export * from './kernels';
export * from './tracking';
export * from './three';
export * from './aframe';

// Re-export most commonly used types for convenience
export type {
  Point2D,
  Point2DObject,
  Point3D,
  Matrix33,
  ModelViewTransform,
  Point,
} from './core';
export type {
  Match,
  MatchResult,
} from './matching';
export type {
  TrackingState,
} from './tracking';
