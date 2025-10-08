import { Matrix, inverse } from "ml-matrix";
import type { Point2D, Matrix33, NormalizationParams } from '../../types';

const solveHomography = (srcPoints: Point2D[], dstPoints: Point2D[]): Matrix33 | null => {
  const { normPoints: normSrcPoints, param: srcParam } = _normalizePoints(srcPoints);
  const { normPoints: normDstPoints, param: dstParam } = _normalizePoints(dstPoints);

  const num = normDstPoints.length;
  const AData: number[][] = [];
  const BData: number[][] = [];
  for (let j = 0; j < num; j++) {
    const row1 = [
      normSrcPoints[j][0],
      normSrcPoints[j][1],
      1,
      0,
      0,
      0,
      -(normSrcPoints[j][0] * normDstPoints[j][0]),
      -(normSrcPoints[j][1] * normDstPoints[j][0]),
    ];
    const row2 = [
      0,
      0,
      0,
      normSrcPoints[j][0],
      normSrcPoints[j][1],
      1,
      -(normSrcPoints[j][0] * normDstPoints[j][1]),
      -(normSrcPoints[j][1] * normDstPoints[j][1]),
    ];
    AData.push(row1);
    AData.push(row2);

    BData.push([normDstPoints[j][0]]);
    BData.push([normDstPoints[j][1]]);
  }

  try {
    const A = new Matrix(AData);
    const B = new Matrix(BData);
    const AT = A.transpose();
    const ATA = AT.mmul(A);
    const ATB = AT.mmul(B);
    const ATAInv = inverse(ATA);
    const C = ATAInv.mmul(ATB).to1DArray();
    const H = _denormalizeHomography(C, srcParam, dstParam);
    return H;
  } catch (e) {
    return null;
  }
};

const _normalizePoints = (coords: Point2D[]): { normPoints: Point2D[], param: NormalizationParams } => {
  let sumX = 0;
  let sumY = 0;
  for (let i = 0; i < coords.length; i++) {
    sumX += coords[i][0];
    sumY += coords[i][1];
  }
  const meanX = sumX / coords.length;
  const meanY = sumY / coords.length;

  let sumDiff = 0;
  for (let i = 0; i < coords.length; i++) {
    const diffX = coords[i][0] - meanX;
    const diffY = coords[i][1] - meanY;
    sumDiff += Math.sqrt(diffX * diffX + diffY * diffY);
  }
  const s = Math.sqrt(2) * coords.length / sumDiff;

  const normPoints: Point2D[] = [];
  for (let i = 0; i < coords.length; i++) {
    normPoints.push([
      (coords[i][0] - meanX) * s,
      (coords[i][1] - meanY) * s,
    ]);
  }
  return { normPoints, param: { meanX, meanY, s } };
};

const _denormalizeHomography = (nH: number[], srcParam: NormalizationParams, dstParam: NormalizationParams): Matrix33 => {
  const sMeanX = dstParam.s * dstParam.meanX;
  const sMeanY = dstParam.s * dstParam.meanY;

  const H = new Array(9);
  H[0] = nH[0] + sMeanX * nH[6];
  H[1] = nH[1] + sMeanX * nH[7];
  H[2] = (nH[0] + sMeanX * nH[6]) * -srcParam.meanX + (nH[1] + sMeanX * nH[7]) * -srcParam.meanY + (nH[2] + sMeanX) / srcParam.s;
  H[3] = nH[3] + sMeanY * nH[6];
  H[4] = nH[4] + sMeanY * nH[7];
  H[5] = (nH[3] + sMeanY * nH[6]) * -srcParam.meanX + (nH[4] + sMeanY * nH[7]) * -srcParam.meanY + (nH[5] + sMeanY) / srcParam.s;
  H[6] = dstParam.s * nH[6];
  H[7] = dstParam.s * nH[7];
  H[8] = dstParam.s * nH[6] * -srcParam.meanX + dstParam.s * nH[7] * -srcParam.meanY + dstParam.s / srcParam.s;

  for (let i = 0; i < 9; i++) {
    H[i] = H[i] / H[8];
  }
  return H as Matrix33;
};

export {
  solveHomography
};
