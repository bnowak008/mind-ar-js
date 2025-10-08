import TinyQueue from 'tinyqueue';
import {compute as hammingCompute} from './hamming-distance';
import {computeHoughMatches} from './hough';
import {computeHomography} from './ransacHomography';
import {solveHomography} from '../utils/homography';
import {
  matrixInverse33,
  matrixMul33,
  multiplyPointHomographyInhomogenous,
  checkFourPointsConsistent,
  determinant
} from '../utils/geometry';
import {type Matrix33} from '../utils/geometry';
import {type ClusterNode} from './hierarchical-clustering';
import {type Match, type DebugExtra, Point} from './matcher';

type PointWithScaleAndAngle = Point & {
  scale: number;
  angle: number;
};

// Type guard to check if a point has scale and angle properties
const hasScaleAndAngle = (point: Point): point is PointWithScaleAndAngle => {
  return point.scale !== undefined && point.angle !== undefined;
};

type Keyframe = {
  width: number;
  height: number;
  maximaPoints: {x: number, y: number, descriptors: number[]}[];
  minimaPoints: {x: number, y: number, descriptors: number[]}[];
  maximaPointsCluster: {rootNode: ClusterNode};
  minimaPointsCluster: {rootNode: ClusterNode};
};

type MatchResult = {
  H?: Matrix33;
  matches?: Match[];
  debugExtra: DebugExtra;
};

const INLIER_THRESHOLD = 3;
//const MIN_NUM_INLIERS = 8;  //default
const MIN_NUM_INLIERS = 6;
const CLUSTER_MAX_POP = 8;
const HAMMING_THRESHOLD = 0.7;

// match list of querpoints against pre-built list of keyframes
const match = ({keyframe, querypoints, querywidth, queryheight, debugMode}: {
  keyframe: Keyframe;
  querypoints: Point[];
  querywidth: number;
  queryheight: number;
  debugMode: boolean;
}): MatchResult => {
  let debugExtra: DebugExtra = {matches: [], houghMatches: [], inlierMatches: [], matches2: [], houghMatches2: [], inlierMatches2: []};

  const matches: Match[] = [];
  for (let j = 0; j < querypoints.length; j++) {
    const querypoint = querypoints[j];
    const keypoints = querypoint.maxima? keyframe.maximaPoints: keyframe.minimaPoints;
    if (keypoints.length === 0) continue;

    const rootNode = querypoint.maxima? keyframe.maximaPointsCluster.rootNode: keyframe.minimaPointsCluster.rootNode;

    const keypointIndexes = new Array<number>();
    const queue = new TinyQueue<{node: ClusterNode, d: number}>([], (a1, a2) => {return a1.d - a2.d});

    // query all potential keypoints
    _query({node: rootNode, keypoints, querypoint, queue, keypointIndexes, numPop: 0});

    let bestIndex = -1;
    let bestD1 = Number.MAX_SAFE_INTEGER;
    let bestD2 = Number.MAX_SAFE_INTEGER;

    for (let k = 0; k < keypointIndexes.length; k++) {
      const keypoint = keypoints[keypointIndexes[k]];

      if (!querypoint.descriptors) continue;
      const d = hammingCompute({v1: keypoint.descriptors, v2: querypoint.descriptors});
      if (d < bestD1) {
	bestD2 = bestD1;
	bestD1 = d;
	bestIndex = keypointIndexes[k];
      } else if (d < bestD2) {
	bestD2 = d;
      }
    }
    if (bestIndex !== -1 && (bestD2 === Number.MAX_SAFE_INTEGER || (1.0 * bestD1 / bestD2) < HAMMING_THRESHOLD)) {
      matches.push({querypoint, keypoint: keypoints[bestIndex]});
    }
  }

  if (debugMode) {
    debugExtra.matches = matches;
  }

  if (matches.length < MIN_NUM_INLIERS) return {debugExtra};

  // Filter matches to only include those with scale and angle properties
  const matchesWithScaleAndAngle = matches.filter(match => 
    hasScaleAndAngle(match.querypoint) && hasScaleAndAngle(match.keypoint)
  ) as Array<{querypoint: PointWithScaleAndAngle, keypoint: PointWithScaleAndAngle}>;

  const houghMatches = computeHoughMatches({
    keywidth: keyframe.width,
    keyheight: keyframe.height,
    querywidth,
    queryheight,
    matches: matchesWithScaleAndAngle,
  });

  if (debugMode) {
    debugExtra.houghMatches = houghMatches;
  }

  const H = computeHomography({
    srcPoints: houghMatches.map((m) => [m.keypoint.x, m.keypoint.y]),
    dstPoints: houghMatches.map((m) => [m.querypoint.x, m.querypoint.y]),
    keyframe,
  });

  if (H === null) return {debugExtra};

  const inlierMatches = _findInlierMatches({
    H: H as unknown as Matrix33,
    matches: houghMatches,
    threshold: INLIER_THRESHOLD
  });
  
  if (debugMode) {
    debugExtra.inlierMatches = inlierMatches;
  }

  if (inlierMatches.length < MIN_NUM_INLIERS) return {debugExtra}; 

  // do another loop of match using the homography
  const HInv = matrixInverse33(H as Matrix33, 0.00001);
  const dThreshold2 = 10 * 10;
  const matches2: Match[] = [];
  for (let j = 0; j < querypoints.length; j++) {
    const querypoint = querypoints[j];
    const mapquerypoint = multiplyPointHomographyInhomogenous([querypoint.x, querypoint.y], HInv as Matrix33);

    let bestIndex = -1;
    let bestD1 = Number.MAX_SAFE_INTEGER;
    let bestD2 = Number.MAX_SAFE_INTEGER;

    const keypoints = querypoint.maxima? keyframe.maximaPoints: keyframe.minimaPoints;

    for (let k = 0; k < keypoints.length; k++) {
      const keypoint = keypoints[k];

      // check distance threshold
      const d2 = (keypoint.x - mapquerypoint[0]) * (keypoint.x - mapquerypoint[0])
		+ (keypoint.y - mapquerypoint[1]) * (keypoint.y - mapquerypoint[1]);
      if (d2 > dThreshold2) continue;

      if (keypoint.descriptors && querypoint.descriptors) {
        const d = hammingCompute({v1: keypoint.descriptors, v2: querypoint.descriptors});
        if (d < bestD1) {
	  bestD2 = bestD1;
	  bestD1 = d;
	  bestIndex = k;
        } else if (d < bestD2) {
	  bestD2 = d;
        }
      }
    }

    if (bestIndex !== -1 && (bestD2 === Number.MAX_SAFE_INTEGER || (1.0 * bestD1 / bestD2) < HAMMING_THRESHOLD)) {
      matches2.push({querypoint, keypoint: keypoints[bestIndex]});
    }
  }

  if (debugMode) {
    debugExtra.matches2 = matches2;
  }

  // Filter matches2 to only include those with scale and angle properties
  const matches2WithScaleAndAngle = matches2.filter(match => 
    hasScaleAndAngle(match.querypoint) && hasScaleAndAngle(match.keypoint)
  ) as Array<{querypoint: PointWithScaleAndAngle, keypoint: PointWithScaleAndAngle}>;

  const houghMatches2 = computeHoughMatches({
    keywidth: keyframe.width,
    keyheight: keyframe.height,
    querywidth,
    queryheight,
    matches: matches2WithScaleAndAngle,
  });

  if (debugMode) {
    debugExtra.houghMatches2 = houghMatches2;
  }

  const H2 = computeHomography({
    srcPoints: houghMatches2.map((m) => [m.keypoint.x, m.keypoint.y]),
    dstPoints: houghMatches2.map((m) => [m.querypoint.x, m.querypoint.y]),
    keyframe,
  });

  if (H2 === null) return {debugExtra};

  const inlierMatches2 = _findInlierMatches({
    H: H2 as unknown as Matrix33,
    matches: houghMatches2,
    threshold: INLIER_THRESHOLD
  });

  if (debugMode) {
    debugExtra.inlierMatches2 = inlierMatches2;
  }

  return {H: H2 as unknown as Matrix33, matches: inlierMatches2, debugExtra};
};

