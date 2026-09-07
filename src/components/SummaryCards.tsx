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

      {/* 최종 수령액 하이라이트 대형 카드 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-700/50">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold">
            <Wallet className="w-4 h-4 text-teal-400" />
            <span>세후 최종 수령액</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
            isLoss ? 'bg-rose-500/20 text-rose-300' : 'bg-white/10 text-teal-300'
          }`}>
            <span>{formatMultiple(result.principalMultiple)}</span>
          </div>
        </div>

        <div className="mb-1">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {formatCurrency(result.futureValuePostTax)}
          </div>
          <div className={`text-sm sm:text-base font-semibold mt-0.5 ${
            isLoss ? 'text-rose-400' : 'text-teal-300'
          }`}>
            {formatKoreanUnit(result.futureValuePostTax)}
          </div>
        </div>

        {/* 원금 및 이자 구성 바 */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex justify-between text-[11px] text-slate-300 mb-1 font-medium">
            <span>원금 대비: {principalRatio.toFixed(1)}%</span>
            <span>{isLoss ? '손실률' : '순이익 비중'}: {Math.abs(100 - principalRatio).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden flex">
            <div
              className={`h-full transition-all duration-300 ${isLoss ? 'bg-rose-500' : 'bg-slate-400'}`}
              style={{ width: `${Math.min(100, Math.max(0, principalRatio))}%` }}
              title="원금 비중"
            />
            <div
              className={`h-full transition-all duration-300 ${isLoss ? 'bg-rose-400' : 'bg-teal-400'}`}
              style={{ width: `${Math.min(100, Math.max(0, 100 - principalRatio))}%` }}
              title="이자 비중"
            />
          </div>
        </div>
      </div>

      {/* 3단 서브 지표 그리드 (shadcn Card 적용) */}
      <div className="grid grid-cols-3 gap-2">
        {/* 총 투자 원금 */}
        <Card>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
              <PiggyBank className="w-3 h-3 text-slate-400" />
              <span>총 투자원금</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800 truncate">
              {formatCurrency(result.totalPrincipal)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">
              {formatKoreanUnit(result.totalPrincipal)}
            </div>
          </CardContent>
        </Card>

        {/* 세후 총 이자 / 손익 */}
        <Card>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
              <ArrowUpRight className={`w-3 h-3 ${isLoss ? 'text-rose-500 rotate-90' : 'text-emerald-500'}`} />
              <span>{isLoss ? '순손실액' : '세후 순이자'}</span>
            </div>
            <div className={`text-xs sm:text-sm font-bold truncate ${isLoss ? 'text-rose-600' : 'text-emerald-600'}`}>
              {formatCurrency(result.netInterest)}
            </div>
            <div className={`text-[10px] font-medium truncate ${isLoss ? 'text-rose-700' : 'text-emerald-700'}`}>
              {formatPercent(result.netReturnRate, true)}
            </div>
          </CardContent>
        </Card>

        {/* 이자 소득세 */}
        <Card>
          <CardContent className="p-2.5 sm:p-3">
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />
              <span>이자 소득세</span>
            </div>
            <div className="text-xs sm:text-sm font-bold text-rose-600 truncate">
              {formatCurrency(result.taxAmount)}
            </div>
            <div className="text-[10px] text-slate-400 font-medium truncate">
              세전 {formatCurrency(result.grossInterest)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
