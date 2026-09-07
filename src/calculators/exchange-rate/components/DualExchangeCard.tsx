import React, { useState } from 'react';
import {
  CurrencyCode,
  ExchangeType,
  SpreadDiscount,
} from '../../../types/exchange';
import {
  CURRENCIES_DATA,
  formatCurrencyAmount,
} from '../../../utils/exchangeCalculator';
import { CurrencySelect } from './CurrencySelect';
import { ArrowLeftRight, Check, Copy, TrendingUp } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';

interface DualExchangeCardProps {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
  amount: number | '';
  convertedAmount: number;
  appliedRate: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
  discountSavedKRW: number;
  onFromChange: (code: CurrencyCode) => void;
  onToChange: (code: CurrencyCode) => void;
  onAmountChange: (amount: number | '') => void;
  onSwap: () => void;
  onTypeChange: (type: ExchangeType) => void;
  onDiscountChange: (discount: SpreadDiscount) => void;
}

export const DualExchangeCard: React.FC<DualExchangeCardProps> = ({
  fromCode,
  toCode,
  amount,
  convertedAmount,
  appliedRate,
  exchangeType,
  discount,
  discountSavedKRW,
  onFromChange,
  onToChange,
  onAmountChange,
  onSwap,
  onTypeChange,
  onDiscountChange,
}) => {
  const [copied, setCopied] = useState(false);

  const fromCurr = CURRENCIES_DATA[fromCode];
  const toCurr = CURRENCIES_DATA[toCode];

  const handleCopyResult = async () => {
    const text = `${formatCurrencyAmount(convertedAmount, toCode)} ${toCurr.symbol}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
    }
  };

  const discountOptions: SpreadDiscount[] = [90, 80, 50, 0];

  return (
    <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-4 sm:p-6 space-y-4 shadow-2xs">
      {/* 1. 상단 환전 방식 탭 (매매기준율 / 현찰 살 때 / 현찰 팔 때) */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e5e7eb] flex-wrap">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onTypeChange('base')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              exchangeType === 'base'
                ? 'bg-[#15171a] text-white shadow-2xs'
                : 'text-[#64748b] hover:text-[#112220]'
            }`}
          >
            매매기준율
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('cash_buy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              exchangeType === 'cash_buy'
                ? 'bg-[#15171a] text-white shadow-2xs'
                : 'text-[#64748b] hover:text-[#112220]'
            }`}
          >
            현찰 살 때
          </button>
          <button
            type="button"
            onClick={() => onTypeChange('cash_sell')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              exchangeType === 'cash_sell'
                ? 'bg-[#15171a] text-white shadow-2xs'
                : 'text-[#64748b] hover:text-[#112220]'
            }`}
          >
            현찰 팔 때
          </button>
        </div>

        {/* 환율 기준 안내 */}
        <div className="flex items-center gap-1.5 text-xs text-[#64748b] font-medium pt-[0.5px]">
          <TrendingUp className="w-3.5 h-3.5 text-[#15171a]" />
          <span>1 {fromCode} = {formatCurrencyAmount(appliedRate, toCode)} {toCode}</span>
        </div>
      </div>

      {/* 2. 은행 환전 우대율 (스프레드 할인율) - 현찰 살 때/팔 때 활성화 */}
      {exchangeType !== 'base' && (
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-[#e5e7eb] flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#112220]">은행 우대율</span>
            {discountSavedKRW > 0 && (
              <Badge variant="eyebrow" className="text-[10px] px-1.5 py-0 h-5">
                약 {formatCurrencyAmount(discountSavedKRW, 'KRW')}원 절약
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1">
            {discountOptions.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => onDiscountChange(disc)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                  discount === disc
                    ? 'bg-[#15171a] text-white'
                    : 'bg-white border border-[#e5e7eb] text-[#64748b] hover:text-[#112220]'
                }`}
              >
                {disc}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 메인 인터랙티브 듀얼 변환 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* FROM 카드 */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-[#e5e7eb] space-y-2">
          <CurrencySelect
            id="from-currency"
            label="보내는 통화 (기준)"
            value={fromCode}
            onChange={onFromChange}
          />
          <div className="space-y-1">
            <label htmlFor="from-amount" className="block text-xs font-semibold text-[#64748b]">
              환전 금액 ({fromCurr.symbol})
            </label>
            <div className="relative">
              <input
                id="from-amount"
                type="number"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  onAmountChange(val === '' ? '' : parseFloat(val));
                }}
                placeholder="금액을 입력하세요"
                className="w-full h-12 bg-white border border-[#e5e7eb] rounded-xl px-3.5 pr-10 text-lg font-bold text-[#112220] focus:outline-none focus:ring-2 focus:ring-[#15171a] tabular-nums"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#94a3b8]">
                {fromCurr.symbol}
              </span>
            </div>
          </div>
        </div>

        {/* SWAP 버튼 */}
        <div className="flex justify-center -my-1 md:my-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onSwap}
            aria-label="통화 맞바꾸기"
            className="w-10 h-10 rounded-full border border-[#e5e7eb] bg-white hover:bg-slate-100 active:scale-95 shadow-2xs text-[#112220] shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>

        {/* TO 카드 */}
        <div className="p-4 rounded-2xl bg-[#f8fafc] border border-[#e5e7eb] space-y-2">
          <CurrencySelect
            id="to-currency"
            label="받는 통화 (결과)"
            value={toCode}
            onChange={onToChange}
          />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748b]">환산 결과 ({toCurr.symbol})</span>
              <button
                type="button"
                onClick={handleCopyResult}
                className="flex items-center gap-1 text-[11px] font-bold text-[#112220] hover:underline cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">복사완료</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#64748b]" />
                    <span>결과 복사</span>
                  </>
                )}
              </button>
            </div>
            <div className="h-12 bg-white border border-[#e5e7eb] rounded-xl px-3.5 flex items-center justify-between">
              <span className="text-lg font-bold text-[#112220] tabular-nums truncate">
                {formatCurrencyAmount(convertedAmount, toCode)}
              </span>
              <span className="text-sm font-bold text-[#64748b] shrink-0 ml-2">
                {toCode} ({toCurr.symbol})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
