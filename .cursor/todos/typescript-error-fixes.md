# TypeScript Error Fixes Todo List

## Description
This document tracks the systematic fixing of remaining TypeScript errors after the successful type consolidation. The errors are primarily in the detector system, kernel files, and TensorFlow.js integration. We'll use targeted fixes that maintain the existing architecture while making it TypeScript-compliant.

---

## Phase 1: Critical Application Logic Fixes

### 1.1 Fix Crop Detector Issues
- [ ] Fix `crop-detector.ts` parameter type annotations
  - [ ] Add type annotation for `inputImageT` parameter in `detect()` method
  - [ ] Add type annotation for `inputImageT` parameter in `detectMoving()` method  
  - [ ] Add type annotation for `inputImageT`, `startX`, `startY` parameters in `_detect()` method
  - [ ] Fix `result.debugExtra` null check and add proper type guards
  - [ ] Add missing `crop` and `projectedImage` properties to debug extra types

### 1.2 Fix Matcher Type Compatibility
- [ ] Fix `matcher.ts` Keyframe type mismatch
  - [ ] Update `ClusterNode.leaf` to be optional (`leaf?: boolean`) in clustering types
  - [ ] Ensure Keyframe type matches the actual usage pattern in matcher

### 1.3 Fix Detector Class Type Issues
- [ ] Add proper type annotations to `detector.ts` method parameters
  - [ ] Fix `imageData` parameter type in `detectImageData()` method
  - [ ] Fix `inputImageT` parameter type in `detect()` method
  - [ ] Fix `extremaFreaks` parameter type in `_computeFreakDescriptors()` method
  - [ ] Fix `pyramidImagesT`, `prunedExtremas`, `prunedExtremasAngles` parameter types
  - [ ] Fix `prunedExtremasT`, `pyramidImagesT` parameter types in `_computeOrientationHistograms()`
  - [ ] Fix `prunedExtremasList`, `dogPyramidImagesT` parameter types in `_computeLocalization()`
  - [ ] Fix `extremasResultsT` parameter type in `_computeExtremasResults()`

### 1.4 Fix TensorFlow.js Array/Tensor Type Issues
- [ ] Fix `arraySync()` calls on potentially array types
  - [ ] Add type guards to check if tensor is single tensor vs array before calling `arraySync()`
  - [ ] Fix `dispose()` calls on potentially array types
  - [ ] Fix `shape` property access on potentially array types
  - [ ] Fix `length` property access on complex union types

### 1.5 Fix Input Loader Type Issues
- [ ] Add proper type annotations to `input-loader.ts` method parameters
  - [ ] Fix `width`, `height` parameter types in constructor
  - [ ] Fix `input` parameter type in `_loadInput()` method
  - [ ] Fix `input` parameter type in `loadInput()` method
  - [ ] Fix `program`, `inputs` parameter types in `_compileAndRun()` method
  - [ ] Fix `program`, `inputs`, `outputType` parameter types in `_runWebGLProgram()` method

## Phase 2: Kernel System Type Fixes

### 2.1 Fix CPU Kernel Type Issues
- [ ] Fix `binomialFilter.ts` kernel function signature
  - [ ] Update `CPUKernelArgs` to match TensorFlow.js `KernelFunc` signature
  - [ ] Fix `KernelFunc` type assignment error
- [ ] Fix `buildExtremas.ts` tensor type issues
  - [ ] Fix `Tensor<Rank> | Tensor<Rank>[]` vs `TensorInfo` type mismatch
  - [ ] Fix `KernelFunc` type assignment error
- [ ] Fix `computeExtremaAngles.ts` backend values type
  - [ ] Fix `BackendValues | undefined` vs `Float32Array` type mismatch
  - [ ] Fix `KernelFunc` type assignment error
