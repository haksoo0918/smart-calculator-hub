import { describe, it, expect } from 'vitest';
import {
  calculateSalary,
  calculateNationalPension,
  calculateHealthInsurance,
  calculateLongTermCare,
  calculateEmploymentInsurance,
  calculateMonthlyIncomeTax,
  floorToTens,
  SALARY_CONSTANTS,
} from './salaryCalculator';
import { SalaryInput } from '../types/salary';

describe('salaryCalculator Tests', () => {
  describe('기본 단위 함수 검증 (floorToTens, 4대보험 개별 계산)', () => {
    it('floorToTens는 10원 미만을 정상적으로 절사해야 한다', () => {
      expect(floorToTens(12345)).toBe(12340);
      expect(floorToTens(12349)).toBe(12340);
      expect(floorToTens(12340)).toBe(12340);
      expect(floorToTens(0)).toBe(0);
      expect(floorToTens(-100)).toBe(0);
    });

    it('국민연금은 4.5%를 적용하고 상한액(6,170,000원 기준 월 277,650원)을 초과하지 않아야 한다', () => {
      // 월 과세 300만 원 -> 3,000,000 * 0.045 = 135,000원
      expect(calculateNationalPension(3_000_000)).toBe(135_000);

      // 월 과세 1,000만 원 (상한 초과) -> 6,170,000 * 0.045 = 277,650원
      expect(calculateNationalPension(10_000_000)).toBe(277_650);

      // 월 과세 0원
      expect(calculateNationalPension(0)).toBe(0);
    });

    it('건강보험은 과세 급여의 3.545%를 10원 미만 절사하여 산출해야 한다', () => {
      // 3,000,000 * 0.03545 = 106,350원
      expect(calculateHealthInsurance(3_000_000)).toBe(106_350);
    });

    it('노인장기요양보험은 건강보험료의 12.95%를 10원 미만 절사하여 산출해야 한다', () => {
      // 건강보험료 106,350원 * 0.1295 = 13,772.325원 -> 13,770원
      expect(calculateLongTermCare(106_350)).toBe(13_770);
    });

    it('고용보험은 과세 급여의 0.9%를 10원 미만 절사하여 산출해야 한다', () => {
      // 3,000,000 * 0.009 = 27,000원
      expect(calculateEmploymentInsurance(3_000_000)).toBe(27_000);
    });
  });

  describe('국세청 간이세액표 및 소득세/지방소득세 산출 검증', () => {
    it('최저생계비 이하(월 과세 106만원 미만)는 소득세와 지방소득세가 0원이어야 한다', () => {
      const tax = calculateMonthlyIncomeTax(1_000_000, 1, 0);
      expect(tax.incomeTax).toBe(0);
      expect(tax.localIncomeTax).toBe(0);
    });

    it('부양가족 수가 증가하면 인적공제로 인해 소득세가 감소해야 한다', () => {
      const taxSingle = calculateMonthlyIncomeTax(4_000_000, 1, 0);
      const taxFamily = calculateMonthlyIncomeTax(4_000_000, 3, 0);

      expect(taxSingle.incomeTax).toBeGreaterThan(taxFamily.incomeTax);
      expect(taxFamily.incomeTax).toBeGreaterThanOrEqual(0);
    });

    it('20세 이하 자녀 세액공제가 정상 반영되어 소득세가 추가 감면되어야 한다', () => {
      const taxNoChild = calculateMonthlyIncomeTax(5_000_000, 3, 0);
      const taxWithChildren = calculateMonthlyIncomeTax(5_000_000, 3, 2);

      expect(taxNoChild.incomeTax).toBeGreaterThan(taxWithChildren.incomeTax);
    });

    it('지방소득세는 근로소득세의 10%를 10원 미만 절사하여 산출해야 한다', () => {
      // 월 과세 4,000,000원 기준 근로소득세 203,620원 -> 지방소득세 20,360원 (독립 검증 수치)
      const tax = calculateMonthlyIncomeTax(4_000_000, 1, 0);
      expect(tax.incomeTax).toBe(203_620);
      expect(tax.localIncomeTax).toBe(20_360);
    });
  });

  describe('calculateSalary 종합 시뮬레이션 검증', () => {
    it('연봉 5,000만 원 (1인 가구, 비과세 식대 20만 원) 기준 실수령액 및 공제액이 합리적이어야 한다', () => {
      const input: SalaryInput = {
        paymentType: 'annual',
        grossAmount: 50_000_000,
        severanceType: 'separate',
        nonTaxableAmount: 200_000,
        familyCount: 1,
        childrenCount: 0,
      };

      const result = calculateSalary(input);

      // 1. 월 세전 급여 및 과세 대상 검증
      // 50,000,000 / 12 = 4,166,667원 (원단위 반올림)
      expect(result.grossMonthlySalary).toBe(4_166_667);
      expect(result.nonTaxableMonthly).toBe(200_000);
      // 4,166,667 - 200,000 = 3,966,667원
      expect(result.taxableMonthlySalary).toBe(3_966_667);

      // 2. 4대 사회보험료 독립 기댓값 검증 (국민연금, 건강, 장기요양, 고용)
      expect(result.nationalPension).toBe(178_500);
      expect(result.healthInsurance).toBe(140_610);
      expect(result.longTermCare).toBe(18_200);
      expect(result.employmentInsurance).toBe(35_700);

      // 3. 근로소득세 및 지방소득세 독립 기댓값 검증
      expect(result.incomeTax).toBe(199_100);
      expect(result.localIncomeTax).toBe(19_910);

      // 4. 총 공제액 및 실수령액 최종 검증
      expect(result.totalMonthlyDeduction).toBe(592_020);
      expect(result.netMonthlySalary).toBe(3_574_647);
      expect(result.netAnnualSalary).toBe(42_895_764);

      // 실수령 비율은 약 85.8%
      expect(result.takeHomeRatio).toBe(85.8);

      // 공제 항목 배열이 6개 항목을 정확히 포함해야 함
      expect(result.deductionItems.length).toBe(6);
      expect(result.deductionItems.map((item) => item.id)).toEqual([
        'national_pension',
        'health_insurance',
        'long_term_care',
        'employment_insurance',
        'income_tax',
        'local_income_tax',
      ]);
    });

    it('연봉 1억 원 (고소득자) 기준 국민연금 상한액(277,650원)이 정확히 적용되어야 한다', () => {
      const input: SalaryInput = {
        paymentType: 'annual',
        grossAmount: 100_000_000,
        severanceType: 'separate',
        nonTaxableAmount: 200_000,
        familyCount: 1,
        childrenCount: 0,
      };

      const result = calculateSalary(input);

      // 월 세전 약 833만 원 -> 기준소득월액 617만 원 초과
      expect(result.nationalPension).toBe(
        SALARY_CONSTANTS.NATIONAL_PENSION_MAX_PAYMENT
      );
      // 고소득자이므로 소득세가 4대보험보다 높아야 함
      expect(result.incomeTax).toBeGreaterThan(result.nationalPension);
    });

    it('퇴직금 포함(1/13 분할) 옵션 선택 시 월 세전 급여가 13등분되어야 한다', () => {
      const inputSeparate: SalaryInput = {
        paymentType: 'annual',
        grossAmount: 52_000_000,
        severanceType: 'separate',
        nonTaxableAmount: 200_000,
        familyCount: 1,
        childrenCount: 0,
      };

      const inputIncluded: SalaryInput = {
        paymentType: 'annual',
        grossAmount: 52_000_000,
        severanceType: 'included',
        nonTaxableAmount: 200_000,
        familyCount: 1,
        childrenCount: 0,
      };

      const resultSeparate = calculateSalary(inputSeparate);
      const resultIncluded = calculateSalary(inputIncluded);

      expect(resultSeparate.grossMonthlySalary).toBe(Math.round(52_000_000 / 12));
      expect(resultIncluded.grossMonthlySalary).toBe(4_000_000); // 52,000,000 / 13 = 4,000,000
      expect(resultIncluded.netMonthlySalary).toBeLessThan(
        resultSeparate.netMonthlySalary
      );
    });

    it('월급 기준 입력(paymentType: monthly) 시에도 정상 연산되어야 한다', () => {
      const input: SalaryInput = {
        paymentType: 'monthly',
        grossAmount: 3_500_000,
        severanceType: 'separate',
        nonTaxableAmount: 200_000,
        familyCount: 2,
        childrenCount: 1,
      };

      const result = calculateSalary(input);
      expect(result.grossMonthlySalary).toBe(3_500_000);
      expect(result.grossAnnualSalary).toBe(42_000_000);
      expect(result.netMonthlySalary).toBeGreaterThan(0);
      expect(result.netMonthlySalary).toBeLessThan(3_500_000);
    });

    it('입력값이 0원이거나 잘못된 경우 안전하게 0원을 반환해야 한다', () => {
      const input: SalaryInput = {
        paymentType: 'annual',
        grossAmount: 0,
        severanceType: 'separate',
        nonTaxableAmount: 200_000,
        familyCount: 1,
        childrenCount: 0,
      };

      const result = calculateSalary(input);
      expect(result.grossMonthlySalary).toBe(0);
      expect(result.netMonthlySalary).toBe(0);
      expect(result.totalMonthlyDeduction).toBe(0);
      expect(result.takeHomeRatio).toBe(0);
    });
  });
});
