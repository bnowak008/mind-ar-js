import {match} from './matching';
import {type ClusterNode} from './hierarchical-clustering';

export type Point = {
  x: number;
  y: number;
  scale?: number;
  angle?: number;
  descriptors?: number[];
  maxima?: boolean;
};

export type Match = {
  querypoint: Point;
  keypoint: Point;
};

export type DebugExtra = {
  matches?: Match[];
  houghMatches?: Match[];
  inlierMatches?: Match[];
  matches2?: Match[];
  houghMatches2?: Match[];
  inlierMatches2?: Match[];
};

class Matcher {
  queryWidth: number;
  queryHeight: number;
  debugMode: boolean;

  constructor(queryWidth: number, queryHeight: number, debugMode = false) {
    this.queryWidth = queryWidth;
    this.queryHeight = queryHeight;
    this.debugMode = debugMode;
  }

  matchDetection(keyframes: {width: number, height: number, maximaPoints: {x: number, y: number, descriptors: number[]}[], minimaPoints: {x: number, y: number, descriptors: number[]}[], maximaPointsCluster: {rootNode: ClusterNode}, minimaPointsCluster: {rootNode: ClusterNode}}, featurePoints: {x: number, y: number, descriptors: number[]}[]) {
    let debugExtra: {frames: DebugExtra[]} = {frames: []};

    let bestResult = null;
    const keyframeList = [...keyframes.maximaPoints, ...keyframes.minimaPoints];
    for (let i = 0; i < keyframeList.length; i++) {
      const {H, matches, debugExtra: frameDebugExtra} = match({keyframe: keyframes, querypoints: featurePoints, querywidth: this.queryWidth, queryheight: this.queryHeight, debugMode: this.debugMode});
      debugExtra.frames.push(frameDebugExtra);

      if (H && matches) {
	if (bestResult === null || bestResult.matches!.length < matches.length) {
	  bestResult = {keyframeIndex: i, H, matches};
	}
      }
    }

    if (bestResult === null) {
      return {keyframeIndex: -1, debugExtra};
    }

    const screenCoords = [];
    const worldCoords = [];
    const keyframe = keyframeList[bestResult.keyframeIndex];
    for (let i = 0; i < bestResult.matches.length; i++) {
      const querypoint = bestResult.matches[i].querypoint;
      const keypoint = bestResult.matches[i].keypoint;
      screenCoords.push({
        x: querypoint.x,
        y: querypoint.y,
      })
      worldCoords.push({
        x: (keypoint.x + 0.5) / keyframes.width,
        y: (keypoint.y + 0.5) / keyframes.height,
        z: 0,
      })
    }
    return {screenCoords, worldCoords, keyframeIndex: bestResult.keyframeIndex, debugExtra};
  }
}

export {
  Matcher
}
