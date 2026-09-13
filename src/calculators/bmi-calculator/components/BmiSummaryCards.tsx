import React, { useState } from 'react';
import { BmiResult } from '../../../types/bmi';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Copy, Check, Activity, Target, ShieldCheck, Scale } from 'lucide-react';

interface BmiSummaryCardsProps {
  result: BmiResult;
}

export const BmiSummaryCards: React.FC<BmiSummaryCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `[BMI & 비만도 측정 결과]
- 나의 BMI: ${result.bmi} (${result.categoryInfo.label})
- 적정 표준 체중: ${result.idealWeight}kg
- 정상 체중 범위: ${result.normalWeightMin}kg ~ ${result.normalWeightMax}kg
- 조절 권장 가이드: ${result.weightDiffLabel}
- 건강 가이드: ${result.healthComment}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadgeVariant = (cat: string): 'lime' | 'secondary' | 'outline' | 'destructive' => {
    switch (cat) {
      case 'normal':
        return 'lime';
      case 'underweight':
        return 'secondary';
      case 'pre-obese':
        return 'outline';
      default:
        return 'destructive';
    }
  };

  const getDiffColor = (status: 'maintain' | 'lose' | 'gain') => {
    switch (status) {
      case 'maintain':
        return 'text-emerald-600 dark:text-[#d1ff19]';
      case 'lose':
        return 'text-rose-500 dark:text-rose-400';
      case 'gain':
        return 'text-blue-500 dark:text-blue-400';
    }
  };

  return (
    <div className="space-y-4">
      {/* 메인 결과 하이라이트 카드 */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[24px] border border-[#e5e7eb] dark:border-slate-800 p-5 sm:p-6 shadow-sm transition-colors relative overflow-hidden">
        {/* 상단 액센트 라인 */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 ${result.categoryInfo.bgColor}`} />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748b] dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                체질량지수 (BMI) 판정 결과
              </span>
              <Badge variant={getStatusBadgeVariant(result.category)} size="sm">
                {result.categoryInfo.label}
              </Badge>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black tabular-nums tracking-tight text-[#112220] dark:text-slate-100">
                {result.bmi}
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-500 dark:text-slate-400">
                kg/m²
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 font-medium pt-1">
              {result.categoryInfo.description}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="self-start sm:self-center h-8 px-2.5 gap-1.5 text-xs border-[#e5e7eb] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#112220] dark:text-slate-100 rounded-lg shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">복사완료</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>결과 복사</span>
              </>
            )}
          </Button>
        </div>

        {/* 하단 건강 실천 팁 배너 */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="text-[#112220] dark:text-[#d1ff19] font-bold shrink-0">💡 건강 가이드:</span>
          <span>{result.healthComment}</span>
        </div>
      </div>

      {/* 3단 서브 요약 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. 나의 적정 표준 체중 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 shadow-2xs transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400 font-semibold mb-1">
            <Target className="w-3.5 h-3.5 text-sky-500" />
            <span>나의 적정 표준 체중</span>
          </div>
          <div className="text-xl sm:text-2xl font-black tabular-nums text-[#112220] dark:text-slate-100">
            {result.idealWeight} <span className="text-sm font-semibold text-slate-500">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            KSSO 표준 체질량 기준
          </p>
        </div>

        {/* 2. 정상 체중 범위 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 shadow-2xs transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400 font-semibold mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>정상 체중 범위</span>
          </div>
          <div className="text-base sm:text-lg font-black tabular-nums text-[#112220] dark:text-slate-100 pt-0.5">
            {result.normalWeightMin} ~ {result.normalWeightMax} <span className="text-xs font-semibold text-slate-500">kg</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            BMI 18.5 - 22.9 구간
          </p>
        </div>

        {/* 3. 체중 조절 목표 */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#e5e7eb] dark:border-slate-800 p-4 shadow-2xs transition-colors">
          <div className="flex items-center gap-1.5 text-xs text-[#64748b] dark:text-slate-400 font-semibold mb-1">
            <Scale className="w-3.5 h-3.5 text-amber-500" />
            <span>체중 조절 목표</span>
          </div>
          <div className={`text-xl sm:text-2xl font-black tabular-nums ${getDiffColor(result.weightDiffStatus)}`}>
            {result.weightDiffStatus === 'maintain'
              ? '유지 중'
              : result.weightDiffStatus === 'lose'
              ? `-${result.weightDiff} kg`
              : `+${result.weightDiff} kg`}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            {result.weightDiffStatus === 'maintain' ? '정상 체중 범위 내' : '정상 범위 진입 기준'}
          </p>
        </div>
      </div>
    </div>
  );
};