const _query = ({node, keypoints, querypoint, queue, keypointIndexes, numPop}: {
  node: ClusterNode;
  keypoints: {x: number, y: number, descriptors: number[]}[];
  querypoint: Point;
  queue: TinyQueue<{node: ClusterNode, d: number}>;
  keypointIndexes: number[];
  numPop: number;
}): void => {
  if (node.leaf) {
    if (node.pointIndexes) {
      for (let i = 0; i < node.pointIndexes.length; i++) {
        keypointIndexes.push(node.pointIndexes[i]);
      }
    }
    return;
  }

  const distances: number[] = [];
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      const childNode = node.children[i];
      const centerPointIndex = childNode.centerPointIndex;
      if (centerPointIndex !== null && querypoint.descriptors) {
        const d = hammingCompute({v1: keypoints[centerPointIndex].descriptors, v2: querypoint.descriptors});
        distances.push(d);
      }
    }
  }

  let minD = Number.MAX_SAFE_INTEGER;
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) {
      minD = Math.min(minD, distances[i]);
    }

    for (let i = 0; i < node.children.length; i++) {
      if (distances[i] !== minD) {
        queue.push({node: node.children[i], d: distances[i]});
      }
    }
    for (let i = 0; i < node.children.length; i++) {
      if (distances[i] === minD) {
        _query({node: node.children[i], keypoints, querypoint, queue, keypointIndexes, numPop});
      }
    }
  }

  if (numPop < CLUSTER_MAX_POP && queue.length > 0) {
    const item = queue.pop();
    if (item) {
      const {node, d} = item;
      numPop += 1;
      _query({node, keypoints, querypoint, queue, keypointIndexes, numPop});
    }
  }
};

const _findInlierMatches = (options: {
  H: Matrix33;
  matches: Match[];
  threshold: number;
}): Match[] => {
  const {H, matches, threshold} = options;

  const threshold2 = threshold * threshold;

  const goodMatches = [];
  for (let i = 0; i < matches.length; i++) {
    const querypoint = matches[i].querypoint;
    const keypoint = matches[i].keypoint;
    const mp = multiplyPointHomographyInhomogenous([keypoint.x, keypoint.y], H);
    const d2 = (mp[0] - querypoint.x) * (mp[0] - querypoint.x) + (mp[1] - querypoint.y) * (mp[1] - querypoint.y);
    if (d2 <= threshold2) {
      goodMatches.push( matches[i] );
    }
  }
  return goodMatches;
}

export {
  match
}
