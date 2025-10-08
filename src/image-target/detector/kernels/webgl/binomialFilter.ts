import type { TensorInfo, KernelConfig, KernelFunc } from '@tensorflow/tfjs';
import type { MathBackendWebGL } from '@tensorflow/tfjs-backend-webgl';

type WebGLKernel = {
  variableNames: string[];
  outputShape: number[];
  userCode: string;
};

const cache: Record<string, [WebGLKernel, WebGLKernel]> = {};

function GetKernels(image: TensorInfo): [WebGLKernel, WebGLKernel] {
  const imageWidth = image.shape[1];
  const imageHeight = image.shape[0];
  const key = 'w' + imageWidth + "h" + imageHeight;
  if(!cache.hasOwnProperty(key)){
    const kernel1 = {
      variableNames: ['p'],
      outputShape: [imageHeight, imageWidth],
      userCode: `
        void main() {
          ivec2 coords = getOutputCoords();

          float sum = getP(coords[0], coords[1]-2);
          sum += getP(coords[0], coords[1]-1) * 4.;
          sum += getP(coords[0], coords[1]) * 6.;
          sum += getP(coords[0], coords[1]+1) * 4.;
          sum += getP(coords[0], coords[1]+2);
          setOutput(sum);
        }
      `
    };
    const kernel2 = {
      variableNames: ['p'],
      outputShape: [imageHeight, imageWidth],
      userCode: `
        void main() {
          ivec2 coords = getOutputCoords();

          float sum = getP(coords[0]-2, coords[1]);
          sum += getP(coords[0]-1, coords[1]) * 4.;
          sum += getP(coords[0], coords[1]) * 6.;
          sum += getP(coords[0]+1, coords[1]) * 4.;
          sum += getP(coords[0]+2, coords[1]);
          sum /= 256.;
          setOutput(sum);
        }
      `
    };
    cache[key]=[kernel1,kernel2];
  }
  return cache[key];
}

export const binomialFilter: KernelFunc = (args) => {
  const image = args.inputs.image;
  const backend = args.backend as MathBackendWebGL;

  if (!image || !backend) {
    throw new Error('Invalid arguments');
  }
  
  const[kernel1,kernel2]=GetKernels(image);
  
  const result1=backend.runWebGLProgram(kernel1,[image],image.dtype);
  const result2=backend.runWebGLProgram(kernel2,[result1],image.dtype);  
  backend.disposeIntermediateTensorInfo(result1);
  return result2;
}




export const binomialFilterConfig: KernelConfig = {
    kernelName: "BinomialFilter",
    backendName: 'webgl',
    kernelFunc: binomialFilter,
};


