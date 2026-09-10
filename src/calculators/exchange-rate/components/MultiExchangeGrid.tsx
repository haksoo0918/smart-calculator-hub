import React, { useState } from 'react';
import { CurrencyCode, ExchangeType, SpreadDiscount } from '../../../types/exchange';
import {
  CURRENCIES_DATA,
  calculateExchange,
  formatCurrencyAmount,
} from '../../../utils/exchangeCalculator';
import { Check, Copy, Globe } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../../components/ui/tooltip';

interface MultiExchangeGridProps {
  fromCode: CurrencyCode;
  amount: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
  customRates?: Record<CurrencyCode, number>;
}

export const MultiExchangeGrid: React.FC<MultiExchangeGridProps> = ({
  fromCode,
  amount,
  exchangeType,
  discount,
  customRates,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const allCodes = Object.keys(CURRENCIES_DATA) as CurrencyCode[];

  const handleCopy = async (code: CurrencyCode, valText: string) => {
    try {
      await navigator.clipboard.writeText(valText);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-4 sm:p-6 space-y-3.5 shadow-2xs transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <Globe className="w-4 h-4 text-[#112220] dark:text-[#d1ff19] shrink-0" />
              <h2 className="text-sm sm:text-base font-bold text-[#112220] dark:text-slate-100 tracking-tight">
                전체 주요 통화 실시간 일괄 환산
              </h2>
            </div>
            <span className="sm:hidden text-[11px] font-medium text-[#64748b] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
              기준: {formatCurrencyAmount(amount, fromCode)} {fromCode}
            </span>
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-relaxed">
            현재 입력값을 기준으로 전 세계 주요 통화로 즉시 동시 환산됩니다.
          </p>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-medium text-[#64748b] dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full shrink-0">
          기준: {formatCurrencyAmount(amount, fromCode)} {fromCode}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {allCodes.map((code) => {
          const curr = CURRENCIES_DATA[code];
          const isBase = code === fromCode;
          const isCopied = copiedCode === code;
          const result = calculateExchange(amount, fromCode, code, exchangeType, discount, customRates);
          const formatted = formatCurrencyAmount(result.convertedAmount, code);
          const copyText = `${formatted} ${curr.symbol}`;

          return (
            <div
              key={code}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isBase
                  ? 'bg-slate-50 dark:bg-slate-900 border-[#15171a] dark:border-[#d1ff19] ring-1 ring-[#15171a]/10 dark:ring-[#d1ff19]/20'
                  : 'bg-white dark:bg-slate-900/50 border-[#e5e7eb] dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-6 font-mono font-bold text-xs text-[#112220] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-[#e5e7eb] dark:border-slate-700 rounded px-1 text-center shrink-0">
                    {curr.symbol}
                  </span>
                  <span className="font-bold text-xs text-[#112220] dark:text-slate-100 truncate">
                    {curr.name}
                  </span>
                  {isBase && (
                    <span className="text-[10px] font-bold text-[#112220] bg-[#d1ff19] px-1 rounded-sm shrink-0">
                      기준
                    </span>
                  )}
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(code, copyText)}
                      className="h-7 w-7 text-slate-500 hover:text-[#112220] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md shrink-0"
                      aria-label={`${curr.name} 금액 복사`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isCopied ? '복사 완료!' : '결과값 복사'}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="mt-1 flex items-baseline justify-between gap-1 overflow-x-auto">
                <span className={`font-extrabold text-base sm:text-lg tracking-tight truncate ${isBase ? 'text-[#112220] dark:text-[#d1ff19]' : 'text-[#112220] dark:text-slate-100'}`}>
                  {formatted}
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                  {code}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
