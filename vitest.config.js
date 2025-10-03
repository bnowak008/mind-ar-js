import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'happy-dom',
    
    // Global test utilities
    globals: true,
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        'dist-dev/',
        'dist-types/',
        'examples/',
        'testing/',
        'custom_tfjs/',
        '**/*.d.ts',
        '**/*.config.js',
        '**/test/**',
        '**/*.test.js',
        '**/*.spec.js'
      ],
      include: ['src/**/*.js'],
      all: true,
      lines: 70,
      functions: 70,
      branches: 70,
      statements: 70
    },
    
    // Test file patterns
    include: ['src/**/*.test.js', 'src/**/*.spec.js', 'test/**/*.test.js'],
    
    // Setup files
    setupFiles: [],
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporters
    reporters: ['verbose'],
    
    // Watch mode
    watch: false,
    
    // Snapshot serializers
    snapshotFormat: {
      printBasicPrototype: false
    }
  },
  
  resolve: {
    alias: {
      'three/addons/': 'three/examples/jsm/'
    }
  }
});
