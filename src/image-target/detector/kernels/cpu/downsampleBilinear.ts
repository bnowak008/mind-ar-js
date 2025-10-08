import * as FakeShader from './fakeShader.js';
import type { TensorInfo, KernelConfig } from '@tensorflow/tfjs';
import type { MathBackendCPU } from '@tensorflow/tfjs-backend-cpu';

type CPUKernel = {
  variableNames: string[];
  outputShape: number[];
  userCode: () => void;
};

type DownsampleBilinearArgs = {
  inputs: { image: TensorInfo };
  backend: MathBackendCPU;
};

export const downsampleBilinear = (args: DownsampleBilinearArgs): TensorInfo => {
    const x = args.inputs.image;
    const backend = args.backend;

    const kernel: CPUKernel = {
        variableNames: ['p'],
        outputShape: [Math.floor(x.shape[0] / 2), Math.floor(x.shape[1] / 2)],
        userCode:
            function () {
                const coords = this.getOutputCoords();
                const y = coords[0] * 2;
                const x = coords[1] * 2;
                let sum = new Float32Array(1);
                sum[0] = Math.fround(this.getP(y, x) * 0.25);
                sum[0] += Math.fround(this.getP(y + 1, x) * 0.25);
                sum[0] += Math.fround(this.getP(y, x + 1) * 0.25);
                sum[0] += Math.fround(this.getP(y + 1, x + 1) * 0.25);
                
                this.setOutput(sum[0]);
            }
    }
    return FakeShader.runCode(backend, kernel, [x], x.dtype);
}

export const downsampleBilinearConfig: KernelConfig = {
    kernelName: "DownsampleBilinear",
    backendName: 'cpu',
    kernelFunc: downsampleBilinear,
};
