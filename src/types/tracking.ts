/**
 * Tracking-related types for AR tracking operations.
 */

import type { OneEuroFilter } from '../libs/one-euro-filter';

export type TrackingData = Array<{
  points: Array<{x: number, y: number}>;
  width: number;
  height: number;
  scale: number;
  data: Float32Array;
}>;

export type TrackingFrame = {
  points: Array<{x: number, y: number}>;
  width: number;
  height: number;
  scale: number;
  data: Float32Array;
};

export type TrackingState = {
  showing: boolean;
  isTracking: boolean;
  currentModelViewTransform: number[][] | null;
  trackCount: number;
  trackMiss: number;
  filter: OneEuroFilter;
  trackingMatrix: number[] | null;
};
