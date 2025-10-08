/**
 * Core geometric and data types used throughout the mind-ar codebase.
 * This file contains fundamental types for points, matrices, and basic data structures.
 */

// Point types - keep both formats for different use cases
export type Point2D = [number, number];  // For geometry/matrix operations
export type Point2DObject = { x: number; y: number; };  // For business logic
export type Point3D = { x: number; y: number; z: number; };
export type Landmark = [number, number, number];

// Conversion utilities
export const point2DToObject = (p: Point2D): Point2DObject => ({ x: p[0], y: p[1] });
export const objectToPoint2D = (p: Point2DObject): Point2D => [p.x, p.y];

// Matrix types
export type Matrix33 = [
  number, number, number,
  number, number, number,
  number, number, number
];
export type ModelViewTransform = number[][];
export type ProjectionTransform = number[][];

// Image data
export type ImageData = {
  width: number;
  height: number;
  data: Float32Array;
};

// Complex point types
export type Point = {
  x: number;
  y: number;
  scale?: number;
  angle?: number;
  descriptors?: number[];
  maxima?: boolean;
};

export type PointWithScaleAndAngle = Point & {
  scale: number;
  angle: number;
};
