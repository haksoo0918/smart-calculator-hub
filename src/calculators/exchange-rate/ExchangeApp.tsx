import React, { useState, useEffect } from 'react';
import {
  CurrencyCode,
  ExchangePreset,
  ExchangeType,
  SpreadDiscount,
} from '../../types/exchange';
import {
  calculateExchange,
  CURRENCIES_DATA,
} from '../../utils/exchangeCalculator';
import { DualExchangeCard } from './components/DualExchangeCard';
import { ExchangePresetChips } from './components/ExchangePresetChips';
import { MultiExchangeGrid } from './components/MultiExchangeGrid';
import { ExchangeInfoCard } from './components/ExchangeInfoCard';
import { siteConfig } from '../../config/site';

const STORAGE_KEY = 'smart_calculator_exchange_v1';

interface StoredExchangeState {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
  amount: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
}

export const ExchangeApp: React.FC = () => {
  const [fromCode, setFromCode] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (parsed.fromCode && CURRENCIES_DATA[parsed.fromCode]) return parsed.fromCode;
      }
    } catch {
      // fallback
    }
    return 'USD';
  });

  const [toCode, setToCode] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (parsed.toCode && CURRENCIES_DATA[parsed.toCode]) return parsed.toCode;
      }
    } catch {
      // fallback
    }
    return 'KRW';
  });

  const [amount, setAmount] = useState<number | ''>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (typeof parsed.amount === 'number') return parsed.amount;
      }
    } catch {
      // fallback
    }
    return 100;
  });

  const [exchangeType, setExchangeType] = useState<ExchangeType>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if (['base', 'cash_buy', 'cash_sell', 'send', 'receive'].includes(parsed.exchangeType)) {
          return parsed.exchangeType;
        }
      }
    } catch {
      // fallback
    }
    return 'cash_buy';
  });

  const [discount, setDiscount] = useState<SpreadDiscount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredExchangeState = JSON.parse(saved);
        if ([0, 50, 80, 90, 100].includes(parsed.discount)) return parsed.discount;
      }
    } catch {
      // fallback
    }
    return 90;
  });

  // 로컬 스토리지 상태 저장
  useEffect(() => {
    try {
      const stateToSave: StoredExchangeState = {
        fromCode,
        toCode,
        amount: typeof amount === 'number' ? amount : 0,
        exchangeType,
        discount,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [fromCode, toCode, amount, exchangeType, discount]);

  // 페이지 타이틀 설정 (국문 네이밍 규칙: 한글 스마트 배제)
  useEffect(() => {
    document.title = siteConfig.getTitle('환율 계산기');
  }, []);

  const handleSwap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
  };

  const handleSelectPreset = (preset: ExchangePreset) => {
    setFromCode(preset.fromCurrency);
    setToCode(preset.toCurrency);
    setAmount(preset.amount);
  };

  const numericAmount = typeof amount === 'number' ? amount : 0;
  const calculationResult = calculateExchange(
    numericAmount,
    fromCode,
    toCode,
    exchangeType,
    discount
  );

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* 1. 메인 듀얼 환율 변환 카드 */}
      <DualExchangeCard
        fromCode={fromCode}
        toCode={toCode}
        amount={amount}
        convertedAmount={calculationResult.convertedAmount}
        appliedRate={calculationResult.appliedRate}
        exchangeType={exchangeType}
        discount={discount}
        discountSavedKRW={calculationResult.discountSavedKRW}
        onFromChange={setFromCode}
        onToChange={setToCode}
        onAmountChange={setAmount}
        onSwap={handleSwap}
        onTypeChange={setExchangeType}
        onDiscountChange={setDiscount}
      />

      {/* 2. 여행 & 해외직구 퀵 프리셋 칩 */}
      <ExchangePresetChips onSelectPreset={handleSelectPreset} />

      {/* 3. 전체 6대 통화 일괄 실시간 비교 그리드 */}
      <MultiExchangeGrid
        fromCode={fromCode}
        amount={numericAmount}
        exchangeType={exchangeType}
        discount={discount}
      />

      {/* 4. 환전 상식 및 면세 가이드 안내 카드 */}
      <ExchangeInfoCard />
    </div>
  );
};
