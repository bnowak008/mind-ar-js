import {compute as hammingCompute} from './hamming-distance';
import {createRandomizer, type Randomizer} from '../utils/randomizer';

const MIN_FEATURE_PER_NODE = 16;
const NUM_ASSIGNMENT_HYPOTHESES =  128;
const NUM_CENTERS = 8;


const _computeKMedoids = (options: {points: {descriptors: number[]}[], pointIndexes: number[], randomizer: Randomizer}) => {
  const {points, pointIndexes, randomizer} = options;

  const randomPointIndexes = new Array<number>();
  for (let i = 0; i < pointIndexes.length; i++) {
    randomPointIndexes.push(i);
  }

  let bestSumD = Number.MAX_SAFE_INTEGER;
  let bestAssignmentIndex = -1;

  const assignments = new Array<number[]>();
  for (let i = 0; i < NUM_ASSIGNMENT_HYPOTHESES; i++) {
    randomizer.arrayShuffle({arr: randomPointIndexes, sampleSize: NUM_CENTERS});

    let sumD = 0;
    const assignment = [];
    for (let j = 0; j < pointIndexes.length; j++) {
      let bestD = Number.MAX_SAFE_INTEGER;
      for (let k = 0; k < NUM_CENTERS; k++) {
        const centerIndex = pointIndexes[randomPointIndexes[k]];
        const d = hammingCompute({v1: points[pointIndexes[j]].descriptors, v2: points[centerIndex].descriptors});
        if (d < bestD) {
          assignment[j] = randomPointIndexes[k];
          bestD = d;
        }
      }
      sumD += bestD;
    }
    assignments.push(assignment);

    if (sumD < bestSumD) {
      bestSumD = sumD;
      bestAssignmentIndex = i;
    }
  }
  return assignments[bestAssignmentIndex];
}

// kmedoids clustering of points, with hamming distance of FREAK descriptor
//
// node = {
//   isLeaf: bool,
//   children: [], list of children node
//   pointIndexes: [], list of int, point indexes
//   centerPointIndex: int
// }
const build = ({points}: {points: {descriptors: number[]}[]}) => {
  const pointIndexes = new Array<number>();
  for (let i = 0; i < points.length; i++) {
    pointIndexes.push(i);
  }

  const randomizer = createRandomizer();

  const rootNode = _build({points: points, pointIndexes: pointIndexes, centerPointIndex: null, randomizer});
  return {rootNode};
}

// recursive build hierarchy clusters
export type ClusterNode = {
  centerPointIndex: number | null;
  leaf?: boolean;
  pointIndexes?: number[];
  children?: ClusterNode[];
};

const _build = (options: {points: {descriptors: number[]}[], pointIndexes: number[], centerPointIndex: number | null, randomizer: Randomizer}): ClusterNode => {
  const {points, pointIndexes, centerPointIndex, randomizer} = options;

  let isLeaf = false;

  if (pointIndexes.length <= NUM_CENTERS || pointIndexes.length <= MIN_FEATURE_PER_NODE) {
    isLeaf = true;
  }

  const clusters = new Array<number[]>();
  if (!isLeaf) {
    // compute clusters
    const assignment = _computeKMedoids({points, pointIndexes, randomizer});

    for (let i = 0; i < assignment.length; i++) {
      if (clusters[pointIndexes[assignment[i]]] === undefined) {
        clusters[pointIndexes[assignment[i]]] = [];
      }
      clusters[pointIndexes[assignment[i]]].push(pointIndexes[i]);
    }
  }
  if (Object.keys(clusters).length === 1) {
    isLeaf = true;
  }

  const node: ClusterNode = {
    centerPointIndex: centerPointIndex
  }

  if (isLeaf) {
    node.leaf = true;
    node.pointIndexes = [];
    for (let i = 0; i < pointIndexes.length; i++) {
      node.pointIndexes.push(pointIndexes[i]);
    }
    return node;
  }

  // recursive build children
  node.leaf = false;
  node.children = [];

  Object.keys(clusters).forEach((centerIndex) => {
    if (node.children) {
      node.children.push(_build({points: points, pointIndexes: clusters[parseInt(centerIndex)], centerPointIndex: parseInt(centerIndex), randomizer}));
    }
  });
  return node;
}

export {
  build,
};

