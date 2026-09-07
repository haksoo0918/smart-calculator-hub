import React, { useState } from 'react';
import { CurrencyCode, ExchangeType, SpreadDiscount } from '../../../types/exchange';
import {
  CURRENCIES_DATA,
  calculateExchange,
  formatCurrencyAmount,
} from '../../../utils/exchangeCalculator';
import { Check, Copy, Globe } from 'lucide-react';

interface MultiExchangeGridProps {
  fromCode: CurrencyCode;
  amount: number;
  exchangeType: ExchangeType;
  discount: SpreadDiscount;
}

export const MultiExchangeGrid: React.FC<MultiExchangeGridProps> = ({
  fromCode,
  amount,
  exchangeType,
  discount,
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
    <div className="bg-white rounded-[24px] border border-[#e5e7eb] p-4 sm:p-6 space-y-3.5 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#112220]" />
          <h3 className="text-sm font-bold text-[#112220]">
            전체 주요 통화 실시간 일괄 환산
          </h3>
        </div>
        <span className="text-[11px] text-[#64748b]">
          기준: {formatCurrencyAmount(amount, fromCode)} {fromCode}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {allCodes.map((code) => {
          const curr = CURRENCIES_DATA[code];
          const isBase = code === fromCode;
          const result = calculateExchange(amount, fromCode, code, exchangeType, discount);
          const formatted = formatCurrencyAmount(result.convertedAmount, code);
          const copyText = `${formatted} ${curr.symbol}`;

          return (
            <div
              key={code}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                isBase
                  ? 'bg-slate-100 border-[#15171a] shadow-2xs ring-1 ring-[#15171a]'
                  : 'bg-slate-50/70 border-[#e5e7eb] hover:border-[#cbd5e1] hover:bg-slate-50'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="w-6 font-mono font-bold text-xs text-[#112220] bg-white border border-[#e5e7eb] rounded px-1 text-center">
                    {curr.symbol}
                  </span>
                  <span className="font-bold text-xs text-[#112220] truncate">
                    {curr.name}
                  </span>
                  {isBase && (
                    <span className="text-[10px] font-bold text-[#112220] bg-[#d1ff19] px-1 rounded-sm">
                      기준
                    </span>
                  )}
                </div>
                <div className="text-base font-bold text-[#112220] tabular-nums truncate">
                  {formatted}
                  <span className="text-xs font-normal text-[#64748b] ml-1">
                    {code}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(code, copyText)}
                className="p-1.5 text-[#64748b] hover:text-[#112220] hover:bg-white rounded-md transition-colors cursor-pointer shrink-0"
                aria-label={`${curr.name} 금액 복사`}
              >
                {copiedCode === code ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
