/**
 * Type definitions for MindAR Face Target tracking
 * @module face-target/types
 */

import type { Scene, Group, Camera, WebGLRenderer, Mesh } from 'three';

/**
 * Configuration options for MindARThree Face Target tracking
 */
export interface MindARThreeFaceConfig {
  /** DOM container element for the AR scene */
  container: HTMLElement;
  
  /** Show loading UI: 'yes', 'no', or CSS selector (default: 'yes') */
  uiLoading?: 'yes' | 'no' | string;
  
  /** Show scanning UI: 'yes', 'no', or CSS selector (default: 'yes') */
  uiScanning?: 'yes' | 'no' | string;
  
  /** Show error/compatibility UI: 'yes', 'no', or CSS selector (default: 'yes') */
  uiError?: 'yes' | 'no' | string;
  
  /** Filter minimum confidence threshold (0-1, default: 0.8) */
  filterMinCF?: number | null;
  
  /** Filter beta value for exponential smoothing (0-1, default: 0.001) */
  filterBeta?: number | null;
  
  /** Device ID for user-facing camera */
  userDeviceId?: string | null;
  
  /** Device ID for environment-facing camera */
  environmentDeviceId?: string | null;
  
  /** Disable face mirroring (default: false) */
  disableFaceMirror?: boolean;
}

/**
 * Face anchor callback event for face found
 */
export interface FaceFoundEvent {
  type: 'faceFound';
}

/**
 * Face anchor callback event for face lost
 */
export interface FaceLostEvent {
  type: 'faceLost';
}

/**
 * Face anchor callback event for face update
 */
export interface FaceUpdateEvent {
  type: 'faceUpdate';
}

/**
 * Face anchor object representing a tracked facial landmark
 */
export interface FaceAnchor {
  /** THREE.js Group for attaching 3D objects */
  group: Group;
  
  /** Index of the facial landmark (0-467) */
  landmarkIndex: number;
  
  /** Callback when face is found */
  onTargetFound: ((event: FaceFoundEvent) => void) | null;
  
  /** Callback when face is lost */
  onTargetLost: ((event: FaceLostEvent) => void) | null;
  
  /** Callback when face is updated */
  onTargetUpdate: ((event: FaceUpdateEvent) => void) | null;
  
  /** Whether this is a CSS anchor */
  css: boolean;
  
  /** Whether the anchor is currently visible */
  visible: boolean;
}

/**
 * CSS Face Anchor object for CSS3D rendering
 */
export interface CSSFaceAnchor extends FaceAnchor {
  css: true;
}

/**
 * Face estimation result
 */
export interface FaceEstimate {
  /** Whether a face was detected */
  hasFace: boolean;
  
  /** 3D facial landmark positions (468 landmarks × 3 coordinates) */
  faceLandmarks?: number[][];
  
  /** Face rotation (euler angles) */
  faceRotation?: number[];
  
  /** Face translation */
  faceTranslation?: number[];
  
  /** Face scale */
  faceScale?: number;
}

/**
 * Face landmark matrix (4×4 transformation matrix)
 */
export type LandmarkMatrix = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];

/**
 * Main MindARThree class for face target tracking
 */
export declare class MindARThree {
  /** THREE.js scene */
  scene: Scene;
  
  /** THREE.js camera */
  camera: Camera;
  
  /** THREE.js renderer */
  renderer: WebGLRenderer;
  
  /** CSS3D renderer (if using CSS anchors) */
  cssRenderer: any;
  
  /** List of face anchors */
  anchors: FaceAnchor[];
  
  /** List of face meshes */
  faceMeshes: Mesh[];
  
  /** DOM container element */
  container: HTMLElement;
  
  /**
   * Create a new MindARThree Face instance
   * @param config Configuration options
   */
  constructor(config: MindARThreeFaceConfig);
  
  /**
   * Start the face tracking experience
   * Initializes camera and starts tracking
   */
  start(): Promise<void>;
  
  /**
   * Stop the face tracking experience
   * Stops camera and tracking
   */
  stop(): void;
  
  /**
   * Switch between front and back camera
   */
  switchCamera(): void;
  
  /**
   * Add a 3D face mesh
   * @returns Face mesh object
   */
  addFaceMesh(): Mesh;
  
  /**
   * Add a 3D anchor to a facial landmark
   * @param landmarkIndex Index of the facial landmark (0-467)
   * @returns Face anchor object with THREE.js Group
   */
  addAnchor(landmarkIndex: number): FaceAnchor;
  
  /**
   * Add a CSS3D anchor to a facial landmark
   * @param landmarkIndex Index of the facial landmark (0-467)
   * @returns CSS Face anchor object
   */
  addCSSAnchor(landmarkIndex: number): CSSFaceAnchor;
  
  /**
   * Get the latest face estimation result
   * @returns Face estimate or null if no face detected
   */
  getLatestEstimate(): FaceEstimate | null;
}

/**
 * Face controller configuration options
 */
export interface FaceControllerConfig {
  /** Input video width */
  inputWidth: number;
  
  /** Input video height */
  inputHeight: number;
  
  /** Filter minimum confidence threshold */
  filterMinCF?: number | null;
  
  /** Filter beta value */
  filterBeta?: number | null;
  
  /** Update callback */
  onUpdate?: (data: any) => void;
}

/**
 * MediaPipe face landmark indices
 * Reference: https://github.com/google/mediapipe/blob/master/docs/solutions/face_mesh.md
 */
export const FACE_LANDMARKS: {
  /** Left eye landmarks */
  leftEye: number[];
  
  /** Right eye landmarks */
  rightEye: number[];
  
  /** Lips landmarks */
  lips: number[];
  
  /** Face oval landmarks */
  faceOval: number[];
  
  /** Left eyebrow landmarks */
  leftEyebrow: number[];
  
  /** Right eyebrow landmarks */
  rightEyebrow: number[];
  
  /** Nose landmarks */
  nose: number[];
};
