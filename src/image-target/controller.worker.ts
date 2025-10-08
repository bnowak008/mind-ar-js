import { Matcher } from './matching/matcher.js';
import { Estimator } from './estimation/estimator.js';

let projectionTransform: number[][] | null = null;
let matchingDataList: any[] | null = null;
let debugMode = false;
let matcher: Matcher | null = null;
let estimator: Estimator | null = null;

onmessage = (msg: MessageEvent) => {
  const { data } = msg;

  switch (data.type) {
    case "setup":
      projectionTransform = data.projectionTransform;
      matchingDataList = data.matchingDataList;
      debugMode = data.debugMode;
      matcher = new Matcher(data.inputWidth, data.inputHeight, debugMode);
      estimator = new Estimator(data.projectionTransform);
      break;

    case "match":
      if (!matcher || !estimator) {
        throw new Error('Matcher or estimator not initialized');
      }
      
      const interestedTargetIndexes = data.targetIndexes;

      let matchedTargetIndex = -1;
      let matchedModelViewTransform = null;
      let matchedDebugExtra = null;

      for (let i = 0; i < interestedTargetIndexes.length; i++) {
        const matchingIndex = interestedTargetIndexes[i];

        const { keyframeIndex, screenCoords, worldCoords, debugExtra } = matcher.matchDetection(matchingDataList?.[matchingIndex], data.featurePoints);
        matchedDebugExtra = debugExtra;

        if (keyframeIndex !== -1 && screenCoords && worldCoords) {
          const modelViewTransform = estimator.estimate({ screenCoords, worldCoords, projectionTransform: projectionTransform! });

          if (modelViewTransform) {
            matchedTargetIndex = matchingIndex;
            matchedModelViewTransform = modelViewTransform;
          }
          break;
        }
      }

      postMessage({
        type: 'matchDone',
        targetIndex: matchedTargetIndex,
        modelViewTransform: matchedModelViewTransform,
        debugExtra: matchedDebugExtra
      });
      break;

    case 'trackUpdate':
      const { modelViewTransform, worldCoords, screenCoords } = data;
      const finalModelViewTransform = estimator?.refineEstimate({ initialModelViewTransform: modelViewTransform, worldCoords, screenCoords, projectionTransform: projectionTransform! });
      postMessage({
        type: 'trackUpdateDone',
        modelViewTransform: finalModelViewTransform,
      });
      break;

    case "dispose":
      close();
      break;

    default:
      throw new Error(`Invalid message type '${data.type}'`);
  }
};

