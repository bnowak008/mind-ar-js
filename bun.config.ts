// Bun.js native configuration for MindAR
import type { BunPlugin } from "bun";

// HTML import plugin for Bun.js native support
const htmlPlugin: BunPlugin = {
  name: "html-import",
  setup(build) {
    build.onLoad({ filter: /\.html$/ }, async (args) => {
      const file = await Bun.file(args.path).text();
      return {
        contents: `export default ${JSON.stringify(file)};`,
        loader: "js",
      };
    });
  },
};

// CSS/SCSS import plugin
const cssPlugin: BunPlugin = {
  name: "css-import",
  setup(build) {
    build.onLoad({ filter: /\.(scss|css)$/ }, async (args) => {
      const file = await Bun.file(args.path).text();
      return {
        contents: `export default ${JSON.stringify(file)};`,
        loader: "js",
      };
    });
  },
};

// Worker plugin for Web Workers
const workerPlugin: BunPlugin = {
  name: "worker-import",
  setup(build) {
    build.onLoad({ filter: /\.worker\.js$/ }, async (args) => {
      return {
        contents: `export default new Worker(new URL('${args.path}', import.meta.url));`,
        loader: "js",
      };
    });
  },
};

// Performance monitoring plugin (simplified for Bun.js compatibility)
const performancePlugin: BunPlugin = {
  name: "performance-monitor",
  setup(build) {
    // Performance monitoring will be handled in the build script
    console.log("⚡ Performance monitoring enabled");
  },
};

// Export plugins for use in build scripts
export const plugins = [htmlPlugin, cssPlugin, workerPlugin, performancePlugin];

// Build configurations
export const buildConfigs = {
  // Core library builds
  core: {
    entrypoints: [
      "./src/image-target/index.js",
      "./src/image-target/three.js",
      "./src/face-target/index.js",
      "./src/face-target/three.js",
    ],
    outdir: "./dist",
    target: "browser" as const,
    format: "esm" as const,
    minify: true,
    sourcemap: "none" as const,
    external: [
      "three",
      "three/examples/jsm/*",
      "@tensorflow/tfjs",
      "@tensorflow/tfjs-backend-webgl",
      "@tensorflow/tfjs-backend-webgpu",
      "@mediapipe/tasks-vision",
    ],
    naming: {
      entry: "[dir]/[name].es",
    },
    plugins,
  },

  // Development builds
  dev: {
    entrypoints: [
      "./src/image-target/index.js",
      "./src/image-target/three.js",
      "./src/face-target/index.js",
      "./src/face-target/three.js",
    ],
    outdir: "./dist-dev",
    target: "browser" as const,
    format: "esm" as const,
    minify: false,
    sourcemap: "inline" as const,
    external: [
      "three",
      "three/examples/jsm/*",
      "@tensorflow/tfjs",
      "@tensorflow/tfjs-backend-webgl",
      "@tensorflow/tfjs-backend-webgpu",
      "@mediapipe/tasks-vision",
    ],
    naming: {
      entry: "[dir]/[name].es",
    },
    plugins,
  },

  // A-Frame builds
  aframeImage: {
    entrypoints: ["./src/image-target/aframe.js"],
    outdir: "./dist",
    target: "browser" as const,
    format: "iife" as const,
    external: ["three"],
    naming: {
      entry: "mindar-image-aframe",
    },
    plugins,
  },

  aframeFace: {
    entrypoints: ["./src/face-target/aframe.js"],
    outdir: "./dist",
    target: "browser" as const,
    format: "iife" as const,
    external: ["three"],
    naming: {
      entry: "mindar-face-aframe",
    },
    plugins,
  },
};

export default buildConfigs;
