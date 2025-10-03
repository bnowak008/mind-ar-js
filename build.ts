#!/usr/bin/env bun

import { existsSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { buildConfigs } from './bun.config.ts';

// Bun.js native build configuration
interface BuildOptions {
  entrypoints: string[];
  outdir: string;
  target: 'browser' | 'node' | 'bun';
  format: 'esm' | 'cjs' | 'iife';
  minify?: boolean;
  sourcemap?: 'inline' | 'linked' | 'external' | boolean;
  external?: string[];
  naming?: {
    entry: string;
  };
  plugins?: any[];
}

// Plugins are now imported from bun.config.ts

async function buildWithConfig(config: BuildOptions, name: string) {
  console.log(`Building ${name}...`);
  const startTime = Date.now();
  
  // Only clean output directory if it's a fresh build
  if (config.outdir === './dist-dev' || !existsSync(config.outdir)) {
    if (existsSync(config.outdir)) {
      rmSync(config.outdir, { recursive: true, force: true });
    }
    mkdirSync(config.outdir, { recursive: true });
  } else {
    // For production builds, just ensure directory exists
    mkdirSync(config.outdir, { recursive: true });
  }

  const buildOptions = {
    ...config
  };

  try {
    const result = await Bun.build(buildOptions);
    const duration = Date.now() - startTime;
    console.log(`⚡ Build completed in ${duration}ms`);
    
    if (result.success) {
      console.log(`✅ ${name} build completed successfully`);
      console.log(`   Output: ${config.outdir}`);
      console.log(`   Files: ${result.outputs.length}`);
      
      // Log output files with sizes
      result.outputs.forEach(output => {
        const size = (output.size / 1024 / 1024).toFixed(2);
        console.log(`   📦 ${output.path} (${size} MB)`);
      });
    } else {
      console.error(`❌ ${name} build failed:`);
      result.logs.forEach(log => {
        if (log.level === 'error') {
          console.error(`   ${log.level}: ${log.message}`);
        } else if (log.level === 'warning') {
          console.warn(`   ${log.level}: ${log.message}`);
        }
      });
      return false;
    }
  } catch (error) {
    console.error(`❌ ${name} build error:`, error);
    return false;
  }
  
  return true;
}

async function main() {
  const mode = process.argv[2] || 'dev';
  
  console.log('🚀 Starting MindAR build process with Bun.js native bundler...');
  
  let success = true;
  
  switch (mode) {
    case 'dev':
      success = await buildWithConfig(buildConfigs.dev, 'Development');
      break;
      
    case 'prod':
      success = await buildWithConfig(buildConfigs.core, 'Production');
      success = success && await buildWithConfig(buildConfigs.aframeImage, 'A-Frame Image');
      success = success && await buildWithConfig(buildConfigs.aframeFace, 'A-Frame Face');
      break;
      
    case 'aframe':
      success = await buildWithConfig(buildConfigs.aframeImage, 'A-Frame Image');
      success = success && await buildWithConfig(buildConfigs.aframeFace, 'A-Frame Face');
      break;
      
    case 'aframe-image':
      success = await buildWithConfig(buildConfigs.aframeImage, 'A-Frame Image');
      break;
      
    case 'aframe-face':
      success = await buildWithConfig(buildConfigs.aframeFace, 'A-Frame Face');
      break;
      
    default:
      console.error(`Unknown build mode: ${mode}`);
      process.exit(1);
  }
  
  if (success) {
    console.log('🎉 All builds completed successfully!');
  } else {
    console.error('❌ Build failed');
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
