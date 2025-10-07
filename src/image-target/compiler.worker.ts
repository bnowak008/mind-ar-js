import { extractTrackingFeatures } from './tracker/extract-utils.js';
import { buildTrackingImageList } from './image-list.js';
import type { ImageData } from './utils/images.js';

declare const self: Worker;

onmessage = (msg: MessageEvent) => {
  const { data } = msg;
  if (data.type === 'compile') {
    //console.log("worker compile...");
    const { targetImages } = data as {targetImages: ImageData[]};
    const percentPerImage = 100.0 / targetImages.length;
    let percent = 0.0;
    const list = [];
    for (let i = 0; i < targetImages.length; i++) {
      const targetImage = targetImages[i];
      const imageList = buildTrackingImageList(targetImage);
      const percentPerAction = percentPerImage / imageList.length;

      //console.log("compiling tracking...", i);
      const trackingData = extractTrackingFeatures(imageList, (index: number) => {
        //console.log("done tracking", i, index);
        percent += percentPerAction
        self.postMessage({ type: 'progress', percent });
      });
      list.push(trackingData);
    }
    self.postMessage({
      type: 'compileDone',
      list,
    });
  }
};
