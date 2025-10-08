import {estimate} from './estimate';
import {refineEstimate} from './refine-estimate';
import type { Point2DObject, Point3D, ModelViewTransform, EstimateParams, RefineEstimateParams } from '../../types';

class Estimator {
  private projectionTransform: number[][];

  constructor(projectionTransform: number[][]) {
    this.projectionTransform = projectionTransform;
  }

  // Solve homography between screen points and world points using Direct Linear Transformation
  // then decompose homography into rotation and translation matrix (i.e. modelViewTransform)
  estimate({screenCoords, worldCoords}: EstimateParams): ModelViewTransform {
    const modelViewTransform = estimate({screenCoords, worldCoords, projectionTransform: this.projectionTransform});
    return modelViewTransform;
  }

  // Given an initial guess of the modelViewTransform and new pairs of screen-world coordinates, 
  // use Iterative Closest Point to refine the transformation
  refineEstimate({initialModelViewTransform, worldCoords, screenCoords}: RefineEstimateParams): ModelViewTransform | null {
    const updatedModelViewTransform = refineEstimate({initialModelViewTransform, worldCoords, screenCoords, projectionTransform: this.projectionTransform});
    return updatedModelViewTransform;
  }
}

export {
  Estimator,
}
