import {Matrix, inverse} from 'ml-matrix';
import {createRandomizer} from '../utils/randomizer';
import {quadrilateralConvex, matrixInverse33, smallestTriangleArea, multiplyPointHomographyInhomogenous, checkThreePointsConsistent, checkFourPointsConsistent, determinant, type Matrix33} from '../utils/geometry';
import {solveHomography} from '../utils/homography';
import type { Point2D, HomographyOptions } from '../../types';

type Keyframe = { width: number; height: number };
type Hypothesis = {
  H: Matrix33;
  cost: number;
};

const CAUCHY_SCALE = 0.01;
const CHUNK_SIZE = 10;
const NUM_HYPOTHESES = 20;
const NUM_HYPOTHESES_QUICK = 10;

// Using RANSAC to estimate homography
const computeHomography = (options: HomographyOptions): Matrix33 | null => {
  const {srcPoints, dstPoints, keyframe, quickMode} = options;

  // testPoints is four corners of keyframe
  const testPoints: Point2D[] = [
    [0, 0],
    [keyframe.width, 0],
    [keyframe.width, keyframe.height],
    [0, keyframe.height]
  ];

  const sampleSize = 4; // use four points to compute homography
  if (srcPoints.length < sampleSize) return null;

  const scale = CAUCHY_SCALE;
  const oneOverScale2 = 1.0 / (scale * scale);
  const chuckSize = Math.min(CHUNK_SIZE, srcPoints.length);

  const randomizer = createRandomizer();

  const perm: number[] = [];
  for (let i = 0; i < srcPoints.length; i++) {
    perm[i] = i;
  }

  randomizer.arrayShuffle({arr: perm, sampleSize: perm.length});

  const numHypothesis = quickMode? NUM_HYPOTHESES_QUICK: NUM_HYPOTHESES;
  const maxTrials = numHypothesis * 2;

  // build numerous hypotheses by randoming draw four points
  // TODO: optimize: if number of points is less than certain number, can brute force all combinations
  let trial = 0;
  const Hs: Matrix33[] = [];
  while (trial < maxTrials && Hs.length < numHypothesis) {
    trial +=1;

    randomizer.arrayShuffle({arr: perm, sampleSize: sampleSize});

    // their relative positions match each other
    if (!checkFourPointsConsistent(
      srcPoints[perm[0]], srcPoints[perm[1]], srcPoints[perm[2]], srcPoints[perm[3]],
      dstPoints[perm[0]], dstPoints[perm[1]], dstPoints[perm[2]], dstPoints[perm[3]])) {
      continue;
    }

    const H = solveHomography(
      [srcPoints[perm[0]], srcPoints[perm[1]], srcPoints[perm[2]], srcPoints[perm[3]]],
      [dstPoints[perm[0]], dstPoints[perm[1]], dstPoints[perm[2]], dstPoints[perm[3]]],
    );
    if (H === null) continue;

    if(!_checkHomographyPointsGeometricallyConsistent({H, testPoints})) {
      continue;
    }

    Hs.push(H);
  }

  if (Hs.length === 0) return null;

  // pick the best hypothesis
  const hypotheses: Hypothesis[] = [];
  for (let i = 0; i < Hs.length; i++) {
    hypotheses.push({
      H: Hs[i],
      cost: 0
    });
  }

  let curChuckSize = chuckSize;
  for (let i = 0; i < srcPoints.length && hypotheses.length > 2; i += curChuckSize) {
    curChuckSize = Math.min(chuckSize, srcPoints.length - i);
    let chuckEnd = i + curChuckSize;

    for (let j = 0; j < hypotheses.length; j++) {
      for (let k = i; k < chuckEnd; k++) {
        const cost = _cauchyProjectiveReprojectionCost({H: hypotheses[j].H, srcPoint: srcPoints[k], dstPoint: dstPoints[k], oneOverScale2});
        hypotheses[j].cost += cost;
      }
    }

    hypotheses.sort((h1, h2) => {return h1.cost - h2.cost});
    hypotheses.splice(-Math.floor((hypotheses.length+1)/2)); // keep the best half
  }

  let finalH: Matrix33 | null = null;
  for (let i = 0; i < hypotheses.length; i++) {
    const H = _normalizeHomography({inH: hypotheses[i].H});
    if (_checkHeuristics({H: H, testPoints, keyframe})) {
      finalH = H;
      break;
    }
  }
  return finalH;
}

const _checkHeuristics = ({H, testPoints, keyframe}: {H: Matrix33, testPoints: Point2D[], keyframe: Keyframe}): boolean => {
  const HInv = matrixInverse33(H, 0.00001);
  if (HInv === null) return false;

  const mp: Point2D[] = [];
  for (let i = 0; i < testPoints.length; i++) { // 4 test points, corner of keyframe
    mp.push(multiplyPointHomographyInhomogenous(testPoints[i], HInv));
  }
  const smallArea = smallestTriangleArea(mp[0], mp[1], mp[2], mp[3]);

  if (smallArea < keyframe.width * keyframe.height * 0.0001) return false;

  if (!quadrilateralConvex(mp[0], mp[1], mp[2], mp[3])) return false;

  return true;
}

const _normalizeHomography = ({inH}: {inH: Matrix33}): Matrix33 => {
  const oneOver = 1.0 / inH[8];

  const H: Matrix33 = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 8; i++) {
    H[i] = inH[i] * oneOver;
  }
  H[8] = 1.0;
  return H;
}

const _cauchyProjectiveReprojectionCost = ({H, srcPoint, dstPoint, oneOverScale2}: {H: Matrix33, srcPoint: Point2D, dstPoint: Point2D, oneOverScale2: number}): number => {
  const x = multiplyPointHomographyInhomogenous(srcPoint, H);
  const f: Point2D = [
    x[0] - dstPoint[0],
    x[1] - dstPoint[1]
  ];
  return Math.log(1 + (f[0]*f[0]+f[1]*f[1]) * oneOverScale2);
};

const _checkHomographyPointsGeometricallyConsistent = ({H, testPoints}: {H: Matrix33, testPoints: Point2D[]}): boolean => {
  const mappedPoints: Point2D[] = [];
  for (let i = 0; i < testPoints.length; i++) {
    mappedPoints[i] = multiplyPointHomographyInhomogenous(testPoints[i], H);
  }
  for (let i = 0; i < testPoints.length; i++) {
    const i1 = i;
    const i2 = (i+1) % testPoints.length;
    const i3 = (i+2) % testPoints.length;
    if (!checkThreePointsConsistent(
      testPoints[i1], testPoints[i2], testPoints[i3],
      mappedPoints[i1], mappedPoints[i2], mappedPoints[i3])) return false;
  }
  return true;
}

export {
  computeHomography,
}
