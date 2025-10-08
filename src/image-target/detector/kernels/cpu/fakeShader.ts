import {zeros, map, flatten as mathjsflatten} from 'mathjs';
import type { TensorInfo, DataType } from '@tensorflow/tfjs';
import type { MathBackendCPU } from '@tensorflow/tfjs-backend-cpu';

type Kernel = {
  variableNames: string[];
  outputShape: number[];
  userCode: () => void;
};

type KernelExecutionContext = {
  getOutputCoords: () => number[];
  setOutput: (value: number) => void;
  int: (value: number) => number;
  atan: (y: number, x: number) => number;
} & Record<string, (...args: number[]) => number>;

function runCode(backend: MathBackendCPU, kernel: Kernel, inputs: TensorInfo[], dtype: DataType): TensorInfo {
    const inputData = inputs.map((value) => { return backend.data.get(value.dataId).values; });

    //create getter functions for every variable name, clamping the input.
    const tempData: KernelExecutionContext = {} as KernelExecutionContext;
    kernel.variableNames.forEach((name, index) => {
        const funName=`get${capFirstLetter(name)}`;
        //console.log("Making function:",funName,inputs[index].shape);
        tempData[funName] = function (...args: number[]): number {
            const inputIndex=index;
            for (let i = 0; i < args.length; i++) {
                args[i] = clampInt(args[i], 0, inputs[inputIndex].shape[i] );
            }
            return inputData[index][flatten(args, inputs[inputIndex].shape)];
        }
    });
    tempData.int=Math.trunc;
    tempData.atan=Math.atan2;
    //create an empty matrix to map the output size, because i'm lazy and want to use Matrix.map(...)
    //const temp = new Matrix();
    //console.log("Creating output shape:",kernel.outputShape);
    const temp=zeros(kernel.outputShape);//reshape([0,0,0],kernel.outputShape);
    const output = map(temp,(value, index, matrix) => {
        
        tempData.getOutputCoords = () => { return index; }
        let out: number;

        tempData.setOutput = (newValue: number) => { out = Number.isNaN(newValue) ? 0 : Math.fround(newValue); }
        //bind the method calls and run the code
        kernel.userCode.bind(tempData)();
        return out;
    })
    
    //output.flat()
    //convert the output from a matrix into a tensor
    
    return backend.makeOutput(mathjsflatten(output), kernel.outputShape, dtype);
}

function capFirstLetter(word: string): string {
    return word[0].toUpperCase() + word.substring(1);
}

function clampInt(n: number, min: number, max: number): number {
    return Math.min(Math.max(n, min), max - 1);
}

function flatten(input: number[], max: number[]): number {
    return input.reduce((prev, current, index) => {
        for (let i = index + 1; i < max.length; i++) {
            current *= max[i];
        }
        return prev + current;
    },0);
}

export { runCode };