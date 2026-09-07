import React, { useState } from 'react';
import {
  CurrencyCode,
  ExchangeRateSnapshot,
  ExchangeType,
  SpreadDiscount,
} from '../../../types/exchange';
import {
  CURRENCIES_DATA,
  formatCurrencyAmount,
} from '../../../utils/exchangeCalculator';
import { CurrencySelect } from './CurrencySelect';
import { ArrowLeftRight, Check, Copy, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface DualExchangeCardProps {
  fromCode: CurrencyCode;
  toCode: CurrencyCode;
  amount: number | '';
  convertedAmount: number;
  appliedRate: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
  discountSavedKRW: number;
  snapshot: ExchangeRateSnapshot;
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
  snapshot,
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
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-4 shadow-2xs transition-colors">
      {/* 1. 상단 환전 방식 탭 및 기준일자 배지 */}
      <div className="space-y-2.5 pb-3 border-b border-[#e5e7eb] dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {/* 환전 방식 탭 (모바일: 3등분 꽉 채움) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onTypeChange('base')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                exchangeType === 'base'
                  ? 'bg-[#15171a] dark:bg-slate-800 text-white shadow-2xs border dark:border-slate-700'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white'
              }`}
            >
              매매기준율
            </button>
            <button
              type="button"
              onClick={() => onTypeChange('cash_buy')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                exchangeType === 'cash_buy'
                  ? 'bg-[#15171a] dark:bg-slate-800 text-white shadow-2xs border dark:border-slate-700'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white'
              }`}
            >
              현찰 살 때
            </button>
            <button
              type="button"
              onClick={() => onTypeChange('cash_sell')}
              className={`px-2 py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                exchangeType === 'cash_sell'
                  ? 'bg-[#15171a] dark:bg-slate-800 text-white shadow-2xs border dark:border-slate-700'
                  : 'text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white'
              }`}
            >
              현찰 팔 때
            </button>
          </div>

          {/* 기준일 및 환율 안내 (모바일: 1행 가로 양끝 정렬) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs text-[#64748b] dark:text-slate-300 font-medium pt-[0.5px]">
            <div className="flex items-center gap-1 text-[11px] bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-md border border-[#e5e7eb] dark:border-slate-700 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-[#64748b] dark:text-slate-400" />
              <span className="whitespace-nowrap">고시: {snapshot.baseDate}</span>
              {snapshot.isLive && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5 shrink-0" title="최신 실시간 환율 연동" />
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs truncate">
              <TrendingUp className="w-3.5 h-3.5 text-[#15171a] dark:text-[#d1ff19] shrink-0" />
              <span className="truncate">1 {fromCode} = {formatCurrencyAmount(appliedRate, toCode)} {toCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 은행 환전 우대율 (스프레드 할인율) - 현찰 살 때/팔 때 활성화 */}
      {exchangeType !== 'base' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-[#e5e7eb] dark:border-slate-800">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <span className="text-xs font-bold text-[#112220] dark:text-slate-200 whitespace-nowrap">은행 우대율</span>
            {discountSavedKRW > 0 && (
              <Badge variant="eyebrow" className="text-[10px] px-1.5 py-0 h-5 whitespace-nowrap">
                약 {formatCurrencyAmount(discountSavedKRW, 'KRW')}원 절약
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 sm:flex items-center gap-1 w-full sm:w-auto">
            {discountOptions.map((disc) => (
              <button
                key={disc}
                type="button"
                onClick={() => onDiscountChange(disc)}
                className={`py-1 sm:px-2.5 text-xs font-bold rounded-md transition-all text-center ${
                  discount === disc
                    ? 'bg-[#15171a] dark:bg-slate-800 text-white border dark:border-slate-700'
                    : 'bg-white dark:bg-slate-900 border border-[#e5e7eb] dark:border-slate-700 text-[#64748b] dark:text-slate-400 hover:text-[#112220] dark:hover:text-white'
                }`}
              >
                {disc}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 메인 인터랙티브 듀얼 변환 영역 (모바일: 1열 세로, 데스크톱: 3열 좌/중/우) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* 1. 출발(From) 단위 입력 박스 */}
        <div className="bg-slate-50/70 dark:bg-slate-900/60 border border-[#e5e7eb] dark:border-slate-700 rounded-2xl p-3.5 sm:p-4 focus-within:border-[#15171a] dark:focus-within:border-[#d1ff19] focus-within:bg-white dark:focus-within:bg-slate-900 transition-all">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label htmlFor="from-amount" className="text-[11px] sm:text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider whitespace-nowrap cursor-pointer">
              입력 (From)
            </label>
            <div className="w-28 sm:w-36 lg:w-44 shrink-0">
              <CurrencySelect
                id="from-currency"
                value={fromCode}
                onChange={onFromChange}
                variant="light"
              />
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <Input
              id="from-amount"
              aria-label={`${fromCurr.name} 환전 금액 입력`}
              type="number"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => {
                const val = e.target.value;
                onAmountChange(val === '' ? '' : parseFloat(val));
              }}
              placeholder="0"
              className="h-auto w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 font-extrabold text-2xl sm:text-3xl text-[#112220] dark:text-slate-100 tracking-tight placeholder-slate-300 dark:placeholder-slate-600 tabular-nums"
            />
            <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400 shrink-0">
              {fromCurr.symbol}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 truncate">
            {fromCurr.name} ({fromCode})
          </p>
        </div>

        {/* 2. 중앙 스왑(Swap) 버튼 */}
        <div className="flex justify-center my-1 md:my-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSwap}
                className="w-10 h-10 rounded-full border border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs hover:border-[#15171a] dark:hover:border-[#d1ff19] transition-all text-[#112220] dark:text-white shrink-0"
                aria-label="통화 맞바꾸기"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">통화 맞바꾸기 (Swap)</TooltipContent>
          </Tooltip>
        </div>

        {/* 3. 도착(To) 단위 결과 박스 */}
        <div className="bg-[#15171a] dark:bg-slate-950 text-white rounded-2xl p-3.5 sm:p-4 border border-[#15171a] dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] sm:text-xs font-bold text-[#d1ff19] uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d1ff19] shrink-0" />
              결과 (To)
            </span>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyResult}
                    className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800 rounded-md shrink-0"
                    aria-label="결과값 복사"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {copied ? '복사 완료!' : '결과값 복사'}
                </TooltipContent>
              </Tooltip>
              <div className="w-28 sm:w-36 lg:w-44 shrink-0">
                <CurrencySelect
                  id="to-currency"
                  value={toCode}
                  onChange={onToChange}
                  variant="dark"
                />
              </div>
            </div>
          </div>

          <div className="flex items-baseline justify-between gap-2 overflow-x-auto">
            <span className="font-extrabold text-2xl sm:text-3xl text-white tracking-tight tabular-nums break-all">
              {formatCurrencyAmount(convertedAmount, toCode)}
            </span>
            <span className="text-sm sm:text-base font-bold text-[#d1ff19] shrink-0">
              {toCurr.symbol}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 mt-2 truncate">
            {toCurr.name} ({toCode})
          </p>
        </div>
      </div>
    </div>
  );
};
