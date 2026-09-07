import { describe, it, expect } from 'vitest';
import {
  calculateExchange,
  formatCurrencyAmount,
} from './exchangeCalculator';

describe('exchangeCalculator Tests', () => {
  it('매매기준율(base)로 100달러(USD)를 원화(KRW)로 변환 시 135,000원이 나와야 한다', () => {
    const res = calculateExchange(100, 'USD', 'KRW', 'base', 0);
    expect(res.convertedAmount).toBe(135000);
    expect(res.appliedRate).toBe(1350);
    expect(res.spreadFeeKRW).toBe(0);
    expect(res.discountSavedKRW).toBe(0);
  });

  it('1,000엔(JPY, 100엔당 900원)을 원화로 환산 시 9,000원이 나와야 한다', () => {
    const res = calculateExchange(1000, 'JPY', 'KRW', 'base', 0);
    expect(res.convertedAmount).toBe(9000);
    expect(res.appliedRate).toBe(9);
  });

  it('현찰 살 때(cash_buy) 우대율 0% vs 90% 시 수수료 절약 금액이 올바르게 계산되어야 한다', () => {
    // 1000달러 = 기준 1,350,000원. 스프레드 1.75% = 23,625원.
    const resZero = calculateExchange(1000, 'USD', 'KRW', 'cash_buy', 0);
    expect(resZero.convertedAmount).toBeGreaterThan(1350000);
    expect(resZero.discountSavedKRW).toBe(0);

    const resNinety = calculateExchange(1000, 'USD', 'KRW', 'cash_buy', 90);
    // 90% 우대 시 수수료의 90%가 절약되어야 함
    expect(resNinety.discountSavedKRW).toBeCloseTo(resZero.spreadFeeKRW * 0.9, 1);
  });

  it('formatCurrencyAmount 유틸이 통화별 소수점 규칙을 지켜야 한다', () => {
    expect(formatCurrencyAmount(12345.67, 'USD')).toBe('12,345.67');
    expect(formatCurrencyAmount(12345.67, 'KRW')).toBe('12,346');
    expect(formatCurrencyAmount(10000, 'JPY')).toBe('10,000');
  });
});
