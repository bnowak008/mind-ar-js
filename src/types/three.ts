/**
 * Three.js related types for 3D operations and AR anchors.
 */

import type { Group, BufferGeometry } from 'three';

export type Anchor = {
  group: Group;
  landmarkIndex: number;
  css: boolean;
};

export type FaceGeometry = BufferGeometry & {
  updatePositions(landmarks: number[][]): void;
};
