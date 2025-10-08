import { extract } from './extract';

export const extractTrackingFeatures = (imageList: {data: Uint8Array, width: number, height: number, scale: number}[], doneCallback: (index: number) => void) => {
  const featureSets = new Array<{data: Uint8Array, width: number, height: number, scale: number, points: {x: number, y: number}[]}>();
  for (let i = 0; i < imageList.length; i++) {
    const image = imageList[i];
    const points = extract(image);

    const featureSet = {
      data: image.data,
      scale: image.scale,
      width: image.width,
      height: image.height,
      points,
    };
    
    featureSets.push(featureSet);

    doneCallback(i);
  }
  return featureSets;
}
