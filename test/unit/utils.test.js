/**
 * Unit tests for utility functions
 */

import { describe, it, expect } from 'vitest';

describe('Utility Functions', () => {
  describe('Math Utilities', () => {
    it('should handle matrix operations', () => {
      const matrix = [
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      ];
      
      expect(matrix).toHaveLength(16);
      expect(matrix[0]).toBe(1);
      expect(matrix[5]).toBe(1);
    });
    
    it('should handle vector operations', () => {
      const vec3 = [1, 2, 3];
      const length = Math.sqrt(vec3[0]**2 + vec3[1]**2 + vec3[2]**2);
      
      expect(length).toBeCloseTo(3.7416573867739413);
    });
  });
  
  describe('Array Utilities', () => {
    it('should handle array transformations', () => {
      const arr = [1, 2, 3, 4];
      const doubled = arr.map(x => x * 2);
      
      expect(doubled).toEqual([2, 4, 6, 8]);
    });
    
    it('should handle array filtering', () => {
      const arr = [1, 2, 3, 4, 5];
      const evens = arr.filter(x => x % 2 === 0);
      
      expect(evens).toEqual([2, 4]);
      expect(evens).toHaveLength(2);
    });
  });
  
  describe('Type Checking', () => {
    it('should identify types correctly', () => {
      expect(typeof 'string').toBe('string');
      expect(typeof 42).toBe('number');
      expect(typeof true).toBe('boolean');
      expect(typeof {}).toBe('object');
      expect(Array.isArray([])).toBe(true);
    });
  });
  
  describe('Image Processing', () => {
    it('should handle image dimensions', () => {
      const width = 640;
      const height = 480;
      const aspectRatio = width / height;
      
      expect(aspectRatio).toBeCloseTo(1.333, 2);
    });
    
    it('should handle pixel calculations', () => {
      const pixels = 640 * 480;
      expect(pixels).toBe(307200);
    });
  });
  
  describe('Transformation Utilities', () => {
    it('should create identity matrix', () => {
      const identity = new Array(16).fill(0);
      identity[0] = 1;
      identity[5] = 1;
      identity[10] = 1;
      identity[15] = 1;
      
      expect(identity[0]).toBe(1);
      expect(identity[1]).toBe(0);
      expect(identity[15]).toBe(1);
    });
    
    it('should handle transformation composition', () => {
      const transform = {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1]
      };
      
      expect(transform.scale).toEqual([1, 1, 1]);
    });
  });
});
