#!/usr/bin/env bun

import { describe, it, expect, beforeAll, afterAll } from 'bun:test';

// Mock browser environment for testing
const mockWindow = {
  MINDAR: {},
  devicePixelRatio: 1,
  addEventListener: () => {},
  removeEventListener: () => {}
};

// Set up global mocks
global.window = mockWindow as any;
global.document = {
  createElement: () => ({
    style: {},
    setAttribute: () => {},
    appendChild: () => {},
    removeChild: () => {}
  }),
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
} as any;

// Bun.js native test configuration
describe('MindAR Core Tests', () => {
  beforeAll(() => {
    console.log('🧪 Setting up MindAR test environment...');
  });

  afterAll(() => {
    console.log('✅ MindAR tests completed');
  });

  describe('Image Target Module', () => {
    it('should load image target module', async () => {
      // Test that the module can be imported
      const module = await import('./src/image-target/index.js');
      expect(module).toBeDefined();
    });

    it('should have required exports', async () => {
      const module = await import('./src/image-target/index.js');
      expect(module.Controller).toBeDefined();
    });
  });

  describe('Face Target Module', () => {
    it('should load face target module', async () => {
      const module = await import('./src/face-target/index.js');
      expect(module).toBeDefined();
    });

    it('should have required exports', async () => {
      const module = await import('./src/face-target/index.js');
      expect(module.Controller).toBeDefined();
    });
  });

  describe('Three.js Integration', () => {
    it('should load three.js integration modules', async () => {
      const imageThree = await import('./src/image-target/three.js');
      const faceThree = await import('./src/face-target/three.js');
      
      expect(imageThree).toBeDefined();
      expect(faceThree).toBeDefined();
    });
  });

  describe('UI Components', () => {
    it('should load UI module', async () => {
      const ui = await import('./src/ui/ui.js');
      expect(ui.UI).toBeDefined();
    });
  });

  describe('Performance Utilities', () => {
    it('should load performance utilities', async () => {
      const perfUtils = await import('./src/libs/performance-utils.js');
      const tensorManager = await import('./src/libs/tensor-manager.js');
      
      expect(perfUtils).toBeDefined();
      expect(tensorManager).toBeDefined();
    });
  });
});

// Bun.js native test for build output
describe('Build Output Tests', () => {
  it('should have dist directory after build', () => {
    const fs = require('fs');
    expect(fs.existsSync('./dist')).toBe(true);
  });

  it('should have required build files', () => {
    const fs = require('fs');
    const distFiles = fs.readdirSync('./dist');
    
    // Check for the actual build output structure
    expect(distFiles).toContain('image-target');
    expect(distFiles).toContain('face-target');
    expect(distFiles).toContain('mindar-image-aframe');
    expect(distFiles).toContain('mindar-face-aframe');
  });
});
