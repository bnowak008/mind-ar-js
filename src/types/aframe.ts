/**
 * A-Frame related types for AR components and face mesh operations.
 */

import type * as THREE from 'three';

export interface ComponentWithMatrix extends AFRAME.Component {
  updateVisibility(visible: boolean): void;
  updateMatrix(matrix: number[]): void;
}

export interface FaceMeshComponent extends ComponentWithMatrix {
  addFaceMesh(faceGeometry: THREE.BufferGeometry): void;
}
