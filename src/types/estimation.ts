/**
 * Estimation-related types for pose estimation and ICP operations.
 */

import { Point2DObject, Point3D, ModelViewTransform, ProjectionTransform } from './core';

export type EstimateParams = {
  screenCoords: Point2DObject[];
  worldCoords: Point2DObject[];
  projectionTransform: ProjectionTransform;
};

export type RefineEstimateParams = {
  initialModelViewTransform: ModelViewTransform;
  projectionTransform: ProjectionTransform;
  worldCoords: Point3D[];
  screenCoords: Point2DObject[];
};

export type ICPParams = {
  initialModelViewTransform: ModelViewTransform;
  projectionTransform: ProjectionTransform;
  worldCoords: Point3D[];
  screenCoords: Point2DObject[];
  inlierProb: number;
};

export type ICPResult = {
  modelViewTransform: ModelViewTransform;
  err: number;
};

export type NormalizationParams = {
  meanX: number;
  meanY: number;
  s: number;
};
