import { describe, it, expect } from 'vitest';
import {
  calculateEarlyRepaymentFee,
  calculateLoanRepayment,
  compareLoanMethods,
  formatKoreanLoanAmount,
} from './loanCalculator';
import { LoanInput } from '../types/loan';

describe('loanCalculator Tests', () => {
  describe('calculateEarlyRepaymentFee (중도상환 수수료)', () => {
    it('대출 실행 12개월 차(36개월 미만)에는 경과월수 비례 감면되어 계산되어야 한다', () => {
      // 1억 원, 수수료율 1.2%, 12개월 경과 -> 1억 * 1.2% * (24/36) = 1,200,000 * 2/3 = 800,000원
      const fee = calculateEarlyRepaymentFee(100_000_000, 1.2, 12);
      expect(fee).toBe(800_000);
    });

    it('대출 실행 36개월 이상 경과 시 중도상환 수수료가 0원(전액 면제)이어야 한다', () => {
      expect(calculateEarlyRepaymentFee(100_000_000, 1.2, 36)).toBe(0);
      expect(calculateEarlyRepaymentFee(100_000_000, 1.2, 40)).toBe(0);
    });

    it('상환금액이나 수수료율이 0 이하인 경우 0원을 반환해야 한다', () => {
      expect(calculateEarlyRepaymentFee(0, 1.2, 12)).toBe(0);
      expect(calculateEarlyRepaymentFee(100_000_000, 0, 12)).toBe(0);
    });
  });

  describe('calculateLoanRepayment (3대 상환방식 정밀도)', () => {
    const baseInput: LoanInput = {
      loanAmount: 120_000_000, // 1억 2천만 원
      annualRate: 4.0,          // 연 4.0%
      loanTermYears: 10,        // 10년 (120개월)
      gracePeriodMonths: 0,
      repaymentMethod: 'equal_payment',
    };

    it('원리금균등상환(equal_payment)은 마지막 회차 잔액이 정확히 0원이어야 한다', () => {
      const result = calculateLoanRepayment({
        ...baseInput,
        repaymentMethod: 'equal_payment',
      });

      expect(result.schedule.length).toBe(120);
      const last = result.schedule[result.schedule.length - 1];
      expect(last.remainingBalance).toBe(0);
      expect(result.totalRepayment).toBe(result.totalInterest + baseInput.loanAmount);
      // 120회차 동안 매월 상환액이 균등하게 유지되는지 (마지막 회차 원단위 절사/단수 보정 오차 100원 미만)
      expect(Math.abs(result.firstMonthPayment - result.lastMonthPayment)).toBeLessThan(100);
      expect(result.firstMonthPayment).toBe(result.schedule[1].totalPayment);
    });

    it('원금균등상환(equal_principal)은 총이자가 원리금균등보다 적고 매월 상환액이 감소해야 한다', () => {
      const equalPaymentResult = calculateLoanRepayment({
        ...baseInput,
        repaymentMethod: 'equal_payment',
      });

      const equalPrincipalResult = calculateLoanRepayment({
        ...baseInput,
        repaymentMethod: 'equal_principal',
      });

      expect(equalPrincipalResult.schedule.length).toBe(120);
      expect(equalPrincipalResult.schedule[119].remainingBalance).toBe(0);
      // 원금균등은 원리금균등보다 총이자가 적어야 함
      expect(equalPrincipalResult.totalInterest).toBeLessThan(equalPaymentResult.totalInterest);
      // 첫 달 상환액이 마지막 달 상환액보다 커야 함
      expect(equalPrincipalResult.firstMonthPayment).toBeGreaterThan(equalPrincipalResult.lastMonthPayment);
    });

    it('만기일시상환(bullet)은 마지막 회차 전까지 이자만 내고 120회차에 원금 전액을 상환해야 한다', () => {
      const bulletResult = calculateLoanRepayment({
        ...baseInput,
        repaymentMethod: 'bullet',
      });

      expect(bulletResult.schedule.length).toBe(120);
      // 1회차부터 119회차까지 납입원금은 0원이어야 함
      for (let i = 0; i < 119; i++) {
        expect(bulletResult.schedule[i].principalPayment).toBe(0);
        expect(bulletResult.schedule[i].remainingBalance).toBe(baseInput.loanAmount);
      }
      // 마지막 회차에는 원금 전액 1억2천 납입 및 잔액 0원
      expect(bulletResult.schedule[119].principalPayment).toBe(baseInput.loanAmount);
      expect(bulletResult.schedule[119].remainingBalance).toBe(0);
      // 만기일시의 총이자가 3가지 중 가장 커야 함
      expect(bulletResult.totalInterest).toBe(Math.round(baseInput.loanAmount * 0.04 * 10));
    });

    it('거치 기간(gracePeriodMonths) 동안은 이자만 납입되어야 한다', () => {
      const graceInput: LoanInput = {
        ...baseInput,
        gracePeriodMonths: 12, // 1년 거치
      };

      const result = calculateLoanRepayment(graceInput);
      expect(result.schedule[0].isGracePeriod).toBe(true);
      expect(result.schedule[0].principalPayment).toBe(0);
      expect(result.schedule[11].isGracePeriod).toBe(true);
      expect(result.schedule[11].principalPayment).toBe(0);
      expect(result.schedule[12].isGracePeriod).toBe(false);
      expect(result.schedule[12].principalPayment).toBeGreaterThan(0);
    });

    it('중도상환 시 해당 회차에 추가 원금이 상환되고 총이자가 절감되어야 한다', () => {
      const earlyInput: LoanInput = {
        ...baseInput,
        earlyRepayment: {
          enabled: true,
          afterMonths: 24, // 2년차(24개월)에
          amount: 30_000_000, // 3,000만 원 중도상환
          feeRate: 1.2,
        },
      };

      const regularResult = calculateLoanRepayment(baseInput);
      const earlyResult = calculateLoanRepayment(earlyInput);

      expect(earlyResult.earlyRepayment).toBeDefined();
      expect(earlyResult.earlyRepayment!.feeAmount).toBeGreaterThan(0);
      expect(earlyResult.earlyRepayment!.savedInterest).toBeGreaterThan(0);
      // 중도상환한 결과의 총이자가 일반 결과보다 적어야 함
      expect(earlyResult.totalInterest).toBeLessThan(regularResult.totalInterest);
      // 24회차에 조기상환 플래그 설정 확인
      expect(earlyResult.schedule[23].isEarlyRepaymentMonth).toBe(true);
      expect(earlyResult.schedule[23].earlyRepaymentAmount).toBe(30_000_000);
    });
  });

  describe('compareLoanMethods (3대 상환방식 일괄 비교)', () => {
    it('3가지 상환방식을 동시에 비교하고 절약 금액을 올바르게 계산해야 한다', () => {
      const comparison = compareLoanMethods({
        loanAmount: 300_000_000, // 3억
        annualRate: 4.5,
        loanTermYears: 30,
        gracePeriodMonths: 0,
        repaymentMethod: 'equal_payment',
      });

      expect(comparison.lowestInterestMethod).toBe('equal_principal');
      expect(comparison.interestSavingsVsEqualPayment).toBeGreaterThan(0);
      expect(comparison.bullet.totalInterest).toBeGreaterThan(comparison.equalPayment.totalInterest);
    });
  });

  describe('formatKoreanLoanAmount (한글 금액 단위 표기)', () => {
    it('억, 만 단위로 가독성 높게 환산되어야 한다', () => {
      expect(formatKoreanLoanAmount(350_000_000)).toBe('3억 5,000만 원');
      expect(formatKoreanLoanAmount(100_000_000)).toBe('1억 원');
      expect(formatKoreanLoanAmount(50_000_000)).toBe('5,000만 원');
      expect(formatKoreanLoanAmount(0)).toBe('0원');
    });
  });
});
