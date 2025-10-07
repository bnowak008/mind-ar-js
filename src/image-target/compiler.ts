import { CompilerBase } from './compiler-base'
import type { ImageData } from './utils/images.js';


export class Compiler extends CompilerBase {
  createProcessCanvas(img: HTMLImageElement) {
    const processCanvas = document.createElement('canvas');
    processCanvas.width = img.width;
    processCanvas.height = img.height;
    return processCanvas;
  }

  compileTrack({progressCallback, targetImages, basePercent}: {progressCallback: (percent: number) => void, targetImages: ImageData[], basePercent: number}) {
    return new Promise<any[]>((resolve, reject) => {
      const worker = new Worker(new URL('./compiler.worker.js', import.meta.url), { type: 'module' });
      worker.onmessage = (e: MessageEvent) => {
        if (e.data.type === 'progress') {
          progressCallback(basePercent + e.data.percent * (100-basePercent)/100);
        } else if (e.data.type === 'compileDone') {
          resolve(e.data.list);
        }
      };
      worker.postMessage({ type: 'compile', targetImages });
    });
  }
}
