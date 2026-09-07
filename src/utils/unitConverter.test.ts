import { describe, it, expect } from 'vitest';
import {
  CATEGORY_DEFAULTS,
  convertUnitValue,
  convertToAllUnits,
  formatUnitValue,
} from './unitConverter';

describe('Unit Converter Utility Tests', () => {
  describe('면적 (Area) 변환 검증', () => {
    it('84㎡는 약 25.41평으로 환산되어야 한다', () => {
      const pyeong = convertUnitValue(84, 'sqm', 'pyeong', 'area');
      expect(pyeong).toBeCloseTo(25.41, 1);
    });

    it('1평은 약 3.3058㎡로 환산되어야 한다', () => {
      const sqm = convertUnitValue(1, 'pyeong', 'sqm', 'area');
      expect(sqm).toBeCloseTo(3.3058, 3);
    });

    it('동일한 단위 간 변환은 원본 값을 그대로 유지해야 한다', () => {
      expect(convertUnitValue(100, 'sqm', 'sqm', 'area')).toBe(100);
    });
  });

  describe('무게 (Weight) 변환 검증', () => {
    it('순금 1돈은 정확히 3.75g이어야 한다', () => {
      const grams = convertUnitValue(1, 'don', 'g', 'weight');
      expect(grams).toBeCloseTo(3.75, 4);
    });

    it('고기 1근은 600g이어야 한다', () => {
      const grams = convertUnitValue(1, 'geun', 'g', 'weight');
      expect(grams).toBe(600);
    });

    it('1파운드(lb)는 약 453.59g이어야 한다', () => {
      const grams = convertUnitValue(1, 'lb', 'g', 'weight');
      expect(grams).toBeCloseTo(453.59, 2);
    });
  });

  describe('온도 (Temperature) 비선형 변환 검증', () => {
    it('섭씨 100℃는 화씨 212℉이어야 한다', () => {
      const fahrenheit = convertUnitValue(100, 'celsius', 'fahrenheit', 'temperature');
      expect(fahrenheit).toBe(212);
    });

    it('섭씨 0℃는 화씨 32℉ 및 켈빈 273.15K이어야 한다', () => {
      const f = convertUnitValue(0, 'celsius', 'fahrenheit', 'temperature');
      const k = convertUnitValue(0, 'celsius', 'kelvin', 'temperature');
      expect(f).toBe(32);
      expect(k).toBe(273.15);
    });

    it('화씨 100℉는 섭씨 약 37.78℃이어야 한다', () => {
      const c = convertUnitValue(100, 'fahrenheit', 'celsius', 'temperature');
      expect(c).toBeCloseTo(37.78, 2);
    });
  });

  describe('일괄 변환 및 포맷터 검증', () => {
    it('convertToAllUnits는 카테고리 내 모든 단위 변환 결과를 배열로 반환해야 한다', () => {
      const results = convertToAllUnits(100, 'm', 'length', 2);
      expect(results.length).toBeGreaterThan(5);
      const cmResult = results.find((r) => r.unit.id === 'cm');
      expect(cmResult?.value).toBe(10000);
      expect(cmResult?.formattedValue).toBe('10,000.00');
    });

    it('formatUnitValue 정밀도(0, 2, 4자리)를 올바르게 적용해야 한다', () => {
      expect(formatUnitValue(25.4128, 0)).toBe('25');
      expect(formatUnitValue(25.4128, 2)).toBe('25.41');
      expect(formatUnitValue(25.4128, 4)).toBe('25.4128');
    });
  });

  describe('카테고리별 생활 밀착 초기 기본값 검증', () => {
    it('각 카테고리별 1순위 프리셋 및 기본 상호 단위가 올바르게 매핑되어 있어야 한다', () => {
      // 면적: 84㎡ -> 평
      expect(CATEGORY_DEFAULTS.area).toEqual({ fromUnitId: 'sqm', toUnitId: 'pyeong', inputValue: 84 });
      // 길이: 1인치 -> cm
      expect(CATEGORY_DEFAULTS.length).toEqual({ fromUnitId: 'in', toUnitId: 'cm', inputValue: 1 });
      // 무게: 1돈 -> g
      expect(CATEGORY_DEFAULTS.weight).toEqual({ fromUnitId: 'don', toUnitId: 'g', inputValue: 1 });
      // 부피: 1갤런 -> L
      expect(CATEGORY_DEFAULTS.volume).toEqual({ fromUnitId: 'gal', toUnitId: 'l', inputValue: 1 });
      // 온도: 36.5℃ -> ℉
      expect(CATEGORY_DEFAULTS.temperature).toEqual({ fromUnitId: 'celsius', toUnitId: 'fahrenheit', inputValue: 36.5 });
    });
  });
});
