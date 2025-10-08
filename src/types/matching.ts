/**
 * Matching-related types for feature matching and keyframe operations.
 */

import { Point, Point2D, Matrix33 } from './core';
import type { ClusterNode } from './clustering';

export type Match = {
  querypoint: Point;
  keypoint: Point;
};

export type DebugExtra = {
  matches?: Match[];
  houghMatches?: Match[];
  inlierMatches?: Match[];
  matches2?: Match[];
  houghMatches2?: Match[];
  inlierMatches2?: Match[];
};

export type Keyframe = {
  width: number;
  height: number;
  maximaPoints: Array<{x: number, y: number, descriptors: number[]}>;
  minimaPoints: Array<{x: number, y: number, descriptors: number[]}>;
  maximaPointsCluster: {rootNode: ClusterNode};
  minimaPointsCluster: {rootNode: ClusterNode};
};

export type MatchResult = {
  H?: Matrix33;
  matches?: Match[];
  debugExtra: DebugExtra;
};

export type HomographyOptions = {
  srcPoints: Point2D[];
  dstPoints: Point2D[];
  keyframe: { width: number; height: number };
  quickMode?: boolean;
};
