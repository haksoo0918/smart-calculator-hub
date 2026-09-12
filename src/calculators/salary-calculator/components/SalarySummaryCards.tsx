import React, { useState } from 'react';
import { SalaryCalculationResult } from '../../../types/salary';
import { formatKoreanUnit, formatNumberWithWon } from '../../../utils/formatters';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Copy, Check, Banknote, ShieldAlert, PieChart, Sparkles } from 'lucide-react';

interface SalarySummaryCardsProps {
  result: SalaryCalculationResult;
}

export const SalarySummaryCards: React.FC<SalarySummaryCardsProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = `[스마트 계산기] 2026 연봉/월급 실수령액 계산 결과
- 세전 ${result.input.paymentType === 'annual' ? '연봉' : '월급'}: ${formatNumberWithWon(result.input.grossAmount)} (${formatKoreanUnit(result.input.grossAmount)})
- 월 예상 실수령액: ${formatNumberWithWon(result.netMonthlySalary)} (${formatKoreanUnit(result.netMonthlySalary)})
- 연간 환산 실수령액: ${formatNumberWithWon(result.netAnnualSalary)} (${formatKoreanUnit(result.netAnnualSalary)})
- 월 총 공제액: ${formatNumberWithWon(result.totalMonthlyDeduction)} (공제율 ${result.totalDeductionRatio}%)
  * 국민연금: ${formatNumberWithWon(result.nationalPension)}
  * 건강보험: ${formatNumberWithWon(result.healthInsurance)}
  * 요양보험: ${formatNumberWithWon(result.longTermCare)}
  * 고용보험: ${formatNumberWithWon(result.employmentInsurance)}
  * 근로소득세: ${formatNumberWithWon(result.incomeTax)}
  * 지방소득세: ${formatNumberWithWon(result.localIncomeTax)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 API 미지원 환경 폴백
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-3">
      {/* 1. 최상단 대형 메인 하이라이트 카드 (월 예상 실수령액) */}
      <div className="relative overflow-hidden rounded-2xl bg-[#15171a] dark:bg-[#1e293b] border border-[#15171a] dark:border-slate-800 text-white p-5 sm:p-6 shadow-sm">
        {/* 우측 상단 배경 장식 효과 */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#d1ff19]/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#d1ff19]/20 text-[#d1ff19] border border-[#d1ff19]/30">
                <Sparkles className="w-3 h-3" />
                월 예상 실수령액
              </span>
              {result.takeHomeRatio > 0 && (
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold border-slate-700 text-slate-300 bg-slate-800/60"
                >
                  실수령 {result.takeHomeRatio}%
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 pt-1">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#d1ff19] tabular-nums">
                {result.netMonthlySalary.toLocaleString('ko-KR')}
                <span className="text-lg sm:text-xl font-medium text-slate-200 ml-1">
                  원
                </span>
              </div>
              <span className="text-xs sm:text-sm font-medium text-slate-400">
                ({formatKoreanUnit(result.netMonthlySalary)})
              </span>
            </div>

            <div className="text-xs text-slate-400 pt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>
                연간 총 환산 수령액:{' '}
                <strong className="text-white font-medium tabular-nums">
                  {formatNumberWithWon(result.netAnnualSalary)}
                </strong>
                <span className="text-slate-400 ml-1">
                  ({formatKoreanUnit(result.netAnnualSalary)})
                </span>
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="self-start sm:self-auto h-8 px-3 text-xs bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-white shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-[#d1ff19]" />
                복사 완료
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1 text-slate-300" />
                결과 복사
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 2. 3단 서브 요약 카드 그리드 (세전 월 환산액, 월 총 공제액, 총 공제율) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 세전 월 환산액 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              세전 월 환산액
            </span>
            <Banknote className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="text-lg font-bold tracking-tight text-[#112220] dark:text-slate-100 tabular-nums">
            {formatNumberWithWon(result.grossMonthlySalary)}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-tight">
            과세 {formatNumberWithWon(result.taxableMonthlySalary)} + 비과세{' '}
            {formatNumberWithWon(result.nonTaxableMonthly)}
          </p>
        </div>

        {/* 월 총 공제액 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              월 총 공제액
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-lg font-bold tracking-tight text-rose-500 tabular-nums">
            -{formatNumberWithWon(result.totalMonthlyDeduction)}
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-tight">
            보험 {formatNumberWithWon(result.totalFourMajorInsurances)} + 세금{' '}
            {formatNumberWithWon(result.totalTax)}
          </p>
        </div>

        {/* 총 공제 비율 */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-[#e5e7eb] dark:border-slate-800 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[#64748b] dark:text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              총 공제 비율
            </span>
            <PieChart className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg font-bold tracking-tight text-[#112220] dark:text-slate-100 tabular-nums">
            {result.totalDeductionRatio}%
          </div>
          <p className="text-[11px] text-[#64748b] dark:text-slate-400 leading-tight">
            연간 총 공제 {formatNumberWithWon(result.totalMonthlyDeduction * 12)}
          </p>
        </div>
      </div>
    </div>
  );
};
