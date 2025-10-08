import {tensor} from '@tensorflow/tfjs';
import * as FakeShader from './fakeShader.js';
import type { TensorInfo, KernelConfig } from '@tensorflow/tfjs';
import type { MathBackendCPU } from '@tensorflow/tfjs-backend-cpu';

type CPUKernel = {
  variableNames: string[];
  outputShape: number[];
  userCode: () => void;
};

type ComputeLocalizationArgs = {
  inputs: {
    prunedExtremasList: number[][];
    dogPyramidImagesT: TensorInfo[];
  };
  backend: MathBackendCPU;
};

function GetProgram(numDogPyramidImages: number, extremasListLength: number): CPUKernel {
	
	const dogVariableNames = [];
	
	for (let i = 1; i < numDogPyramidImages; i++) {  
		dogVariableNames.push('image' + i);
	}
	

	const program = {
		variableNames: [...dogVariableNames, 'extrema'],
		outputShape: [extremasListLength, 3, 3], // 3x3 pixels around the extrema
		userCode: function () {
			const getPixel = (octave, y, x) => {
				const k = 'getImage' + octave
				if (!this.hasOwnProperty(k)) {
					throw new Error(`ComputeLocalization:: ${k} does not exist`);
				}
				return this[k](y, x);
			}
			const coords = this.getOutputCoords();
			const featureIndex = coords[0];
			const score = this.getExtrema(featureIndex, 0);
			if (score == 0.0) {
				return;
			}

			const dy = coords[1] - 1;
			const dx = coords[2] - 1;
			const octave = this.int(this.getExtrema(featureIndex, 1));
			const y = this.int(this.getExtrema(featureIndex, 2));
			const x = this.int(this.getExtrema(featureIndex, 3));
			this.setOutput(getPixel(octave, y + dy, x + dx));
		}

	};
	//}
	return program;
}



const int = Math.trunc;
function clamp(n: number, min: number, max: number): number {
	return Math.min(Math.max(min, n), max - 1);
}






export const computeLocalization = (args: ComputeLocalizationArgs): TensorInfo => {
	const { prunedExtremasList, dogPyramidImagesT } = args.inputs;
	const backend = args.backend;
	
	const program = GetProgram(dogPyramidImagesT.length, prunedExtremasList.length);
	const prunedExtremasT = tensor(prunedExtremasList, [prunedExtremasList.length, prunedExtremasList[0].length], 'int32');
	return FakeShader.runCode(backend, program, [...dogPyramidImagesT.slice(1), prunedExtremasT], dogPyramidImagesT[0].dtype);
}

export const computeLocalizationConfig: KernelConfig = {
	kernelName: "ComputeLocalization",
	backendName: 'cpu',
	kernelFunc: computeLocalization,
};