- [ ] Fix remaining CPU kernel files (10 files)
  - [ ] `computeExtremaFreak.ts`
  - [ ] `computeFreakDescriptors.ts`
  - [ ] `computeLocalization.ts`
  - [ ] `computeOrientationHistograms.ts`
  - [ ] `downsampleBilinear.ts`
  - [ ] `extremaReduction.ts`
  - [ ] `fakeShader.ts`
  - [ ] `prune.ts`
  - [ ] `smoothHistograms.ts`
  - [ ] `upsampleBilinear.ts`

### 2.2 Fix WebGL Kernel Type Issues
- [ ] Fix WebGL kernel files (10 files)
  - [ ] `buildExtremas.ts`
  - [ ] `computeExtremaAngles.ts`
  - [ ] `computeExtremaFreak.ts`
  - [ ] `computeFreakDescriptors.ts`
  - [ ] `computeLocalization.ts`
  - [ ] `computeOrientationHistograms.ts`
  - [ ] `downsampleBilinear.ts`
  - [ ] `extremaReduction.ts`
  - [ ] `smoothHistograms.ts`
  - [ ] `upsampleBilinear.ts`

### 2.3 Fix Kernel Execution System
- [ ] Fix `fakeShader.ts` type issues
  - [ ] Fix `BackendValues` type handling
  - [ ] Fix `MathCollection` vs `BackendValues` type mismatch
  - [ ] Fix variable initialization issues
- [ ] Fix detector kernel execution methods
  - [ ] Fix `_compileAndRun()` method signature and backend method calls
  - [ ] Fix `_runWebGLProgram()` method signature and backend method calls

## Phase 3: TensorFlow.js Integration Fixes

### 3.1 Fix Backend Method Access
- [ ] Fix missing backend methods
  - [ ] Add type assertions for `compileAndRun()` method
  - [ ] Add type assertions for `runWebGLProgram()` method
  - [ ] Add type assertions for `makeTensorInfo()` method
  - [ ] Add type assertions for `texData.get()` method
  - [ ] Add type assertions for `gpgpu.getTexture()` method

### 3.2 Fix Tensor Type Handling
- [ ] Fix complex tensor shape types
  - [ ] Add proper type guards for `number | number[] | number[][]` etc.
  - [ ] Fix array indexing on complex union types
  - [ ] Add proper type narrowing for tensor operations

### 3.3 Fix FREAKPOINTS Type Issues
- [ ] Fix `FREAKPOINTS` array type inference
  - [ ] Add explicit type annotation for `FREAKPOINTS` constant
  - [ ] Fix implicit `any[]` type issues

## Phase 4: Compiler and Build Fixes

### 4.1 Fix Offline Compiler Issues
- [ ] Fix `offline-compiler.ts` type issues
  - [ ] Fix `createProcessCanvas()` method signature mismatch
  - [ ] Fix `img` parameter type annotation
  - [ ] Fix destructuring parameter type annotations

### 4.2 Fix Build System Integration
- [ ] Ensure all fixes work with Bun build system
- [ ] Verify no breaking changes to existing functionality
- [ ] Test compilation with `bun tsc --noEmit`

## Phase 5: Verification and Testing

### 5.1 TypeScript Compilation
- [ ] Run `bun tsc --noEmit` to verify all errors are resolved
- [ ] Run `bun run build` to ensure build system works
- [ ] Check for any remaining implicit `any` types

### 5.2 Runtime Testing
- [ ] Test image target detection functionality
- [ ] Test face target detection functionality
- [ ] Verify kernel execution still works correctly
- [ ] Test TensorFlow.js integration

## Memory
- The kernel system is a custom implementation built on top of TensorFlow.js
- Most errors are due to type system mismatches between custom types and TensorFlow.js types
- The approach is to add proper type annotations and type guards rather than refactoring the architecture
- Kernel files use custom execution system (`FakeShader`) that bypasses TensorFlow.js kernel system
- Backend methods like `compileAndRun()` and `runWebGLProgram()` are custom extensions not in TensorFlow.js types
- Complex tensor shape types need proper type narrowing and guards
- The goal is to make the existing system TypeScript-compliant without breaking functionality
