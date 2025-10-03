/**
 * MindAR.js - Web Augmented Reality Framework
 * TypeScript type definitions
 * 
 * @packageDocumentation
 */

// Export Image Target types and classes
export * from './src/image-target/types';

// Export Face Target types and classes  
export * from './src/face-target/types';

/**
 * MindAR namespace for Image Target tracking
 */
declare namespace MindARImage {
  export { MindARThree, MindARThreeConfig, Anchor, CSSAnchor } from './src/image-target/types';
}

/**
 * MindAR namespace for Face Target tracking
 */
declare namespace MindARFace {
  export { MindARThree, MindARThreeFaceConfig, FaceAnchor, CSSFaceAnchor } from './src/face-target/types';
}

export { MindARImage, MindARFace };

/**
 * Version information
 */
export const version: string;
