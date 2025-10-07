# Project Modernization Todo List

## Description
This document outlines the tasks required to modernize the `mind-ar-js` project. The key goals are to migrate from Vite to Bun for package management and bundling, transition the codebase from JavaScript to TypeScript, replace local libraries with npm packages, and explore performance optimizations with WebAssembly.

---

## Phase 1: Project Setup & Dependency Management
- [x] Initialize Bun
  - [x] Remove `package-lock.json` and `node_modules` directory
  - [x] Run `bun install` to generate `bun.lockb`
- [ ] Update Dependencies
  - [ ] Run `bun update` to upgrade all packages
- [ ] Replace `src/libs` with npm packages
  - [ ] Replace `one-euro-filter.js`
    - [x] Add `1eurofilter` package: `bun add 1eurofilter`
    - [x] Refactor code to import from the new package
    - [x] Delete `src/libs/one-euro-filter.js`
  - [ ] Standardize OpenCV
    - [x] Add `@techstark/opencv-js` to `package.json`: `bun add @techstark/opencv-js` (as it's used in `opencv-helper.js`)
    - [x] Refactor `opencv-helper.js` to ensure it works correctly with the managed dependency
    - [x] Remove `src/libs/opencv.js` and `src/libs/opencv-wasm.js`

## Phase 2: Build System Migration to Bun
- [x] Create Bun Build Script
  - [x] Create a `build.js` script using `Bun.build()` API
  - [x] Replicate `vite.config.prod.js` logic:
    - [x] Define multiple entry points (face/image tracking)
    - [x] Configure multiple output formats (ESM, IIFE)
    - [x] Set `three` as an external dependency
    - [x] Implement file renaming logic
- [ ] Update `package.json` Scripts
  - [x] Replace `vite` build scripts with `bun run build.js`
  - [x] Create a `dev` script using Bun's bundler with `--hot` flag
- [x] Remove Vite
  - [x] Uninstall Vite dependencies: `bun remove vite @vitejs/plugin-basic-ssl`
  - [x] Delete `vite.config.dev.js` and `vite.config.prod.js`

## Phase 3: TypeScript Migration
- [ ] Setup TypeScript
  - [x] Add TypeScript and Bun types: `bun add -d typescript @types/bun`
  - [x] Create a strict `tsconfig.json` file
- [ ] Incrementally Migrate Codebase
  - [ ] Prioritize converting utility modules and files with fewer dependencies first
  - [x] Convert `cumsum.js` to `cumsum.ts` and add types
  - [x] Convert `geometry.js` to `geometry.ts` and add types
  - [x] Convert `homography.js` to `homography.ts` and add types
  - [x] Fix `cumsum.ts` module issue and update imports
  - [ ] Rename `.js` files to `.ts` one by one
  - [ ] Add explicit types for function signatures, complex objects, and module APIs
- [ ] Add Type Definitions
  - [x] Install `@types/*` packages for any dependencies that lack bundled types

## Phase 4: Code Refactoring & Optimization
- [ ] Leverage Bun Native APIs
  - [ ] Replace Node.js APIs (e.g., `fs`, `path`) with `Bun.*` APIs in build scripts and other non-browser code
- [ ] Adopt Modern JavaScript/TypeScript Features
  - [ ] Refactor code to use modern syntax (e.g., optional chaining, nullish coalescing)

## Phase 5: WebAssembly for Heavy Computations
- [ ] Identify Performance Bottlenecks
  - [ ] Profile the application to find CPU-intensive functions in the computer vision pipeline (feature detection, matching, tracking)
- [ ] Develop WebAssembly Modules
  - [ ] Choose a language for Wasm compilation (e.g., Rust, C++, AssemblyScript)
  - [ ] Rewrite the identified bottlenecks in the chosen language
- [ ] Integrate WebAssembly
  - [ ] Set up the toolchain for compiling to `.wasm`
  - [ ] Load and interface with the Wasm modules from the TypeScript codebase

## Memory
- The project is being modernized to improve maintainability, performance, and developer experience.
- Key changes include adopting Bun, TypeScript, and replacing local `libs` with managed npm packages.
- Vite is being replaced entirely by Bun's built-in bundler.
- The `1eurofilter` npm package will be used to replace the local copy.
- OpenCV will be managed via the `@techstark/opencv-js` npm package, which was implicitly used before.
