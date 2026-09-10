import React from 'react';
import { CalculationResult } from '../types/calculator';
import {
  formatCurrency,
  formatKoreanUnit,
  formatMultiple,
  formatPercent,
} from '../utils/formatters';
import { Wallet, PiggyBank, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

interface SummaryCardsProps {
  result: CalculationResult;
  title?: string;
  theme?: 'teal' | 'indigo';
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  result,
  title,
  theme = 'teal',
}) => {
  const isIndigo = theme === 'indigo';
  const principalRatio =
    result.futureValuePostTax > 0
      ? (result.totalPrincipal / result.futureValuePostTax) * 100
      : 0;

  const isLoss = result.netInterest < 0;

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2">
          <Badge variant={isIndigo ? 'indigo' : 'teal'}>
            {title}
          </Badge>
          <span className="text-xs font-semibold text-slate-500">핵심 결과 요약</span>
        </div>
      )}

      {/* 최종 수령액 하이라이트 대형 카드 (Ghost Ink-Base 다크 서피스) */}
      <div className="relative overflow-hidden bg-[#15171a] text-white rounded-[24px] p-5 sm:p-6 border border-[#1f2937]">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-[#94a3b8] text-xs font-semibold">
            <Wallet className="w-4 h-4 text-[#d1ff19]" />
            <span>세후 최종 수령액</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-sm text-[11px] font-bold ${
            isLoss ? 'bg-rose-500/20 text-rose-300' : 'bg-[#d1ff19]/10 text-[#d1ff19]'
          }`}>
            <span>{formatMultiple(result.principalMultiple)}</span>
          </div>
        </div>

        <div className="mb-1">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {formatCurrency(result.futureValuePostTax)}
          </div>
          <div className={`text-sm sm:text-base font-semibold mt-0.5 ${
            isLoss ? 'text-rose-400' : 'text-[#d1ff19]'
          }`}>
            {formatKoreanUnit(result.futureValuePostTax)}
          </div>
        </div>

        {/* 원금 및 이자 구성 바 */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between text-[11px] text-[#94a3b8] mb-1 font-medium">
            <span>원금 대비: {principalRatio.toFixed(1)}%</span>
            <span>{isLoss ? '손실률' : '순이익 비중'}: {Math.abs(100 - principalRatio).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`h-full transition-all duration-300 cursor-help ${isLoss ? 'bg-rose-500' : 'bg-slate-500'}`}
                  style={{ width: `${Math.min(100, Math.max(0, principalRatio))}%` }}
                  aria-label="원금 비중"
                />
              </TooltipTrigger>
              <TooltipContent>원금 비중: {principalRatio.toFixed(1)}%</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`h-full transition-all duration-300 cursor-help ${isLoss ? 'bg-rose-400' : 'bg-[#d1ff19]'}`}
                  style={{ width: `${Math.min(100, Math.max(0, 100 - principalRatio))}%` }}
                  aria-label={isLoss ? '손실률' : '이자 비중'}
                />
              </TooltipTrigger>
              <TooltipContent>{isLoss ? '손실률' : '이자 비중'}: {Math.abs(100 - principalRatio).toFixed(1)}%</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* 3단 서브 지표 그리드 (모바일 1열, sm 이상 3열 그리드로 전환하여 금액 텍스트 잘림 방지) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {/* 총 투자 원금 */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between sm:justify-start gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <div className="flex items-center gap-1">
                <PiggyBank className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>총 투자원금</span>
              </div>
              <span className="sm:hidden text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {formatKoreanUnit(result.totalPrincipal)}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
              {formatCurrency(result.totalPrincipal)}
            </div>
            <div className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              {formatKoreanUnit(result.totalPrincipal)}
            </div>
          </CardContent>
        </Card>

        {/* 세후 총 이자 / 손익 */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between sm:justify-start gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <div className="flex items-center gap-1">
                <ArrowUpRight className={`w-3.5 h-3.5 ${isLoss ? 'text-rose-500 rotate-90' : 'text-emerald-500 dark:text-emerald-400'}`} />
                <span>{isLoss ? '순손실액' : '세후 순이자'}</span>
              </div>
              <span className={`sm:hidden text-[11px] font-medium ${isLoss ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
                {formatPercent(result.netReturnRate, true)}
              </span>
            </div>
            <div className={`text-sm sm:text-base font-bold ${isLoss ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {formatCurrency(result.netInterest)}
            </div>
            <div className={`hidden sm:block text-[11px] font-medium mt-0.5 ${isLoss ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-700 dark:text-emerald-300'}`}>
              {formatPercent(result.netReturnRate, true)}
            </div>
          </CardContent>
        </Card>

        {/* 이자 소득세 */}
        <Card>
          <CardContent className="p-3">
            <div className="flex items-center justify-between sm:justify-start gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
                <span>이자 소득세</span>
              </div>
              <span className="sm:hidden text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                세전 {formatCurrency(result.grossInterest)}
              </span>
            </div>
            <div className="text-sm sm:text-base font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(result.taxAmount)}
            </div>
            <div className="hidden sm:block text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
              세전 {formatCurrency(result.grossInterest)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
