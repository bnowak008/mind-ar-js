/**
 * Clustering-related types for hierarchical clustering operations.
 */

export type ClusterNode = {
  leaf: boolean;
  pointIndexes?: number[];
  children?: ClusterNode[];
  centerPointIndex: number | null;
};
