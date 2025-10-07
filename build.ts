import { buildConfigs } from "./bun.config";
import { rm, mkdir } from "fs/promises";

console.log("Starting MindAR build process...");

// Clean dist directories
await rm("./dist", { recursive: true, force: true });
await rm("./dist-dev", { recursive: true, force: true });
await mkdir("./dist", { recursive: true });
await mkdir("./dist-dev", { recursive: true });

// Run all builds
console.log("Building core and dev modules...");
await Promise.all([
  Bun.build(buildConfigs.core),
  Bun.build(buildConfigs.dev),
]);

console.log("Building A-Frame modules...");
await Promise.all([
  Bun.build(buildConfigs.aframeImage),
  Bun.build(buildConfigs.aframeFace),
]);

console.log("✅ Build completed successfully!");
