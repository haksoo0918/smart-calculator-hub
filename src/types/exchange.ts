export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'EUR' | 'CNY' | 'GBP';

export interface CurrencyItem {
  code: CurrencyCode;
  name: string; // '대한민국 원', '미국 달러' 등
  symbol: string; // '₩', '$', '¥', '€', '£'
  baseRateToKRW: number; // 1단위(JPY는 100엔)당 KRW 기준 매매기준율
  baseUnit: number; // 기본 1 (JPY는 100)
  spreadRate: number; // 은행 표준 현찰 스프레드율 (예: 0.0175 = 1.75%)
}

export type ExchangeType = 'base' | 'cash_buy' | 'cash_sell' | 'send' | 'receive';

export type SpreadDiscount = 0 | 50 | 80 | 90 | 100;

export interface ExchangePreset {
  label: string;
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  amount: number;
  badge?: string;
  description: string;
}

export interface ExchangeCalculationResult {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  inputAmount: number;
  convertedAmount: number;
  appliedRate: number; // 1 fromCurrency 당 toCurrency 비율 (단위 고려)
  baseRate: number; // 기준 매매기준율 비율
  spreadFeeKRW: number; // 기본 수수료(원화 환산 기준)
  discountSavedKRW: number; // 우대로 인해 절약된 수수료(원화 환산 기준)
}

export interface ExchangeRateSnapshot {
  baseDate: string; // 예: '2026.09.07' 또는 '2026-09-07'
  lastUpdatedTime?: string; // 예: '11:25'
  source: string; // 예: '글로벌 공시 매매기준율 (Open Exchange Rates)'
  ratesToKRW: Record<CurrencyCode, number>;
  isLive: boolean; // 온라인 동기화 성공 여부
}

