/**
 * Type definitions for MindAR Image Target tracking
 * @module image-target/types
 */

import type { Scene, Group, Camera, WebGLRenderer } from 'three';

/**
 * Configuration options for MindARThree Image Target tracking
 */
export interface MindARThreeConfig {
  /** DOM container element for the AR scene */
  container: HTMLElement;
  
  /** URL or path to the compiled image target file (.mind) */
  imageTargetSrc: string;
  
  /** Maximum number of targets to track simultaneously (default: 1) */
  maxTrack?: number;
  
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
  
  /** Warmup tolerance in frames (default: 5) */
  warmupTolerance?: number | null;
  
  /** Miss tolerance in frames before target is lost (default: 5) */
  missTolerance?: number | null;
  
  /** Device ID for user-facing camera */
  userDeviceId?: string | null;
  
  /** Device ID for environment-facing camera */
  environmentDeviceId?: string | null;
}

/**
 * Anchor callback event for target found
 */
export interface AnchorFoundEvent {
  type: 'targetFound';
  targetIndex: number;
}

/**
 * Anchor callback event for target lost
 */
export interface AnchorLostEvent {
  type: 'targetLost';
  targetIndex: number;
}

/**
 * Anchor callback event for target update
 */
export interface AnchorUpdateEvent {
  type: 'targetUpdate';
  targetIndex: number;
}

/**
 * Anchor object representing a tracked target
 */
export interface Anchor {
  /** THREE.js Group for attaching 3D objects */
  group: Group;
  
  /** Index of the target this anchor is tracking */
  targetIndex: number;
  
  /** Callback when target is found */
  onTargetFound: ((event: AnchorFoundEvent) => void) | null;
  
  /** Callback when target is lost */
  onTargetLost: ((event: AnchorLostEvent) => void) | null;
  
  /** Callback when target is updated */
  onTargetUpdate: ((event: AnchorUpdateEvent) => void) | null;
  
  /** Whether this is a CSS anchor */
  css: boolean;
  
  /** Whether the anchor is currently visible */
  visible: boolean;
}

/**
 * CSS Anchor object for CSS3D rendering
 */
export interface CSSAnchor extends Anchor {
  css: true;
}

/**
 * Controller update data
 */
export interface ControllerUpdateData {
  type: 'updateMatrix';
  targetIndex: number;
  worldMatrix: number[];
}

/**
 * Main MindARThree class for image target tracking
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
  
  /** List of anchors */
  anchors: Anchor[];
  
  /** DOM container element */
  container: HTMLElement;
  
  /**
   * Create a new MindARThree instance
   * @param config Configuration options
   */
  constructor(config: MindARThreeConfig);
  
  /**
   * Start the AR experience
   * Initializes camera and starts tracking
   */
  start(): Promise<void>;
  
  /**
   * Stop the AR experience
   * Stops camera and tracking
   */
  stop(): void;
  
  /**
   * Switch between front and back camera
   */
  switchCamera(): void;
  
  /**
   * Add a 3D anchor to a target
   * @param targetIndex Index of the target to track (0-based)
   * @returns Anchor object with THREE.js Group
   */
  addAnchor(targetIndex: number): Anchor;
  
  /**
   * Add a CSS3D anchor to a target
   * @param targetIndex Index of the target to track (0-based)
   * @returns CSS Anchor object
   */
  addCSSAnchor(targetIndex: number): CSSAnchor;
  
  /**
   * Handle window resize
   * Updates camera and renderer sizes
   */
  resize(): void;
}

/**
 * Controller configuration options
 */
export interface ControllerConfig {
  /** Input video width */
  inputWidth: number;
  
  /** Input video height */
  inputHeight: number;
  
  /** Filter minimum confidence threshold */
  filterMinCF?: number | null;
  
  /** Filter beta value */
  filterBeta?: number | null;
  
  /** Warmup tolerance in frames */
  warmupTolerance?: number | null;
  
  /** Miss tolerance in frames */
  missTolerance?: number | null;
  
  /** Maximum number of targets to track */
  maxTrack?: number;
  
  /** Update callback */
  onUpdate?: (data: ControllerUpdateData) => void;
}

/**
 * Image target compiler options
 */
export interface CompilerOptions {
  /** Path to input image */
  inputPath: string;
  
  /** Path to output .mind file */
  outputPath: string;
}
