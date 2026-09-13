import { describe, it, expect } from 'vitest';
import {
  calculateBmi,
  calculateIdealWeight,
  calculateNormalWeightRange,
  getBmiCategory,
} from './bmiCalculator';

describe('BMI Calculator Tests (KSSO Standard)', () => {
  describe('getBmiCategory', () => {
    it('correctly classifies underweight (< 18.5)', () => {
      expect(getBmiCategory(18.4)).toBe('underweight');
      expect(getBmiCategory(15.0)).toBe('underweight');
    });

    it('correctly classifies normal (18.5 - 22.9)', () => {
      expect(getBmiCategory(18.5)).toBe('normal');
      expect(getBmiCategory(21.0)).toBe('normal');
      expect(getBmiCategory(22.9)).toBe('normal');
    });

    it('correctly classifies pre-obese / overweight (23.0 - 24.9)', () => {
      expect(getBmiCategory(23.0)).toBe('pre-obese');
      expect(getBmiCategory(24.5)).toBe('pre-obese');
      expect(getBmiCategory(24.9)).toBe('pre-obese');
    });

    it('correctly classifies stage 1 obesity (25.0 - 29.9)', () => {
      expect(getBmiCategory(25.0)).toBe('obese-1');
      expect(getBmiCategory(27.5)).toBe('obese-1');
      expect(getBmiCategory(29.9)).toBe('obese-1');
    });

    it('correctly classifies stage 2 obesity (30.0 - 34.9)', () => {
      expect(getBmiCategory(30.0)).toBe('obese-2');
      expect(getBmiCategory(32.0)).toBe('obese-2');
      expect(getBmiCategory(34.9)).toBe('obese-2');
    });

    it('correctly classifies stage 3 severe obesity (>= 35.0)', () => {
      expect(getBmiCategory(35.0)).toBe('obese-3');
      expect(getBmiCategory(40.0)).toBe('obese-3');
    });
  });

  describe('calculateIdealWeight', () => {
    it('calculates standard weight for male (height^2 * 22)', () => {
      // 1.7 * 1.7 * 22 = 63.58 -> 63.6
      expect(calculateIdealWeight(170, 'male')).toBe(63.6);
    });

    it('calculates standard weight for female (height^2 * 21)', () => {
      // 1.6 * 1.6 * 21 = 53.76 -> 53.8
      expect(calculateIdealWeight(160, 'female')).toBe(53.8);
    });
  });

  describe('calculateNormalWeightRange', () => {
    it('calculates normal weight range for height (18.5 - 22.9)', () => {
      // 1.7 * 1.7 * 18.5 = 53.465 -> 53.5
      // 1.7 * 1.7 * 22.9 = 66.181 -> 66.2
      const range = calculateNormalWeightRange(170);
      expect(range.min).toBe(53.5);
      expect(range.max).toBe(66.2);
    });
  });

  describe('calculateBmi integrated analysis', () => {
    it('correctly analyzes normal BMI and maintain status', () => {
      const result = calculateBmi({
        height: 170,
        weight: 60,
        gender: 'male',
      });

      // 60 / (1.7 * 1.7) = 20.761 -> 20.8
      expect(result.bmi).toBe(20.8);
      expect(result.category).toBe('normal');
      expect(result.weightDiffStatus).toBe('maintain');
      expect(result.weightDiff).toBe(0);
    });

    it('correctly analyzes overweight and calculates weight to lose', () => {
      const result = calculateBmi({
        height: 170,
        weight: 75,
        gender: 'male',
      });

      // 75 / (1.7 * 1.7) = 25.95 -> 26.0
      expect(result.bmi).toBe(26.0);
      expect(result.category).toBe('obese-1');
      expect(result.weightDiffStatus).toBe('lose');
      // max normal is 66.2, weight is 75 -> diff 8.8
      expect(result.weightDiff).toBe(8.8);
      expect(result.weightDiffLabel).toContain('감량 권장');
    });

    it('correctly analyzes underweight and calculates weight to gain', () => {
      const result = calculateBmi({
        height: 170,
        weight: 48,
        gender: 'female',
      });

      // 48 / (1.7 * 1.7) = 16.6
      expect(result.bmi).toBe(16.6);
      expect(result.category).toBe('underweight');
      expect(result.weightDiffStatus).toBe('gain');
      // min normal is 53.5, weight is 48 -> diff 5.5
      expect(result.weightDiff).toBe(5.5);
      expect(result.weightDiffLabel).toContain('증량 권장');
    });
  });
});
